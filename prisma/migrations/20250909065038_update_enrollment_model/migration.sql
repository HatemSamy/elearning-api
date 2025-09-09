/*
  Warnings:

  - Added the required column `EnrollmentMode` to the `enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EnrollmentMode" AS ENUM ('ELEARNING', 'ONSITE', 'HYBRID');

-- AlterTable
ALTER TABLE "public"."enrollments" ADD COLUMN     "EnrollmentMode" "public"."EnrollmentMode" NOT NULL;
