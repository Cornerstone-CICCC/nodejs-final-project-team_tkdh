import { useNavigate } from "react-router-dom";
import { mockTeams } from "../mock";

export function LobbyPage() {
  const navigate = useNavigate();

  return (
    <div className="lobby-page">
      <h1 className="lobby-page__title">Lobby</h1>
      <p className="lobby-page__status">Waiting for players...</p>
      <div className="lobby-page__teams">
        <h2>Teams</h2>
        {mockTeams.map((team) => (
          <div key={team.id} className="lobby-page__team">
            <h3>{team.name}</h3>
            <ul>
              {team.members.map((member) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        className="lobby-page__start"
        onClick={() => navigate("/game")}
      >
        Start Game (dev)
      </button>
    </div>
  );
}
