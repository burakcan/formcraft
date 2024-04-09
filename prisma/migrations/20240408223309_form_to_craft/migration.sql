/*
  Warnings:

  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_liveVersionId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_userId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_formVersionId_fkey";

-- DropForeignKey
ALTER TABLE "FormVersion" DROP CONSTRAINT "FormVersion_formId_fkey";

-- DropTable
DROP TABLE "Form";

-- DropTable
DROP TABLE "FormSubmission";

-- DropTable
DROP TABLE "FormVersion";

-- CreateTable
CREATE TABLE "Craft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "liveVersionId" TEXT,

    CONSTRAINT "Craft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CraftVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "craftId" TEXT,
    "data" JSONB NOT NULL,

    CONSTRAINT "CraftVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CraftSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "craftVersionId" TEXT,
    "data" JSONB NOT NULL,

    CONSTRAINT "CraftSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_liveVersionId_fkey" FOREIGN KEY ("liveVersionId") REFERENCES "CraftVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CraftVersion" ADD CONSTRAINT "CraftVersion_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CraftSubmission" ADD CONSTRAINT "CraftSubmission_craftVersionId_fkey" FOREIGN KEY ("craftVersionId") REFERENCES "CraftVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
