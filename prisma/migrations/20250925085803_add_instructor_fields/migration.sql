-- AlterTable
ALTER TABLE "public"."instructors" ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "yearsOfExperience" INTEGER;
