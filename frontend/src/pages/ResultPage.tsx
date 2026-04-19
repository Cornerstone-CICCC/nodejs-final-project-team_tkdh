import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { Ranking } from "../components/Result/Ranking";
import { useSocket } from "../contexts/socket-context";

export function ResultPage() {
  const navigate = useNavigate();
  const { gameState, resetGame } = useSocket();

  const handleBack = () => {
    resetGame();
    navigate("/lobby");
  };

  return (
    <>
      <Header />
      <div className="result-page">
        <h1 className="result-page__title">Game Over</h1>
        <p className="result-page__subtitle">Here are the final team scores</p>

        <Ranking scores={gameState.scores} myTeam={gameState.myTeam} />

        <button className="result-page__back" onClick={handleBack}>
          Back to Lobby
        </button>
      </div>
    </>
  );
}
