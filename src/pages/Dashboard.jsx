function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-8">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">Clientes: 120</div>

        <div className="bg-white p-6 rounded-xl shadow">Pets: 88</div>

        <div className="bg-white p-6 rounded-xl shadow">
          Agendamentos Hoje: 16
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
