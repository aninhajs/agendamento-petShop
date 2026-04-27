import SidebarAdmin from "../componets/SidebarAdmin";
import Topbar from "../componets/Topbar";

function Dashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        <Topbar />

        {/* Cards */}
        <section className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Clientes</h3>
            <p className="text-3xl font-bold text-green-600">120</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Pets</h3>
            <p className="text-3xl font-bold text-blue-600">88</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Hoje</h3>
            <p className="text-3xl font-bold text-yellow-500">16</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Faturamento</h3>
            <p className="text-3xl font-bold text-purple-600">R$ 2.450</p>
          </div>
        </section>

        {/* Tabela */}
        <section className="bg-white mt-10 p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">Agendamentos de Hoje</h2>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Cliente</th>
                <th>Pet</th>
                <th>Serviço</th>
                <th>Horário</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-4">Ana</td>
                <td>Thor</td>
                <td>Banho</td>
                <td>09:00</td>
                <td className="text-green-600">Confirmado</td>
              </tr>

              <tr className="border-b">
                <td className="py-4">Carlos</td>
                <td>Luna</td>
                <td>Tosa</td>
                <td>11:00</td>
                <td className="text-yellow-500">Pendente</td>
              </tr>

              <tr>
                <td className="py-4">Pedro</td>
                <td>Mel</td>
                <td>Vacina</td>
                <td>14:00</td>
                <td className="text-blue-600">Finalizado</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
