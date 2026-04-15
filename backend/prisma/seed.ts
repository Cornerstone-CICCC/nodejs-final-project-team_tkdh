import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.quizzes.deleteMany();

  await prisma.quizzes.createMany({
    data: [
      {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        answer: "Ottawa",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: "Mars",
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        answer: "William Shakespeare",
      },
      {
        question: "What is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean",
        ],
        answer: "Pacific Ocean",
      },
      {
        question: "How many continents are there in the world?",
        options: ["5", "6", "7", "8"],
        answer: "7",
      },
      {
        question: "Which country is famous for sushi?",
        options: ["China", "Japan", "Korea", "Thailand"],
        answer: "Japan",
      },
      {
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide",
      },
      {
        question: "Which animal is known as the King of the Jungle?",
        options: ["Tiger", "Elephant", "Lion", "Bear"],
        answer: "Lion",
      },
      {
        question: "What is the freezing point of water?",
        options: ["0°C", "10°C", "32°C", "100°C"],
        answer: "0°C",
      },
      {
        question: "Which language is primarily spoken in Brazil?",
        options: ["Spanish", "Portuguese", "French", "English"],
        answer: "Portuguese",
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
