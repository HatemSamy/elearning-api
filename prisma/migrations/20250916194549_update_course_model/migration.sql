/*
  Warnings:

  - You are about to drop the column `accreditation_ar` on the `courses` table. All the data in the column will be lost.
  - The `language` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `accreditation_en` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "accreditation_ar",
ADD COLUMN     "features_ar" TEXT[],
ADD COLUMN     "features_en" TEXT[],
ADD COLUMN     "fees" DOUBLE PRECISION,
ADD COLUMN     "location" "public"."CourseLocation"[],
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[],
ALTER COLUMN "accreditation_en" SET NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "public"."CourseLevel"[];
