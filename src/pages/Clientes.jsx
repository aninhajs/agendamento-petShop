import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarClientes() {
    try {
      const res = await api.get("/auth/users");
      setClientes(res.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Carregando...</p>
        ) : clientes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{cliente.id}</td>
                    <td className="p-3 font-semibold">{cliente.name}</td>
                    <td className="p-3">{cliente.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          cliente.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {cliente.role === "admin" ? "Administrador" : "Cliente"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {formatarData(cliente.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Clientes;
