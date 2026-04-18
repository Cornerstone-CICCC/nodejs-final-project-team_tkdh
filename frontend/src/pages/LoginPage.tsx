import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../constants";
import { useAuth } from "../contexts/auth-context";

export function LoginPage() {
  const navigate = useNavigate();
  const { refetch } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/users/register" : "/users/login";
    const body = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.message || "Something went wrong");
        return;
      }

      await refetch();
      navigate("/lobby");
    } catch {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-page__title">Quiz Battle</h1>
      <form className="login-page__form" onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="login-page__error">{error}</p>}
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
        <p className="login-page__toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </form>
    </div>
  );
}
