import api from "./api";

/**
 * Serviço para gerenciar taxas de bairro
 */
export const neighborhoodService = {
  getAll: () => api.get("/taxas-bairro"),
  getByName: (bairro) => api.get(`/taxas-bairro/${bairro}`),
  create: (data) => api.post("/taxas-bairro", data),
  update: (id, data) => api.put(`/taxas-bairro/${id}`, data),
  delete: (id) => api.delete(`/taxas-bairro/${id}`),
};
