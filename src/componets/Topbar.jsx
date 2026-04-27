function Topbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center rounded-xl">
      <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>

      <div className="flex items-center gap-3">
        <img src="https://i.pravatar.cc/40" className="rounded-full" />
        <span>Administrador</span>
      </div>
    </header>
  );
}

export default Topbar;
