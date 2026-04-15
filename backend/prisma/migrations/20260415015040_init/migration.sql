-- CreateTable
CREATE TABLE "Quizzes" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id")
);
