/*
  Warnings:

  - You are about to drop the column `accreditation` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `agenda` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `examination` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `outcomes` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `courses` table. All the data in the column will be lost.
  - Added the required column `duration_ar` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_en` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `level` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "accreditation",
DROP COLUMN "agenda",
DROP COLUMN "duration",
DROP COLUMN "examination",
DROP COLUMN "features",
DROP COLUMN "fees",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "objectives",
DROP COLUMN "outcomes",
DROP COLUMN "overview",
ADD COLUMN     "accreditation_ar" TEXT,
ADD COLUMN     "accreditation_en" TEXT,
ADD COLUMN     "agenda_ar" JSONB,
ADD COLUMN     "agenda_en" JSONB,
ADD COLUMN     "delegatesEnrolled" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration_ar" TEXT NOT NULL,
ADD COLUMN     "duration_en" TEXT NOT NULL,
ADD COLUMN     "examination_ar" TEXT,
ADD COLUMN     "examination_en" TEXT,
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "objectives_ar" TEXT[],
ADD COLUMN     "objectives_en" TEXT[],
ADD COLUMN     "outcomes_ar" TEXT,
ADD COLUMN     "outcomes_en" TEXT,
ADD COLUMN     "overview_ar" TEXT,
ADD COLUMN     "overview_en" TEXT,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;
