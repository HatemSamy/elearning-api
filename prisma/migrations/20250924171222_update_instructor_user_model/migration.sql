-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'STUDENT';
