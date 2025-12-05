import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("barge_token"));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("barge_admin");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("barge_token", token);
    } else {
      localStorage.removeItem("barge_token");
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("barge_admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("barge_admin");
    }
  }, [admin]);

  const login = async (email, password) => {
    const res = await request("POST", "/api/admin/login", {
      body: { email, password },
    });
    setToken(res.token);
    setAdmin(res.admin);
    return res;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
