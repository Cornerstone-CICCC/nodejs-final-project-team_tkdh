import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { QuestionCard } from "../components/Quiz/QuestionCard";
import { Timer } from "../components/Quiz/Timer";
import { TeamChat } from "../components/Chat/TeamChat";
import { useSocket } from "../contexts/socket-context";

const QUESTION_DURATION = 30;
const PREP_DURATION = 10;

export function GamePage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [prepLeft, setPrepLeft] = useState(PREP_DURATION);
  const { gameState, messages, sendMessage, submitAnswer } = useSocket();
  const {
    currentQuestion,
    questionIndex,
    totalQuestions,
    myTeam,
    phase,
    correctAnswer,
    teamAnswer,
  } = gameState;

  const selectedOption =
    currentQuestion && teamAnswer
      ? currentQuestion.options.indexOf(teamAnswer)
      : null;

  useEffect(() => {
    setTimeLeft(QUESTION_DURATION);
  }, [questionIndex]);

  useEffect(() => {
    if (phase !== "question") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase !== "starting") return;
    setPrepLeft(PREP_DURATION);
    const id = setInterval(() => {
      setPrepLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "finished") navigate("/result");
  }, [phase, navigate]);

  const handleSelect = (index: number) => {
    if (!currentQuestion || teamAnswer !== null) return;
    submitAnswer(currentQuestion.options[index]);
  };

  if (phase === "starting" || phase === "waiting") {
    return (
      <>
        <Header />
        <div className="game-page game-page--prep">
          <div className="game-page__prep">
            <h1 className="game-page__prep-title">Get Ready!</h1>
            {myTeam && (
              <p className="game-page__team-badge">
                You are on <strong>{myTeam}</strong>
              </p>
            )}
            <p className="game-page__prep-subtitle">
              First question starts in
            </p>
            <div className="game-page__prep-count">{prepLeft}</div>
            <p className="game-page__prep-hint">
              Discuss strategy with your team in the chat while you wait.
            </p>
          </div>
          <div className="game-page__chat">
            <TeamChat messages={messages} onSend={sendMessage} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-page__quiz">
          {myTeam && (
            <p className="game-page__team-badge">
              You are on <strong>{myTeam}</strong>
            </p>
          )}

          <Timer timeLeft={timeLeft} />

          {currentQuestion ? (
            <QuestionCard
              quiz={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              selectedOption={selectedOption}
              onSelect={handleSelect}
            />
          ) : (
            <p className="game-page__waiting">Waiting for next question...</p>
          )}

          {teamAnswer && phase === "question" && (
            <p className="game-page__team-answer">
              Your team's answer: <strong>{teamAnswer}</strong>
            </p>
          )}

          {phase === "result" && correctAnswer && (
            <p className="game-page__result">
              Correct answer: <strong>{correctAnswer}</strong>
            </p>
          )}
        </div>

        <div className="game-page__chat">
          <TeamChat messages={messages} onSend={sendMessage} />
        </div>
      </div>
    </>
  );
}
