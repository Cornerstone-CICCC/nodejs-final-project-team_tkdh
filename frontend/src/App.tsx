import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { LoginPage } from "./pages/LoginPage";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: should set login page if we complete auth features */}
        <Route path="/" element={<Navigate to="/lobby" replace />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
