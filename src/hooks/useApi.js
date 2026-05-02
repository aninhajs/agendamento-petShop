import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Hook customizado para fazer requisições à API
 * @param {string} endpoint - Endpoint da API
 * @param {Array} dependencies - Dependências para refazer a requisição
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error(`Erro ao buscar ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch };
};
