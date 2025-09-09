/*
  Warnings:

  - You are about to drop the column `description` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `courses` table. All the data in the column will be lost.
  - Added the required column `accreditation` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fees` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "description",
DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "accreditation" TEXT NOT NULL,
ADD COLUMN     "agenda" JSONB,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "examination" TEXT,
ADD COLUMN     "fees" TEXT NOT NULL,
ADD COLUMN     "instructorId" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "objectives" TEXT[],
ADD COLUMN     "outcomes" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "paymentMethods" TEXT[],
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
