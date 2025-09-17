/*
  Warnings:

  - Made the column `overview_ar` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `overview_en` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `level` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."courses" ALTER COLUMN "overview_ar" SET NOT NULL,
ALTER COLUMN "overview_en" SET NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."CourseLevel";
