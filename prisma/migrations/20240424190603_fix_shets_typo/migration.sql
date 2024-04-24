/*
  Warnings:

  - You are about to drop the column `googleShetsConnectionId` on the `Craft` table. All the data in the column will be lost.
  - You are about to drop the `GoogleShetsConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_googleShetsConnectionId_fkey";

-- AlterTable
ALTER TABLE "Craft" DROP COLUMN "googleShetsConnectionId",
ADD COLUMN     "googleSheetsConnectionId" TEXT;

-- DropTable
DROP TABLE "GoogleShetsConnection";

-- CreateTable
CREATE TABLE "GoogleSheetsConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sheetId" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expiry_date" INTEGER NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "GoogleSheetsConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_googleSheetsConnectionId_fkey" FOREIGN KEY ("googleSheetsConnectionId") REFERENCES "GoogleSheetsConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
