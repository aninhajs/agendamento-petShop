import { useEffect, useState } from "react";
import api from "../services/api";
import SidebarAdmin from "../components/SidebarAdmin";
import Topbar from "../components/Topbar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaPaw,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";

function Dashboard() {
  const [dados, setDados] = useState([]);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPets: 0,
    agendamentosHoje: 0,
    faturamentoMes: "0.00",
  });
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    load();
    loadStats();
    loadChartData();
  }, []);

  async function load() {
    try {
      const res = await api.get("/agendamentos/admin");
      setDados(res.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/agendamentos/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }

  async function loadChartData() {
    try {
      const [statusRes, revenueRes, servicesRes] = await Promise.all([
        api.get("/agendamentos/stats/status"),
        api.get("/agendamentos/stats/revenue"),
        api.get("/agendamentos/stats/top-services"),
      ]);

      setStatusData(statusRes.data);
      setRevenueData(revenueRes.data);
      setTopServices(servicesRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados dos gráficos:", error);
    }
  }

  async function atualizar(id, status) {
    try {
      await api.put(`/agendamentos/${id}`, { status });
      await load();
      await loadStats();
      await loadChartData();
      alert(`Status atualizado para "${status}" com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Topbar />

        {/* Cards de Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-100 text-sm font-medium">
                  Total de Clientes
                </h3>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {stats.totalClientes}
                </p>
              </div>
              <FaUsers className="text-5xl text-blue-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-100 text-sm font-medium">
                  Total de Pets
                </h3>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {stats.totalPets}
                </p>
              </div>
              <FaPaw className="text-5xl text-green-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-100 text-sm font-medium">
                  Agendamentos Hoje
                </h3>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {stats.agendamentosHoje}
                </p>
              </div>
              <FaCalendarCheck className="text-5xl text-yellow-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-100 text-sm font-medium">
                  Faturamento Mês
                </h3>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  R$ {parseFloat(stats.faturamentoMes).toFixed(2)}
                </p>
              </div>
              <FaMoneyBillWave className="text-5xl text-purple-200 opacity-80" />
            </div>
          </div>
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
          {/* Gráfico de Faturamento Mensal */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaChartLine className="text-2xl text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Faturamento - Últimos 6 Meses
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Faturamento"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Status dos Agendamentos */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaChartPie className="text-2xl text-green-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Status dos Agendamentos
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Serviços Mais Solicitados */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <FaChartBar className="text-2xl text-yellow-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Top 5 Serviços Mais Solicitados
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topServices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#10B981" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Agendamentos Recentes */}
        <section className="bg-white mt-6 md:mt-10 p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
            Gerenciar Agendamentos
          </h2>

          {dados.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {dados.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Cliente
                        </p>
                        <p className="font-semibold text-gray-800">
                          {item.user?.nome || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Pets
                        </p>
                        <p className="font-semibold text-gray-800">
                          {item.appointmentPets?.length || 0} pet(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Data
                        </p>
                        <p className="font-semibold text-gray-800">
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Hora
                        </p>
                        <p className="font-semibold text-gray-800">
                          {item.hora}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">
                          Status:{" "}
                          <span
                            className={`font-bold ${
                              item.status === "aprovado"
                                ? "text-green-600"
                                : item.status === "cancelado"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {item.status === "pendente" && (
                            <>
                              <button
                                onClick={() => atualizar(item.id, "aprovado")}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm font-medium transition"
                              >
                                ✓ Aprovar
                              </button>

                              <button
                                onClick={() => atualizar(item.id, "cancelado")}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm font-medium transition"
                              >
                                ✗ Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
