/*
  Warnings:

  - The required column `confirmationCode` was added to the `EmailConnection` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "EmailConnection" ADD COLUMN     "confirmationCode" TEXT NOT NULL;
