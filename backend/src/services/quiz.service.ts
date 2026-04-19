import quizModel from '../models/quiz.model';

// return <random five questions> and <the five answers>
export const fetchRandomQuizzes = async () => {
  const allQuizzes = await quizModel.fetchAll();
  const fetchFiveQuizzes = () => {
    const shuffledQuizzes = [...allQuizzes].sort(() => Math.random() - 0.5);
    return shuffledQuizzes.slice(0, 5);
  };

  const randomFiveQuizzes = fetchFiveQuizzes();
  const fiveQuizzesWithoutAnswer = randomFiveQuizzes.map((quiz) => {
    return {
      id: quiz.id,
      question: quiz.question,
      options: quiz.options,
    };
  });

  const fiveAnswers = randomFiveQuizzes.map((quiz) => quiz.answer);

  return {
    fiveQuizzesWithoutAnswer,
    fiveAnswers,
  };
};

export const assingTeams = (players: string[]) => {
  const suffled = [...players].sort(() => Math.random() - 0.5);
  return {
    team1: suffled.slice(0, 2),
    team2: suffled.slice(2, 4),
  };
};
