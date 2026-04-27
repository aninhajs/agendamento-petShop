import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Agendamento from "../pages/Agendamento";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Pets from "../pages/Pets";
import Configuracoes from "../pages/Configuracoes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/agendamentos-admin" element={<Agendamento />} />
        <Route path="/config" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
