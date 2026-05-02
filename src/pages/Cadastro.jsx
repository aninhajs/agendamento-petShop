import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar telefone
    if (!formData.telefone || formData.telefone.trim() === "") {
      setError("Telefone é obrigatório para receber notificações");
      return;
    }

    // Validar formato do telefone (mínimo 10 dígitos)
    const telefoneNumeros = formData.telefone.replace(/\D/g, "");
    if (telefoneNumeros.length < 10) {
      setError("Telefone inválido. Use o formato: (00) 00000-0000");
      return;
    }

    // Validar se as senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      // Formatar telefone para enviar ao backend (formato internacional)
      const telefoneLimpo = formData.telefone.replace(/\D/g, "");
      const telefoneFormatado = telefoneLimpo.startsWith("55")
        ? `+${telefoneLimpo}`
        : `+55${telefoneLimpo}`;

      // Fazer requisição ao backend para cadastrar
      const response = await api.post("/auth/register", {
        name: formData.nome,
        email: formData.email,
        telefone: telefoneFormatado,
        password: formData.senha,
        role: "client",
      });

      // Login automático após cadastro
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      alert("Cadastro realizado com sucesso!");

      // Redirecionar para página de agendamento
      navigate("/agendamento");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar cadastro");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-600">
              Preencha os dados para começar a agendar
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Nome Completo */}
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Telefone/WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  📱 Obrigatório para receber confirmações e lembretes
                </p>
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirme sua senha"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                Criar Conta
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          {/* <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Ao criar sua conta você terá:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Agendamento rápido e
                fácil
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Histórico de serviços
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Cadastro de múltiplos
                pets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Lembretes automáticos
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Cadastro;
