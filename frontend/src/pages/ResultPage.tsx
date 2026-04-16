import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { Ranking } from "../components/Result/Ranking";
import { mockTeams } from "../mock";

export function ResultPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="result-page">
        <h1 className="result-page__title">Game Over</h1>
        <p className="result-page__subtitle">Here are the final team scores</p>

        <Ranking teams={mockTeams} />

        <button
          className="result-page__back"
          onClick={() => navigate("/lobby")}
        >
          Back to Lobby
        </button>
      </div>
    </>
  );
}