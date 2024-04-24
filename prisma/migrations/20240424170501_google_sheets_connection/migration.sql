-- AlterTable
ALTER TABLE "Craft" ADD COLUMN     "googleShetsConnectionId" TEXT;

-- CreateTable
CREATE TABLE "GoogleShetsConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sheetId" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expiry_date" INTEGER NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "GoogleShetsConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_googleShetsConnectionId_fkey" FOREIGN KEY ("googleShetsConnectionId") REFERENCES "GoogleShetsConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
