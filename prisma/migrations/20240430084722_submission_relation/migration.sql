/*
  Warnings:

  - Added the required column `craftId` to the `CraftSubmission` table without a default value. This is not possible if the table is not empty.
  - Made the column `craftVersionId` on table `CraftSubmission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `craftId` on table `CraftVersion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CraftSubmission" ADD COLUMN     "craftId" TEXT NOT NULL,
ALTER COLUMN "craftVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CraftVersion" ALTER COLUMN "craftId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CraftSubmission" ADD CONSTRAINT "CraftSubmission_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
