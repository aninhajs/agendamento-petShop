import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaDog, FaCalendarAlt, FaCog } from "react-icons/fa";

function SidebarAdmin() {
  return (
    <aside className="w-64 bg-green-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-10">Pet Admin 🐾</h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaHome className="text-xl" /> Dashboard
        </Link>
        <Link
          to="/clientes"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaUsers className="text-xl" /> Clientes
        </Link>
        <Link
          to="/pets"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaDog className="text-xl" /> Pets
        </Link>
        <Link
          to="/agendamentos-admin"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaCalendarAlt className="text-xl" /> Agendamentos
        </Link>
        <Link
          to="/config"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaCog className="text-xl" /> Config
        </Link>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
