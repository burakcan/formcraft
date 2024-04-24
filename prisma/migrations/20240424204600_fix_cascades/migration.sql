-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_emailConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_googleSheetsConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_webhookConnectionId_fkey";

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_webhookConnectionId_fkey" FOREIGN KEY ("webhookConnectionId") REFERENCES "WebhookConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_emailConnectionId_fkey" FOREIGN KEY ("emailConnectionId") REFERENCES "EmailConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_googleSheetsConnectionId_fkey" FOREIGN KEY ("googleSheetsConnectionId") REFERENCES "GoogleSheetsConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
