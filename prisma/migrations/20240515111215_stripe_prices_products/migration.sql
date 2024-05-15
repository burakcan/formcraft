-- CreateEnum
CREATE TYPE "StripePriceType" AS ENUM ('recurring', 'one_time');

-- CreateEnum
CREATE TYPE "StripePriceInterval" AS ENUM ('month', 'year', 'week', 'day');

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePrice" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "type" "StripePriceType" NOT NULL,
    "unit_amount" INTEGER,
    "interval" "StripePriceInterval",
    "interval_count" INTEGER,
    "metadata" JSONB NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "StripePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "livemode" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "defaultPriceId" TEXT,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_id_key" ON "StripeCustomer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_organizationId_key" ON "StripeCustomer"("organizationId");

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
