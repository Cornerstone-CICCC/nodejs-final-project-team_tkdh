import { useNavigate } from "react-router-dom";
import { Ranking } from "../components/Result/Ranking";
import { mockTeams } from "../mock";

export function ResultPage() {
  const navigate = useNavigate();

  return (
    <div className="result-page">
      <h1 className="result-page__title">Game Over!</h1>
      <Ranking teams={mockTeams} />
      <button className="result-page__back" onClick={() => navigate("/lobby")}>
        Back to Lobby
      </button>
    </div>
  );
}
