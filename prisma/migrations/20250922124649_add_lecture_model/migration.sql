/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lecture` table. All the data in the column will be lost.
  - Added the required column `overview_ar` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview_en` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ar` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Lecture" DROP COLUMN "createdAt",
DROP COLUMN "overview",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "overview_ar" TEXT NOT NULL,
ADD COLUMN     "overview_en" TEXT NOT NULL,
ADD COLUMN     "title_ar" TEXT NOT NULL,
ADD COLUMN     "title_en" TEXT NOT NULL;
