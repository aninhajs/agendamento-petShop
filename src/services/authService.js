import api from "./api";

/**
 * Serviço de autenticação
 */
export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
  },
};
