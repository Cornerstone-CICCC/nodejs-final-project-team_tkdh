import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../contexts/auth-context";
import { DEFAULT_ROOM } from "../constants";

export function LobbyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected, users, connect, joinRoom } = useSocket();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    connect();
  }, [user, connect]);

  useEffect(() => {
    if (!user || !isConnected || hasJoinedRef.current) return;
    joinRoom(DEFAULT_ROOM);
    hasJoinedRef.current = true;
  }, [user, isConnected, joinRoom]);

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="lobby-page">
        <div className="lobby-page__header">
          <h1 className="lobby-page__title">Team Lobby</h1>
          <p className="lobby-page__status">
            {isConnected
              ? `Connected as ${user.name} — ${users.length} player(s) in room`
              : "Connecting..."}
          </p>
        </div>

        <div className="lobby-page__teams-wrapper">
          <h2 className="lobby-page__subtitle">Connected Players</h2>

          <div className="lobby-page__teams">
            <div className="lobby-page__team">
              <h3>{DEFAULT_ROOM}</h3>
              <ul>
                {users.map((u) => (
                  <li key={u.id} className="lobby-page__member">
                    <span className="lobby-page__member-dot"></span>
                    {u.name}
                  </li>
                ))}
              </ul>
            </div>
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
