import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPaw, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logoPet from "../assets/logo-pet.jpg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img src={logoPet} alt="PetShop Logo" className="h-12 w-auto" />
        </Link>

        {/* Botão Hambúrguer (Mobile Only) */}
        <button
          className="text-gray-700 md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links de Navegação (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-green-600 font-medium transition"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/pets"
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                Meus Pets
              </Link>
              <Link
                to="/meus-agendamentos"
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                Meus Agendamentos
              </Link>
              <Link
                to="/agendamento"
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                Agendar
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-600" />
                  <span className="text-gray-700 font-medium">{user.nome}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  <FaSignOutAlt />
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/cadastro"
                className="px-5 py-2 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Cadastrar
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Menu Mobile (Mobile Only) */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"} bg-white border-t border-gray-100 p-4`}
      >
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-green-600 font-medium p-2"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/pets"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium p-2"
              >
                Meus Pets
              </Link>
              <Link
                to="/meus-agendamentos"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium p-2"
              >
                Meus Agendamentos
              </Link>
              <Link
                to="/agendamento"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium p-2"
              >
                Agendar
              </Link>

              <hr className="border-gray-100" />

              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaUser className="text-green-600" />
                  <span className="text-gray-700 font-medium">{user.nome}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg font-semibold"
                >
                  <FaSignOutAlt />
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <hr className="border-gray-100" />

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-5 py-2 bg-green-600 text-white rounded-lg font-semibold"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                onClick={() => setIsOpen(false)}
                className="text-center px-5 py-2 border-2 border-green-600 text-green-600 rounded-lg font-semibold"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
