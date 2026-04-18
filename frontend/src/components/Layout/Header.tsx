import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

/* 🔔 Bell Icon */
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
    >
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

/* ⚙️ Settings Icon */
function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 000-6l-1.2-.4a6.9 6.9 0 00-.5-1.2l.7-1.1a1.7 1.7 0 00-2.4-2.4l-1.1.7a6.9 6.9 0 00-1.2-.5L9 2.6a1.7 1.7 0 00-6 0l-.4 1.2a6.9 6.9 0 00-1.2.5l-1.1-.7a1.7 1.7 0 00-2.4 2.4l.7 1.1a6.9 6.9 0 00-.5 1.2L2.6 9a1.7 1.7 0 000 6l1.2.4a6.9 6.9 0 00.5 1.2l-.7 1.1a1.7 1.7 0 002.4 2.4l1.1-.7a6.9 6.9 0 001.2.5L9 21.4a1.7 1.7 0 006 0l.4-1.2a6.9 6.9 0 001.2-.5l1.1.7a1.7 1.7 0 002.4-2.4l-.7-1.1a6.9 6.9 0 00.5-1.2z" />
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="app-header__left">
        {/* LOGO */}
        <div className="app-header__logo">
          <span>Q U I Z</span>
          <span>A R E N A</span>
        </div>

        {/* NAV */}
        <nav className="app-header__nav">
          <Link
            to="/lobby"
            className={`app-header__link ${
              location.pathname === "/lobby" ? "active" : ""
            }`}
          >
            Lobby
          </Link>

          <Link
            to="/game"
            className={`app-header__link ${
              location.pathname === "/game" ? "active" : ""
            }`}
          >
            Game
          </Link>

          <Link
            to="/result"
            className={`app-header__link ${
              location.pathname === "/result" ? "active" : ""
            }`}
          >
            Stats
          </Link>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="app-header__right">
        <div className="app-header__icons">
          <button className="icon-button">
            <BellIcon />
          </button>

          <button className="icon-button">
            <SettingsIcon />
          </button>
        </div>

        {user ? (
          <>
            <span className="app-header__user">{user.name}</span>
            <button className="app-header__cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="app-header__cta">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}