import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { StripePrice, StripeProduct } from "@prisma/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorType } from "@/lib/errors";
import db from "../db";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

type UserOrOrganization =
  | {
      userId: string;
    }
  | {
      organizationId: string;
    };

export async function getOrCreateCustomer(where: UserOrOrganization) {
  return db.$transaction(async (tx) => {
    const existingCustomer = await tx.stripeCustomer.findFirst({
      where,
    });

    if (existingCustomer) {
      return existingCustomer;
    }

    if ("id" in where) {
      throw new Error(ErrorType.Not_Found);
    }

    const authData = auth();

    if ("userId" in where) {
      if (!authData || !authData.userId || authData.userId !== where.userId) {
        throw new Error(ErrorType.Unauthorized);
      }

      const user = await tx.user.findFirst({
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

      return tx.stripeCustomer.create({
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

      const organization = await tx.organization.findFirst({
        where: { id: where.organizationId },
      });

      if (!organization) {
        throw new Error(ErrorType.Not_Found);
      }

      const clerkOrganization = await clerkClient.organizations.getOrganization(
        {
          organizationId: authData.orgId,
        }
      );

      const stripeCustomer = await stripe.customers.create({
        name: clerkOrganization.name,
        metadata: {
          organizationId: organization.id,
        },
      });

      return tx.stripeCustomer.create({
        data: {
          id: stripeCustomer.id,
          organizationId: where.organizationId,
        },
      });
    }
  });
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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer: customer.id,
    ui_mode: "hosted",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}${returnPath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}${returnPath}?canceled=true`,
  });

  return session;
}

export async function createCustomerPortalSession(owner: UserOrOrganization) {
  const customer = await getOrCreateCustomer(owner);

  if (!customer) {
    throw new Error(ErrorType.Not_Found);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
  });

  return session;
}

export async function getUserCharges(owner: UserOrOrganization) {
  const customer = await getOrCreateCustomer(owner);

  if (!customer) {
    throw new Error(ErrorType.Not_Found);
  }

  return await stripe.charges.list({
    customer: customer.id,
  });
}
