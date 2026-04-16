import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { mockTeams } from "../mock";

export function LobbyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="lobby-page">
        <div className="lobby-page__header">
          <h1 className="lobby-page__title">Team Lobby</h1>
          <p className="lobby-page__status">Waiting for players to join...</p>
        </div>

        <div className="lobby-page__teams-wrapper">
          <h2 className="lobby-page__subtitle">Teams</h2>

          <div className="lobby-page__teams">
            {mockTeams.map((team) => (
              <div key={team.id} className="lobby-page__team">
                <h3>{team.name}</h3>
                <ul>
                  {team.members.map((member) => (
                    <li key={member.id} className="lobby-page__member">
                      <span className="lobby-page__member-dot"></span>
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <button
          className="lobby-page__start"
          onClick={() => navigate("/game")}
        >
          Start Game
        </button>
      </div>
    </>
  );
}