import api from "./api";

/**
 * Serviço para gerenciar pets
 */
export const petService = {
  getAll: () => api.get("/pets"),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post("/pets", data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
};

// Mantém compatibilidade com o código antigo
export const getPets = petService.getAll;
export const createPet = petService.create;
export const deletePet = petService.delete;
