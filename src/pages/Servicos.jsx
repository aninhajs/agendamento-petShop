import { useState, useEffect } from "react";
import api from "../services/api";
import SidebarAdmin from "../components/SidebarAdmin";
import Topbar from "../components/Topbar";

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [taxasBairro, setTaxasBairro] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("servicos");

  // Estados para formulário de serviço
  const [editandoServico, setEditandoServico] = useState(null);
  const [formServico, setFormServico] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao: "60",
    tipo: "normal",
  });

  // Estados para formulário de horário
  const [editandoHorario, setEditandoHorario] = useState(null);
  const [formHorario, setFormHorario] = useState({
    diaSemana: "1",
    horaInicio: "",
    horaFim: "",
  });

  // Estados para formulário de taxa de bairro
  const [editandoTaxa, setEditandoTaxa] = useState(null);
  const [formTaxa, setFormTaxa] = useState({
    bairro: "",
    taxa: "",
  });

  const diasSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ];

  useEffect(() => {
    carregarServicos();
    carregarHorarios();
    carregarTaxasBairro();
  }, []);

  async function carregarServicos() {
    try {
      const res = await api.get("/servicos");
      setServicos(res.data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  }

  async function carregarHorarios() {
    try {
      const res = await api.get("/horarios");
      setHorarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    }
  }

  // ========== FUNÇÕES DE SERVIÇOS ==========

  function handleChangeServico(e) {
    setFormServico({ ...formServico, [e.target.name]: e.target.value });
  }

  async function salvarServico(e) {
    e.preventDefault();
    try {
      if (editandoServico) {
        await api.put(`/servicos/${editandoServico.id}`, formServico);
      } else {
        await api.post("/servicos", formServico);
      }
      setFormServico({ nome: "", descricao: "", preco: "", duracao: "60" });
      setEditandoServico(null);
      carregarServicos();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao salvar serviço");
    }
  }

  function editarServico(servico) {
    setEditandoServico(servico);
    setFormServico({
      nome: servico.nome,
      descricao: servico.descricao || "",
      preco: servico.preco,
      duracao: servico.duracao,
      tipo: servico.tipo || "normal",
    });
  }

  async function deletarServico(id) {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return;
    try {
      await api.delete(`/servicos/${id}`);
      carregarServicos();
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      alert("Erro ao deletar serviço");
    }
  }

  function cancelarEdicaoServico() {
    setEditandoServico(null);
    setFormServico({
      nome: "",
      descricao: "",
      preco: "",
      duracao: "60",
      tipo: "normal",
    });
  }

  // ========== FUNÇÕES DE HORÁRIOS ==========

  function handleChangeHorario(e) {
    setFormHorario({ ...formHorario, [e.target.name]: e.target.value });
  }

  async function salvarHorario(e) {
    e.preventDefault();
    try {
      const dados = {
        ...formHorario,
        diaSemana: parseInt(formHorario.diaSemana),
      };

      if (editandoHorario) {
        await api.put(`/horarios/${editandoHorario.id}`, dados);
      } else {
        await api.post("/horarios", dados);
      }
      setFormHorario({ diaSemana: "1", horaInicio: "", horaFim: "" });
      setEditandoHorario(null);
      carregarHorarios();
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      alert("Erro ao salvar horário");
    }
  }

  function editarHorario(horario) {
    setEditandoHorario(horario);
    setFormHorario({
      diaSemana: horario.diaSemana.toString(),
      horaInicio: horario.horaInicio,
      horaFim: horario.horaFim,
    });
  }

  async function deletarHorario(id) {
    if (!confirm("Tem certeza que deseja deletar este horário?")) return;
    try {
      await api.delete(`/horarios/${id}`);
      carregarHorarios();
    } catch (error) {
      console.error("Erro ao deletar horário:", error);
      alert("Erro ao deletar horário");
    }
  }

  function cancelarEdicaoHorario() {
    setEditandoHorario(null);
    setFormHorario({ diaSemana: "1", horaInicio: "", horaFim: "" });
  }

  // ========== FUNÇÕES DE TAXAS DE BAIRRO ==========

  async function carregarTaxasBairro() {
    try {
      const res = await api.get("/taxas-bairro");
      setTaxasBairro(res.data);
    } catch (error) {
      console.error("Erro ao carregar taxas:", error);
    }
  }

  function handleChangeTaxa(e) {
    setFormTaxa({ ...formTaxa, [e.target.name]: e.target.value });
  }

  async function salvarTaxa(e) {
    e.preventDefault();
    try {
      if (editandoTaxa) {
        await api.put(`/taxas-bairro/${editandoTaxa.id}`, formTaxa);
      } else {
        await api.post("/taxas-bairro", formTaxa);
      }
      setFormTaxa({ bairro: "", taxa: "" });
      setEditandoTaxa(null);
      carregarTaxasBairro();
      alert("Taxa salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar taxa:", error);
      alert(error.response?.data?.msg || "Erro ao salvar taxa");
    }
  }

  function editarTaxa(taxa) {
    setEditandoTaxa(taxa);
    setFormTaxa({
      bairro: taxa.bairro,
      taxa: taxa.taxa,
    });
  }

  async function deletarTaxa(id) {
    if (!confirm("Tem certeza que deseja deletar esta taxa?")) return;
    try {
      await api.delete(`/taxas-bairro/${id}`);
      carregarTaxasBairro();
      alert("Taxa deletada!");
    } catch (error) {
      console.error("Erro ao deletar taxa:", error);
      alert("Erro ao deletar taxa");
    }
  }

  function cancelarEdicaoTaxa() {
    setEditandoTaxa(null);
    setFormTaxa({ bairro: "", taxa: "" });
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        <Topbar />

        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-6">
            Gerenciar Serviços e Horários
          </h1>

          {/* Abas */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setAbaAtiva("servicos")}
              className={`pb-3 px-4 font-semibold ${
                abaAtiva === "servicos"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setAbaAtiva("horarios")}
              className={`pb-3 px-4 font-semibold ${
                abaAtiva === "horarios"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Horários Disponíveis
            </button>
            <button
              onClick={() => setAbaAtiva("taxas")}
              className={`pb-3 px-4 font-semibold ${
                abaAtiva === "taxas"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Taxas por Bairro
            </button>
          </div>

          {/* ========== ABA SERVIÇOS ========== */}
          {abaAtiva === "servicos" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">
                  {editandoServico ? "Editar Serviço" : "Novo Serviço"}
                </h2>
                <form onSubmit={salvarServico} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formServico.nome}
                      onChange={handleChangeServico}
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="Ex: Banho e Tosa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <textarea
                      name="descricao"
                      value={formServico.descricao}
                      onChange={handleChangeServico}
                      className="w-full border rounded-lg px-4 py-2"
                      rows="3"
                      placeholder="Descreva o serviço..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        name="preco"
                        value={formServico.preco}
                        onChange={handleChangeServico}
                        required
                        step="0.01"
                        min="0"
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Duração (min)
                      </label>
                      <input
                        type="number"
                        name="duracao"
                        value={formServico.duracao}
                        onChange={handleChangeServico}
                        min="15"
                        step="15"
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tipo de Serviço *
                    </label>
                    <select
                      name="tipo"
                      value={formServico.tipo}
                      onChange={handleChangeServico}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                      <option value="normal">Serviço Normal</option>
                      <option value="taxi">Taxi Pet</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editandoServico ? "Atualizar" : "Cadastrar"}
                    </button>
                    {editandoServico && (
                      <button
                        type="button"
                        onClick={cancelarEdicaoServico}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Lista de Serviços */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">Serviços Cadastrados</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {servicos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum serviço cadastrado
                    </p>
                  ) : (
                    servicos.map((servico) => (
                      <div
                        key={servico.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">
                              {servico.nome}
                            </h3>
                            {servico.descricao && (
                              <p className="text-sm text-gray-600 mt-1">
                                {servico.descricao}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              servico.ativo
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {servico.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold text-green-600 text-lg">
                              R$ {parseFloat(servico.preco).toFixed(2)}
                            </span>
                            <span className="ml-3">
                              ⏱ {servico.duracao} min
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editarServico(servico)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deletarServico(servico.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA HORÁRIOS ========== */}
          {abaAtiva === "horarios" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">
                  {editandoHorario ? "Editar Horário" : "Novo Horário"}
                </h2>
                <form onSubmit={salvarHorario} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Dia da Semana *
                    </label>
                    <select
                      name="diaSemana"
                      value={formHorario.diaSemana}
                      onChange={handleChangeHorario}
                      required
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      {diasSemana.map((dia) => (
                        <option key={dia.value} value={dia.value}>
                          {dia.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Hora Início *
                      </label>
                      <input
                        type="time"
                        name="horaInicio"
                        value={formHorario.horaInicio}
                        onChange={handleChangeHorario}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Hora Fim *
                      </label>
                      <input
                        type="time"
                        name="horaFim"
                        value={formHorario.horaFim}
                        onChange={handleChangeHorario}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editandoHorario ? "Atualizar" : "Cadastrar"}
                    </button>
                    {editandoHorario && (
                      <button
                        type="button"
                        onClick={cancelarEdicaoHorario}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Lista de Horários */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">Horários Cadastrados</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {horarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum horário cadastrado
                    </p>
                  ) : (
                    horarios.map((horario) => (
                      <div
                        key={horario.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">
                              {
                                diasSemana.find(
                                  (d) => d.value === horario.diaSemana,
                                )?.label
                              }
                            </h3>
                            <p className="text-gray-600">
                              {horario.horaInicio} - {horario.horaFim}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editarHorario(horario)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deletarHorario(horario.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA TAXAS POR BAIRRO ========== */}
          {abaAtiva === "taxas" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">
                  {editandoTaxa ? "Editar Taxa" : "Nova Taxa de Bairro"}
                </h2>
                <form onSubmit={salvarTaxa} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome do Bairro *
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formTaxa.bairro}
                      onChange={handleChangeTaxa}
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="Ex: Centro, Jardins, Vila Nova..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Taxa (R$) *
                    </label>
                    <input
                      type="number"
                      name="taxa"
                      value={formTaxa.taxa}
                      onChange={handleChangeTaxa}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editandoTaxa ? "Atualizar" : "Cadastrar"}
                    </button>
                    {editandoTaxa && (
                      <button
                        type="button"
                        onClick={cancelarEdicaoTaxa}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Lista de Taxas */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4">Taxas Cadastradas</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {taxasBairro.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma taxa cadastrada
                    </p>
                  ) : (
                    taxasBairro.map((taxa) => (
                      <div
                        key={taxa.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{taxa.bairro}</h3>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              taxa.ativo
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {taxa.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold text-green-600 text-lg">
                              R$ {parseFloat(taxa.taxa).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editarTaxa(taxa)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deletarTaxa(taxa.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Servicos;
