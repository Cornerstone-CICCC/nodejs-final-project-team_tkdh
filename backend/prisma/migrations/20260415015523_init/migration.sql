-- AlterTable
ALTER TABLE "User" ADD COLUMN     "team" INTEGER;

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
