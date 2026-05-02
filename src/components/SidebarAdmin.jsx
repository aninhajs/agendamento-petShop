import { useState } from "react"; // 1. Importar o hook
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaDog,
  FaCalendarAlt,
  FaCog,
  FaBars,
  FaConciergeBell,
} from "react-icons/fa";

function SidebarAdmin() {
  // 2. Criar o estado de expandido (começa verdadeiro)
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-green-700 text-white p-6 transition-all duration-300 min-h-screen`}
    >
      {/* 3. Botão para alternar */}
      <div className="flex items-center justify-between mb-10">
        {isExpanded && <h1 className="text-2xl font-bold">Pet Admin</h1>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-green-600 p-2 rounded"
        >
          <FaBars size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaHome className="text-xl" />
          {isExpanded && <span>Dashboard</span>} {/* 4. Texto condicional */}
        </Link>

        <Link
          to="/clientes"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaUsers className="text-xl" />
          {isExpanded && <span>Clientes</span>}
        </Link>

        <Link
          to="/pets-admin"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaDog className="text-xl" />
          {isExpanded && <span>Pets</span>}
        </Link>

        <Link
          to="/servicos"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaConciergeBell className="text-xl" />
          {isExpanded && <span>Serviços</span>}
        </Link>

        <Link
          to="/agendamentos-admin"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaCalendarAlt className="text-xl" />
          {isExpanded && <span>Agendamentos</span>}
        </Link>

        <Link
          to="/config"
          className="flex items-center gap-3 hover:bg-green-600 p-2 rounded"
        >
          <FaCog className="text-xl" />
          {isExpanded && <span>Config</span>}
        </Link>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
