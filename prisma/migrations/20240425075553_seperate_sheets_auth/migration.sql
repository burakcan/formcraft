/*
  Warnings:

  - You are about to drop the column `access_token` on the `GoogleSheetsConnection` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_date` on the `GoogleSheetsConnection` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `GoogleSheetsConnection` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `GoogleSheetsConnection` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `GoogleSheetsConnection` table. All the data in the column will be lost.
  - Added the required column `googleSheetsAuthorizationId` to the `GoogleSheetsConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoogleSheetsConnection" DROP COLUMN "access_token",
DROP COLUMN "expiry_date",
DROP COLUMN "refresh_token",
DROP COLUMN "scope",
DROP COLUMN "token_type",
ADD COLUMN     "connectionProblem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleSheetsAuthorizationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GoogleSheetsAuthorization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expiry_date" BIGINT NOT NULL,
    "scope" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "GoogleSheetsAuthorization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoogleSheetsConnection" ADD CONSTRAINT "GoogleSheetsConnection_googleSheetsAuthorizationId_fkey" FOREIGN KEY ("googleSheetsAuthorizationId") REFERENCES "GoogleSheetsAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSheetsAuthorization" ADD CONSTRAINT "GoogleSheetsAuthorization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSheetsAuthorization" ADD CONSTRAINT "GoogleSheetsAuthorization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
