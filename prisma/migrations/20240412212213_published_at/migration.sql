/*
  Warnings:

  - You are about to drop the column `liveVersionId` on the `Craft` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Craft" DROP CONSTRAINT "Craft_liveVersionId_fkey";

-- AlterTable
ALTER TABLE "Craft" DROP COLUMN "liveVersionId";

-- AlterTable
ALTER TABLE "CraftVersion" ADD COLUMN     "publishedAt" TIMESTAMP(3);
