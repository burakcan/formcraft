import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type {
  StripePrice,
  StripeProduct,
  StripeSubscription,
} from "@prisma/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Stripe from "stripe";
import { ErrorType } from "@/lib/errors";
import db from "../db";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
  apiVersion: "2024-04-10",
});

type UserOrOrganization =
  | {
      id: string; // Stripe customer ID
    }
  | {
      userId: string; // Clerk user ID
    }
  | {
      organizationId: string; // Clerk organization ID
    };

export async function getOrCreateCustomer(where: UserOrOrganization) {
  const existingCustomer = await db.stripeCustomer.findFirst({
    where,
  });

  if (existingCustomer) {
    return existingCustomer;
  }

  if ("id" in where) {
    // there is a stripe customer with this id, but it's not in our database
    throw new Error(ErrorType.Not_Found);
  }

  const authData = auth();

  if ("userId" in where) {
    if (!authData || !authData.userId || authData.userId !== where.userId) {
      throw new Error(ErrorType.Unauthorized);
    }

    const user = await db.user.findFirst({
      where: { id: where.userId },
    });

    if (!user) {
      throw new Error(ErrorType.Not_Found);
    }

    const clerkUser = await clerkClient.users.getUser(authData.userId);

    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );

    const stripeCustomer = await stripe.customers.create({
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: primaryEmail?.emailAddress || undefined,
      metadata: {
        userId: user.id,
      },
    });

    return db.stripeCustomer.create({
      data: {
        id: stripeCustomer.id,
        userId: where.userId,
      },
    });
  } else if ("organizationId" in where) {
    if (
      !authData ||
      !authData.orgId ||
      authData.orgId !== where.organizationId
    ) {
      throw new Error(ErrorType.Unauthorized);
    }

    const organization = await db.organization.findFirst({
      where: { id: where.organizationId },
    });

    if (!organization) {
      throw new Error(ErrorType.Not_Found);
    }

    const clerkOrganization = await clerkClient.organizations.getOrganization({
      organizationId: authData.orgId,
    });

    const stripeCustomer = await stripe.customers.create({
      name: clerkOrganization.name,
      metadata: {
        organizationId: organization.id,
      },
    });

    return db.stripeCustomer.create({
      data: {
        id: stripeCustomer.id,
        organizationId: where.organizationId,
      },
    });
  }
}

export async function upsertStripeProduct(object: Stripe.Product) {
  const product = await stripe.products.retrieve(object.id);

  const data: StripeProduct = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    livemode: product.livemode,
    created: new Date(product.created * 1000),
    updated: new Date(product.updated * 1000),
    metadata: product.metadata,
    defaultPriceId: product.default_price
      ? (product.default_price as string)
      : null,
  };

  await db.stripeProduct.upsert({
    where: {
      id: product.id,
    },
    update: data,
    create: data,
  });
}

export async function deleteStripeProduct(id: string) {
  await db.stripeProduct.delete({
    where: {
      id,
    },
  });
}

export async function upsertStripePrice(object: Stripe.Price, retryCount = 0) {
  const price = await stripe.prices.retrieve(object.id);

  const data: StripePrice = {
    id: price.id,
    active: price.active,
    created: new Date(price.created * 1000),
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    metadata: price.metadata,
    productId: price.product as string,
    lookup_key: price.lookup_key,
  };

  try {
    await db.stripePrice.upsert({
      where: {
        id: price.id,
      },
      update: data,
      create: data,
    });
  } catch (e) {
    if (
      (e as PrismaClientKnownRequestError).code === "P2003" &&
      retryCount < 5
    ) {
      await new Promise((r) => setTimeout(r, 1000));
      await upsertStripePrice(object, retryCount + 1);
    }
  }
}

export async function deleteStripePrice(id: string) {
  await db.stripePrice.delete({
    where: {
      id,
    },
  });
}

