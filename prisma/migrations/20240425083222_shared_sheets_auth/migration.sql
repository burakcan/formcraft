/*
  Warnings:

  - You are about to drop the column `organizationId` on the `GoogleSheetsAuthorization` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GoogleSheetsAuthorization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoogleSheetsAuthorization" DROP CONSTRAINT "GoogleSheetsAuthorization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "GoogleSheetsAuthorization" DROP CONSTRAINT "GoogleSheetsAuthorization_userId_fkey";

-- AlterTable
ALTER TABLE "GoogleSheetsAuthorization" DROP COLUMN "organizationId",
DROP COLUMN "userId";
