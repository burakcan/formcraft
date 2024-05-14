/*
  Warnings:

  - You are about to drop the column `paddleBusinessId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `paddleCustomerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `paddleCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PaddleSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaddleSubscription" DROP CONSTRAINT "PaddleSubscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "PaddleSubscription" DROP CONSTRAINT "PaddleSubscription_userId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "paddleBusinessId",
DROP COLUMN "paddleCustomerId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "paddleCustomerId";

-- DropTable
DROP TABLE "PaddleSubscription";

-- DropEnum
DROP TYPE "PaddleCollectionMode";

-- DropEnum
DROP TYPE "PaddleSubscriptionStatus";
