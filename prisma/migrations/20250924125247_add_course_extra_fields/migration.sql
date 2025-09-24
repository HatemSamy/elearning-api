/*
  Warnings:

  - The `outcomes_en` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `outcomes_ar` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "prerequisites_ar" TEXT[],
ADD COLUMN     "prerequisites_en" TEXT[],
ADD COLUMN     "whoShouldAttend_ar" TEXT[],
ADD COLUMN     "whoShouldAttend_en" TEXT[],
DROP COLUMN "outcomes_en",
ADD COLUMN     "outcomes_en" TEXT[],
DROP COLUMN "outcomes_ar",
ADD COLUMN     "outcomes_ar" TEXT[];
