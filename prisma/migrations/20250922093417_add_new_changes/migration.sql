-- CreateEnum
CREATE TYPE "public"."CourseType" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "type" "public"."CourseType" NOT NULL DEFAULT 'PAID';

-- CreateTable
CREATE TABLE "public"."lectures" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "overview" TEXT,
    "duration" TEXT,
    "videoUrl" TEXT,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lectures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lectures_courseId_number_key" ON "public"."lectures"("courseId", "number");

-- AddForeignKey
ALTER TABLE "public"."lectures" ADD CONSTRAINT "lectures_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
