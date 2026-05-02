import { useEffect, useState } from "react";
import { getPets, createPet, deletePet } from "../services/PetServices";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa"; // Ícones ajudam no mobile

function Pets() {
  const [pets, setPets] = useState([]);
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPets() {
    try {
      const res = await getPets();
      console.log("Pets carregados:", res.data);
      setPets(res.data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createPet({
        nome,
        raca,
        idade: parseInt(idade) || 0,
      });
      console.log("Pet cadastrado:", response.data);
      alert(`${nome} foi cadastrado com sucesso! 🐾`);
      setNome("");
      setRaca("");
      setIdade("");
      await loadPets();
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      alert("Erro ao cadastrar pet. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja remover este pet?")) {
      try {
        await deletePet(id);
        await loadPets();
        alert("Pet removido com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar pet:", error);
        alert("Erro ao remover pet. Tente novamente.");
      }
    }
  }

  return (
    <>
      <Navbar />
      {/* Ajuste de padding: p-4 no mobile, p-10 no desktop */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Responsivo: Empilha no mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Meus Pets 🐾
            </h1>
            <Link
              to="/agendamento"
              className="w-full sm:w-auto text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Agendar Serviço
            </Link>
          </div>

          {/* Formulário de Cadastro: Empilha no mobile (flex-col) */}
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Cadastrar Novo Pet
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Pet *
                  </label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Thor"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raça
                  </label>
                  <input
                    value={raca}
                    onChange={(e) => setRaca(e.target.value)}
                    placeholder="Ex: Labrador"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 3"
                    min="0"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <FaPlus size={14} /> Cadastrar Pet
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Lista de Pets */}
          <div className="bg-white rounded-xl shadow-md p-5 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Meus Pets Cadastrados
            </h2>

            {pets.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">
                  Nenhum pet por aqui ainda.
                </p>
                <p className="text-sm mt-2">
                  Cadastre seu pet para agendar serviços!
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition gap-3"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {pet.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                        <span>
                          <strong>Raça:</strong> {pet.raca || "Não informado"}
                        </span>
                        <span>
                          <strong>Idade:</strong>{" "}
                          {pet.idade
                            ? `${pet.idade} ano${pet.idade > 1 ? "s" : ""}`
                            : "Não informado"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold"
                      title="Remover pet"
                    >
                      <FaTrash size={16} />
                      <span className="hidden sm:inline">Remover</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Pets;
