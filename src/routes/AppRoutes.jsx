import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Agendamento from "../pages/Agendamento";
import AgendamentoCliente from "../pages/AgendamentoCliente";
import MeusAgendamentos from "../pages/MeusAgendamentos";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Pets from "../pages/Pets";
import PetsAdmin from "../pages/PetsAdmin";
import Servicos from "../pages/Servicos";
import Configuracoes from "../pages/Configuracoes";
import PrivateRoute from "./PrivateRoute";
import RequirePetsRoute from "./RequirePetsRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública - acessível sem login */}
          <Route path="/" element={<Home />} />

          {/* Rotas de autenticação - acessíveis sem login */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rota de cadastro de pets - requer apenas login */}
          <Route
            path="/pets"
            element={
              <PrivateRoute>
                <Pets />
              </PrivateRoute>
            }
          />

          {/* Rota de visualização de agendamentos do cliente - requer apenas login */}
          <Route
            path="/meus-agendamentos"
            element={
              <PrivateRoute>
                <MeusAgendamentos />
              </PrivateRoute>
            }
          />

          {/* Rota de agendamento - requer login E ter pelo menos 1 pet cadastrado */}
          <Route
            path="/agendamento"
            element={
              <PrivateRoute>
                <RequirePetsRoute>
                  <AgendamentoCliente />
                </RequirePetsRoute>
              </PrivateRoute>
            }
          />

          {/* Rotas de admin - requerem role="admin" */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute role="admin">
                <Clientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/pets-admin"
            element={
              <PrivateRoute role="admin">
                <PetsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/servicos"
            element={
              <PrivateRoute role="admin">
                <Servicos />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos-admin"
            element={
              <PrivateRoute role="admin">
                <Agendamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/config"
            element={
              <PrivateRoute role="admin">
                <Configuracoes />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
