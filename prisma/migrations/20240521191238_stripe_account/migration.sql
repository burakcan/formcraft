-- CreateTable
CREATE TABLE "StripeAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "charges_enabled" BOOLEAN NOT NULL DEFAULT false,
    "transfers_enabled" BOOLEAN NOT NULL DEFAULT false,
    "details_submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StripeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeAccount_id_key" ON "StripeAccount"("id");

-- AddForeignKey
ALTER TABLE "StripeAccount" ADD CONSTRAINT "StripeAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeAccount" ADD CONSTRAINT "StripeAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