export async function createCheckoutSession(
  owner: UserOrOrganization,
  priceId: string,
  returnPath: string
): Promise<Stripe.Checkout.Session> {
  const customer = await getOrCreateCustomer(owner);

  if (!customer) {
    throw new Error(ErrorType.Not_Found);
  }

  const existingSubscription = await db.stripeSubscription.findFirst({
    where: {
      customerId: customer.id,
    },
  });

  const success_url = new URL(`${process.env.NEXT_PUBLIC_URL}${returnPath}`);
  const cancel_url = new URL(`${process.env.NEXT_PUBLIC_URL}${returnPath}`);

  success_url.searchParams.append("success", "true");
  success_url.searchParams.append("session_id", "{CHECKOUT_SESSION_ID}");
  cancel_url.searchParams.append("canceled", "true");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    ui_mode: "hosted",
    subscription_data: existingSubscription ? {} : { trial_period_days: 7 },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: success_url.toString(),
    cancel_url: cancel_url.toString(),
  });

  return session;
}

export async function createCustomerPortalSession(
  owner: UserOrOrganization,
  returnPath: string
) {
  const customer = await getOrCreateCustomer(owner);

  if (!customer) {
    throw new Error(ErrorType.Not_Found);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_URL}${returnPath}`,
  });

  return session;
}

export async function getStripeCharges(owner: UserOrOrganization) {
  const customer = await getOrCreateCustomer(owner);

  if (!customer) {
    throw new Error(ErrorType.Not_Found);
  }

  return await stripe.charges.list({
    customer: customer.id,
  });
}

export async function upsertStripeSubscription(
  subscription: Stripe.Subscription
) {
  const dateOrNull = (date: number | null) =>
    date ? new Date(date * 1000) : null;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const customer = await getOrCreateCustomer({ id: customerId });

  if (!customer) {
    // This subscription is created for a customer that doesn't exist in our database
    // it could be a customer that was created directly in Stripe
    // but it shouldn't happen
    throw new Error(ErrorType.Not_Found);
  }

  const default_payment_method =
    typeof subscription.default_payment_method === "string"
      ? subscription.default_payment_method
      : subscription.default_payment_method?.id;

  const items = subscription.items.data.map((item) => ({
    id: item.id,
    object: item.object,
    created: new Date(item.created * 1000),
    discounts: item.discounts.map((discount) =>
      typeof discount === "string" ? discount : discount.id
    ),
    metadata: item.metadata,
    priceId: item.price.id,
    quantity: item.quantity || null,
  }));

  const data: StripeSubscription = {
    id: subscription.id,
    cancel_at_period_end: subscription.cancel_at_period_end,
    currency: subscription.currency,
    current_period_end: new Date(subscription.current_period_end * 1000),
    current_period_start: new Date(subscription.current_period_start * 1000),
    trial_end: dateOrNull(subscription.trial_end),
    trial_start: dateOrNull(subscription.trial_start),
    ended_at: dateOrNull(subscription.ended_at),
    cancel_at: dateOrNull(subscription.cancel_at),
    canceled_at: dateOrNull(subscription.canceled_at),
    customerId: customerId,
    default_payment_method: default_payment_method || null,
    description: subscription.description || null,
    metadata: subscription.metadata,
    status: subscription.status,
    userId: customer.userId || null,
    organizationId: customer.organizationId || null,
  };

  const existingSubscriptionItems = await db.stripeSubscriptionItem.findMany({
    where: { subscriptionId: subscription.id },
  });

  for (const item of existingSubscriptionItems) {
    if (!items.find((i) => i.id === item.id)) {
      await db.stripeSubscriptionItem.update({
        where: { id: item.id },
        data: item,
      });
    }
  }

  await db.stripeSubscription.upsert({
    where: { id: subscription.id },
    update: data,
    create: {
      ...data,
      items: {
        createMany: {
          data: items,
        },
      },
    },
  });
}

export async function getPriceByLookupKey(lookup_key: string) {
  return await db.stripePrice.findFirst({
    where: {
      lookup_key,
    },
  });
}

export async function getStripeSubscription(owner: UserOrOrganization) {
  return await db.$transaction(async (tx) => {
    const allSubscriptions = await tx.stripeSubscription.findMany({
      where: { ...owner },
    });

    const activeOrTriallingSubscriptions = allSubscriptions.filter(
      (s) => s.status === "active" || s.status === "trialing"
    );

    if (activeOrTriallingSubscriptions.length === 0) {
      return allSubscriptions[0] || null;
    }

    return activeOrTriallingSubscriptions[0];
  });
}
