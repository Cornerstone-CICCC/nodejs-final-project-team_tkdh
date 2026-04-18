import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { API_BASE } from "../constants";
import { socket } from "../socket";
import type { AuthUser } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data: AuthUser = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/users/logout/${user.id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (socket.connected) socket.disconnect();
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
