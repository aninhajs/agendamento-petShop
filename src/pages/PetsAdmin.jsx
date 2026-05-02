import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function PetsAdmin() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPets();
  }, []);

  async function carregarPets() {
    try {
      const res = await api.get("/pets/admin/all");
      setPets(res.data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      alert("Erro ao carregar pets");
    } finally {
      setLoading(false);
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Pets Cadastrados</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Carregando...</p>
        ) : pets.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum pet cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Nome do Pet</th>
                  <th className="text-left p-3">Raça</th>
                  <th className="text-left p-3">Idade</th>
                  <th className="text-left p-3">Dono</th>
                  <th className="text-left p-3">Email do Dono</th>
                  <th className="text-left p-3">Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{pet.id}</td>
                    <td className="p-3 font-semibold">{pet.name}</td>
                    <td className="p-3">{pet.raca || "N/A"}</td>
                    <td className="p-3">{pet.idade || "N/A"}</td>
                    <td className="p-3">{pet.User?.name || "N/A"}</td>
                    <td className="p-3 text-gray-600">
                      {pet.User?.email || "N/A"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {formatarData(pet.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total de pets cadastrados:</strong> {pets.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default PetsAdmin;
