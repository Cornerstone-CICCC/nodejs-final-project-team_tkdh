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
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const half = Math.ceil(shuffled.length / 2);
  return {
    team1: shuffled.slice(0, half),
    team2: shuffled.slice(half),
  };
};
