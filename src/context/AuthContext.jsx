import React, { createContext, useState, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("triviaUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback((username, accessCode) => {
    setLoading(true);
    setError(null);
    try {
      // En Vite se usa import.meta.env
      const correctAccessCode = import.meta.env.VITE_ACCESS_CODE || "1234";

      if (!username || username.trim() === "") {
        throw new Error("El nombre de usuario es requerido");
      }
      if (accessCode !== correctAccessCode) {
        throw new Error("Código de acceso inválido");
      }

      const userData = { username, authenticated: true, loginTime: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem("triviaUser", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("triviaUser");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  );
};