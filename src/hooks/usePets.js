import { useApi } from "./useApi";
import { petService } from "../services/petService";
import { useToast } from "./useToast";

/**
 * Hook customizado para gerenciar pets
 * @returns {Object} { pets, loading, error, createPet, deletePet, updatePet, refetch }
 */
export const usePets = () => {
  const { data: pets, loading, error, refetch } = useApi("/pets");
  const toast = useToast();

  const createPet = async (petData) => {
    try {
      const response = await petService.create(petData);
      await refetch();
      toast.success(`${petData.nome} foi cadastrado com sucesso! 🐾`);
      return response.data;
    } catch (error) {
      toast.error("Erro ao cadastrar pet. Tente novamente.");
      throw error;
    }
  };

  const deletePet = async (id) => {
    try {
      await petService.delete(id);
      await refetch();
      toast.success("Pet removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover pet. Tente novamente.");
      throw error;
    }
  };

  const updatePet = async (id, petData) => {
    try {
      const response = await petService.update(id, petData);
      await refetch();
      toast.success("Pet atualizado com sucesso!");
      return response.data;
    } catch (error) {
      toast.error("Erro ao atualizar pet. Tente novamente.");
      throw error;
    }
  };

  return {
    pets: pets || [],
    loading,
    error,
    createPet,
    deletePet,
    updatePet,
    refetch,
  };
};
