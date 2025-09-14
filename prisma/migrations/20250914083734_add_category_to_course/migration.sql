/*
  Warnings:

  - Added the required column `category` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CourseCategory" AS ENUM ('FOUNDATION', 'INTERNAL_AUDITOR', 'LEAD_AUDITOR', 'LEAD_IMPLEMENTER');

-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "category" "public"."CourseCategory" NOT NULL,
ADD COLUMN     "features" JSONB;

-- CreateTable
CREATE TABLE "public"."cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_courseId_key" ON "public"."cart"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart" ADD CONSTRAINT "cart_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
