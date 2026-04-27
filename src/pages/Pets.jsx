import AdminLayout from "../componets/AdminLayout";

function Pets() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Pets</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        Lista de pets cadastrados.
      </div>
    </AdminLayout>
  );
}

export default Pets;
