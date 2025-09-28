-- DropForeignKey
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_instructorId_fkey";

-- CreateTable
CREATE TABLE "public"."instructors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bio" TEXT,
    "specialization" TEXT,
    "social" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instructors_userId_key" ON "public"."instructors"("userId");

-- AddForeignKey
ALTER TABLE "public"."instructors" ADD CONSTRAINT "instructors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."instructors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
