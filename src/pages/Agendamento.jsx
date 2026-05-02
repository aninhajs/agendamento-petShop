import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaCalendarCheck, FaClock, FaDog, FaEllipsisV } from "react-icons/fa";
import api from "../services/api";

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarAgendamentos() {
    try {
      const res = await api.get("/agendamentos/admin");
      setAgendamentos(res.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      alert("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function alterarStatus(id, novoStatus) {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      alert("Status atualizado com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-700";
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      case "cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "aprovado":
        return "Confirmado";
      case "pendente":
        return "Pendente";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      {/* h-full ou min-h-[calc(100vh-160px)] 
         Garante que o container principal ocupe o espaço restante da tela 
      */}
      <div className="flex flex-col min-h-[80vh]">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendarCheck className="text-green-600" /> Agendamentos
          </h1>
          <button
            onClick={carregarAgendamentos}
            className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition shadow-sm active:scale-95"
          >
            Atualizar
          </button>
        </div>

        {/* Lista de Horários - flex-1 faz este card esticar para preencher o fundo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-700">
              Todos os Agendamentos
            </h2>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-4">Carregando...</p>
              </div>
            ) : agendamentos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center text-gray-500">
                <p>Nenhum agendamento encontrado.</p>
              </div>
            ) : (
              agendamentos.map((item) => {
                // Calcular valor total do agendamento
                let valorTotal = 0;
                item.appointmentServices?.forEach((as) => {
                  valorTotal += parseFloat(as.preco || 0);
                });
                if (item.taxaBairro) {
                  valorTotal += parseFloat(item.taxaBairro);
                }

                return (
                  <div
                    key={item.id}
                    className="p-4 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-8 flex-1">
                      <div className="flex items-center gap-2 text-green-700 font-bold bg-green-50 px-3 py-2 rounded-lg w-fit h-fit">
                        <FaClock size={14} />
                        {item.hora}
                      </div>

                      <div className="space-y-2 flex-1">
                        {/* Data */}
                        <div className="text-sm font-semibold text-gray-600">
                          📅 {formatarData(item.data)}
                        </div>

                        {/* Pets */}
                        <div className="flex items-center gap-2">
                          <FaDog className="text-gray-400" />
                          <div className="flex flex-wrap gap-2">
                            {item.appointmentPets?.map((ap) => (
                              <span
                                key={ap.id}
                                className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium"
                              >
                                {ap.pet.name}
                              </span>
                            )) || (
                              <span className="text-sm text-gray-500">
                                Nenhum pet
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Serviços */}
                        <div className="space-y-1">
                          {item.appointmentServices?.map((as) => (
                            <div
                              key={as.id}
                              className="text-sm text-gray-600 flex items-center justify-between gap-4"
                            >
                              <span>
                                • {as.service.nome}
                                {item.appointmentPets?.length > 1 && (
                                  <span className="text-xs text-gray-400 ml-1">
                                    (× {item.appointmentPets.length} pets)
                                  </span>
                                )}
                              </span>
                              <span className="font-semibold text-green-600">
                                R$ {parseFloat(as.preco).toFixed(2)}
                              </span>
                            </div>
                          )) || (
                            <span className="text-sm text-gray-500">
                              Nenhum serviço
                            </span>
                          )}
                        </div>

                        {/* Taxa de Bairro */}
                        {item.bairro && item.taxaBairro && (
                          <div className="text-sm text-gray-600 flex items-center justify-between gap-4">
                            <span>• Taxa {item.bairro}</span>
                            <span className="font-semibold text-orange-600">
                              + R$ {parseFloat(item.taxaBairro).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Valor Total */}
                        <div className="text-base font-bold text-gray-800 flex items-center justify-between pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span className="text-green-600">
                            R$ {valorTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Cliente */}
                        {item.user && (
                          <div className="text-xs text-gray-500 mt-2">
                            Cliente: {item.user.nome} | {item.user.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none pt-3 md:pt-0">
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${getStatusColor(
                          item.status,
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-2">
                          <FaEllipsisV />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button
                            onClick={() => alterarStatus(item.id, "aprovado")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => alterarStatus(item.id, "cancelado")}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Agendamentos;
