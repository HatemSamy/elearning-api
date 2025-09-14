/*
  Warnings:

  - Added the required column `level` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CourseLevel" AS ENUM ('FOUNDATION', 'INTERNAL_AUDITOR', 'LEAD_AUDITOR', 'LEAD_IMPLEMENTER');

-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "level" "public"."CourseLevel" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."CourseCategory";
