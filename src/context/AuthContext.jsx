import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário ao montar o componente
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("token");
          delete api.defaults.headers.Authorization;
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  async function login(email, senha) {
    const response = await api.post("/auth/login", {
      email,
      password: senha,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(user);

    return user;
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
