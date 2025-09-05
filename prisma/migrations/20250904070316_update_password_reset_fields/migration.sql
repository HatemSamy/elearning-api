/*
  Warnings:

  - You are about to drop the column `resetPasswordEmail` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "resetPasswordEmail",
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetPasswordTokenExpires" TIMESTAMP(3);
