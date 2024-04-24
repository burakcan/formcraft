/*
  Warnings:

  - Added the required column `sheetUrl` to the `GoogleSheetsConnection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_emailConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_googleSheetsConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_webhookConnectionId_fkey";

-- AlterTable
ALTER TABLE "GoogleSheetsConnection" ADD COLUMN     "sheetUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_webhookConnectionId_fkey" FOREIGN KEY ("webhookConnectionId") REFERENCES "WebhookConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_emailConnectionId_fkey" FOREIGN KEY ("emailConnectionId") REFERENCES "EmailConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_googleSheetsConnectionId_fkey" FOREIGN KEY ("googleSheetsConnectionId") REFERENCES "GoogleSheetsConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
