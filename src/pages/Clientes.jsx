import AdminLayout from "../componets/AdminLayout";

function Clientes() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        Lista de clientes cadastrados.
      </div>
    </AdminLayout>
  );
}

export default Clientes;
