import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Carregando dados do usuário
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  //  Não logado
  if (!user) {
    return <Navigate to="/login" />;
  }

  //  Não tem permissão
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  //  autorizado
  return children;
}

export default PrivateRoute;
