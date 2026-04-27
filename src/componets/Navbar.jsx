import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-green-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">PetShop 🐾</h1>
      </nav>

      <div className="flex gap-6 font-medium">
        <Link to="/">Home</Link>
        <Link to="/agendamento">Agendar</Link>
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
}

export default Navbar;
