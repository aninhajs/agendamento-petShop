import api from "./api";

/**
 * Serviço para gerenciar agendamentos
 */
export const appointmentService = {
  // Admin
  getAll: () => api.get("/agendamentos/admin"),

  // Cliente
  getMyAppointments: () => api.get("/agendamentos/meus"),

  // CRUD
  create: (data) => api.post("/agendamentos", data),
  update: (id, data) => api.put(`/agendamentos/${id}`, data),
  delete: (id) => api.delete(`/agendamentos/${id}`),

  // Estatísticas
  getStats: () => api.get("/agendamentos/stats"),
  getStatusStats: () => api.get("/agendamentos/stats/status"),
  getRevenueStats: () => api.get("/agendamentos/stats/revenue"),
  getTopServices: () => api.get("/agendamentos/stats/top-services"),
};
