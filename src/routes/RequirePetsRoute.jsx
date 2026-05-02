import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function RequirePetsRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasPets, setHasPets] = useState(false);

  useEffect(() => {
    checkPets();
  }, []);

  async function checkPets() {
    try {
      const response = await api.get("/pets");
      if (response.data.length === 0) {
        alert(
          "⚠️ Você precisa cadastrar pelo menos um pet antes de fazer um agendamento!\n\nSerá redirecionado para a página de cadastro de pets.",
        );
        navigate("/pets");
      } else {
        setHasPets(true);
      }
    } catch (error) {
      console.error("Erro ao verificar pets:", error);
      alert("Erro ao verificar seus pets. Redirecionando...");
      navigate("/pets");
    } finally {
      setLoading(false);
    }
  }

  // Não logado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Carregando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando seus pets...</p>
        </div>
      </div>
    );
  }

  // Tem pets
  if (hasPets) {
    return children;
  }

  return null;
}

export default RequirePetsRoute;
