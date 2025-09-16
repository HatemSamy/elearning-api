-- AlterTable
ALTER TABLE "public"."courses" ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "level" SET DATA TYPE "public"."CourseLevel";
