/*
  Warnings:

  - You are about to drop the column `craftId` on the `EmailConnection` table. All the data in the column will be lost.
  - You are about to drop the column `craftId` on the `WebhookConnection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailConnection" DROP CONSTRAINT "EmailConnection_craftId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookConnection" DROP CONSTRAINT "WebhookConnection_craftId_fkey";

-- AlterTable
ALTER TABLE "Craft" ADD COLUMN     "emailConnectionId" TEXT,
ADD COLUMN     "webhookConnectionId" TEXT;

-- AlterTable
ALTER TABLE "EmailConnection" DROP COLUMN "craftId";

-- AlterTable
ALTER TABLE "WebhookConnection" DROP COLUMN "craftId";

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_webhookConnectionId_fkey" FOREIGN KEY ("webhookConnectionId") REFERENCES "WebhookConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_emailConnectionId_fkey" FOREIGN KEY ("emailConnectionId") REFERENCES "EmailConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
