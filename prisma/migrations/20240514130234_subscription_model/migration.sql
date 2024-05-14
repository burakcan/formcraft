-- CreateEnum
CREATE TYPE "PaddleSubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'PAUSED', 'TRIALING');

-- CreateEnum
CREATE TYPE "PaddleCollectionMode" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateTable
CREATE TABLE "PaddleSubscription" (
    "id" TEXT NOT NULL,
    "occured_at" TIMESTAMP(3) NOT NULL,
    "status" "PaddleSubscriptionStatus" NOT NULL,
    "customer_id" TEXT NOT NULL,
    "collection_mode" "PaddleCollectionMode" NOT NULL,
    "price_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "scheduled_change" JSONB NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "PaddleSubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaddleSubscription" ADD CONSTRAINT "PaddleSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaddleSubscription" ADD CONSTRAINT "PaddleSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
