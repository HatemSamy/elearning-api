/*
  Warnings:

  - The `location` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CourseLocation" AS ENUM ('ELEARNING', 'ONSITE', 'HYBRID');

-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "location",
ADD COLUMN     "location" "public"."CourseLocation"[];
