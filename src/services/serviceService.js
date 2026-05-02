import api from "./api";

/**
 * Serviço para gerenciar serviços do pet shop
 */
export const serviceService = {
  getAll: () => api.get("/servicos"),
  getActive: async () => {
    const response = await api.get("/servicos");
    return response.data.filter((s) => s.ativo);
  },
  getById: (id) => api.get(`/servicos/${id}`),
  create: (data) => api.post("/servicos", data),
  update: (id, data) => api.put(`/servicos/${id}`, data),
  delete: (id) => api.delete(`/servicos/${id}`),
};
