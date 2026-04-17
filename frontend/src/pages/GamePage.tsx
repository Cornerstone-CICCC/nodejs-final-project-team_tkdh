import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { QuestionCard } from "../components/Quiz/QuestionCard";
import { Timer } from "../components/Quiz/Timer";
import { TeamChat } from "../components/Chat/TeamChat";
import { mockQuiz } from "../mock";
import { useSocket } from "../hooks/useSocket";

export function GamePage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { messages, sendMessage } = useSocket();

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-page__quiz">
          <Timer timeLeft={20} />

          <QuestionCard
            quiz={mockQuiz}
            questionIndex={0}
            totalQuestions={5}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
          />

          <button
            className="game-page__next"
            onClick={() => navigate("/result")}
          >
            Go to Result
          </button>
        </div>

        <div className="game-page__chat">
          <TeamChat messages={messages} onSend={sendMessage} />
        </div>
      </div>
    </>
  );
}
