import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({
  path: ".env.local",
});

const prisma = new PrismaClient();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: false,
});

async function syncProducts() {
  console.info("Syncing products...");

  const products = await stripe.products.list({
    active: true,
  });

  console.info("Fetched products: ", products.data.length);

  for (const product of products.data) {
    console.info("Syncing product: ", product.id);

    const productData = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      livemode: product.livemode,
      created: new Date(product.created * 1000),
      updated: new Date(product.updated * 1000),
      metadata: product.metadata,
      defaultPriceId: product.default_price
        ? product.default_price
        : null,
    }

    await prisma.stripeProduct.upsert({
      where: { id: product.id },
      update: productData,
      create: productData,
    });
  }

  console.info("Synced products!");
}

async function syncPrices() {
  console.info("Syncing prices...");

  const prices = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
  });

  console.info("Fetched prices: ", prices.data.length);

  for (const price of prices.data) {
    console.info("Syncing price: ", price.id);

    if (!price.product.active) {
      console.info("Product is not active, skipping price...");
      continue;
    }

    const data = {
      id: price.id,
      active: price.active,
      created: new Date(price.created * 1000),
      currency: price.currency,
      type: price.type,
      unit_amount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      interval_count: price.recurring?.interval_count ?? null,
      metadata: price.metadata,
      productId: price.product.id,
      lookup_key: price.lookup_key,
    };

    await prisma.stripePrice.upsert({
      where: {
        id: price.id,
      },
      update: data,
      create: data,
    });
  }

  console.info("Synced prices!");
}

export async function syncStripe() {
  await syncProducts();
  await syncPrices();
}

syncStripe();