import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaCalendarAlt,
  FaClock,
  FaPaw,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";

function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {
    try {
      const response = await api.get("/agendamentos/meus");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      alert("Erro ao carregar seus agendamentos");
    } finally {
      setLoading(false);
    }
  }

  async function cancelarAgendamento(id) {
    if (
      !window.confirm(
        "⚠️ Tem certeza que deseja cancelar este agendamento?\n\nEsta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      await api.put(`/agendamentos/${id}`, { status: "cancelado" });
      alert("✅ Agendamento cancelado com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("❌ Erro ao cancelar agendamento. Tente novamente.");
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800 border-green-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "aprovado":
        return "✓ Aprovado";
      case "pendente":
        return "⏳ Pendente";
      case "cancelado":
        return "✗ Cancelado";
      default:
        return status;
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Meus Agendamentos
            </h1>
            <p className="text-gray-600">
              Visualize e gerencie seus agendamentos
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
              </div>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="text-5xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Nenhum agendamento encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Você ainda não tem agendamentos. Que tal agendar um serviço para
                seu pet?
              </p>
              <Link
                to="/agendamento"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Fazer Agendamento
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Informações principais */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                            agendamento.status,
                          )}`}
                        >
                          {getStatusText(agendamento.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Data e Hora */}
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-green-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Data e Hora
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {new Date(agendamento.data).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                            <p className="text-gray-600">{agendamento.hora}</p>
                          </div>
                        </div>

                        {/* Pets */}
                        <div className="flex items-start gap-3">
                          <FaPaw className="text-green-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Pets
                            </p>
                            {agendamento.appointmentPets?.map((ap) => (
                              <p
                                key={ap.id}
                                className="text-gray-800 font-semibold"
                              >
                                {ap.pet.name}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Serviços */}
                        <div className="flex items-start gap-3">
                          <FaMoneyBillWave className="text-green-600 text-xl mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Serviços
                            </p>
                            {agendamento.appointmentServices?.map((as) => (
                              <div
                                key={as.id}
                                className="flex justify-between gap-4"
                              >
                                <p className="text-gray-800 font-semibold">
                                  {as.service.nome}
                                </p>
                                <p className="text-gray-600">
                                  R$ {parseFloat(as.preco).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bairro e Taxa */}
                        {agendamento.bairro && (
                          <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">
                                Bairro (Taxa Taxi)
                              </p>
                              <p className="text-gray-800 font-semibold">
                                {agendamento.bairro}
                              </p>
                              {agendamento.taxaBairro && (
                                <p className="text-gray-600">
                                  + R${" "}
                                  {parseFloat(agendamento.taxaBairro).toFixed(
                                    2,
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Observações */}
                      {agendamento.observacoes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium mb-1">
                            Observações:
                          </p>
                          <p className="text-gray-700">
                            {agendamento.observacoes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-3">
                      {agendamento.status === "pendente" && (
                        <button
                          onClick={() => cancelarAgendamento(agendamento.id)}
                          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition whitespace-nowrap"
                        >
                          Cancelar Agendamento
                        </button>
                      )}
                      {agendamento.status === "aprovado" && (
                        <button
                          onClick={() => cancelarAgendamento(agendamento.id)}
                          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition whitespace-nowrap"
                        >
                          Solicitar Cancelamento
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão para novo agendamento */}
          {!loading && agendamentos.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/agendamento"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Fazer Novo Agendamento
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MeusAgendamentos;
