/*
  Warnings:

  - The `examination_en` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `examination_ar` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "includes_ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "includes_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "examination_en",
ADD COLUMN     "examination_en" JSONB,
DROP COLUMN "examination_ar",
ADD COLUMN     "examination_ar" JSONB;
