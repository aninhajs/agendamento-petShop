import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaPaw,
  FaCut,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaTaxi,
} from "react-icons/fa";

function Agendamento() {
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [bairros, setBairros] = useState([]);

  const [form, setForm] = useState({
    petIds: [],
    serviceIds: [],
    data: "",
    hora: "",
    bairro: "",
    observacoes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Carrega dados iniciais (apenas uma vez na montagem)
  useEffect(() => {
    async function loadData() {
      try {
        const [petsRes, servicosRes, bairrosRes] = await Promise.all([
          api.get("/pets"),
          api.get("/servicos"),
          api.get("/taxas-bairro"),
        ]);

        setPets(petsRes.data);
        setServicos(servicosRes.data.filter((s) => s.ativo));
        setBairros(bairrosRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []); // ✅ Array vazio - executa apenas na montagem

  // 2. Cálculos Derivados (SEM useEffect)
  // Em vez de setPetsSelecionados, calculamos na hora:
  const petsSelecionados = useMemo(() => {
    return pets.filter((p) => form.petIds.includes(p.id.toString()));
  }, [form.petIds, pets]);

  const servicosSelecionados = useMemo(() => {
    return servicos.filter((s) => form.serviceIds.includes(s.id.toString()));
  }, [form.serviceIds, servicos]);

  const temTaxi = useMemo(() => {
    return servicosSelecionados.some((s) => s.tipo === "taxi");
  }, [servicosSelecionados]);

  // 3. Cálculo da Taxa do Bairro (Também pode ser derivado)
  const taxaBairro = useMemo(() => {
    if (form.bairro && temTaxi) {
      return (
        bairros.find(
          (b) => b.bairro.toLowerCase() === form.bairro.toLowerCase(),
        ) || null
      );
    }
    return null;
  }, [form.bairro, bairros, temTaxi]);

  function togglePet(petId) {
    const id = petId.toString();
    setForm((prev) => ({
      ...prev,
      petIds: prev.petIds.includes(id)
        ? prev.petIds.filter((pid) => pid !== id)
        : [...prev.petIds, id],
    }));
  }

  function toggleService(serviceId) {
    const id = serviceId.toString();

    setForm((prev) => {
      const isRemoving = prev.serviceIds.includes(id);
      const newServiceIds = isRemoving
        ? prev.serviceIds.filter((sid) => sid !== id)
        : [...prev.serviceIds, id];

      // Se está removendo um serviço de taxi, limpa o bairro
      const temTaxiDepoisDaMudanca = servicos
        .filter((s) => newServiceIds.includes(s.id.toString()))
        .some((s) => s.tipo === "taxi");

      return {
        ...prev,
        serviceIds: newServiceIds,
        // Limpa o bairro se não houver mais taxi selecionado
        bairro: temTaxiDepoisDaMudanca ? prev.bairro : "",
      };
    });
  }

  function calcularTotal() {
    let total = 0;
    const quantidadePets = form.petIds.length;

    // Multiplica o preço de cada serviço pela quantidade de pets
    servicosSelecionados.forEach((servico) => {
      total += parseFloat(servico.preco) * quantidadePets;
    });

    if (taxaBairro) {
      total += parseFloat(taxaBairro.taxa);
    }

    return total.toFixed(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.petIds.length === 0) {
      setError("Selecione pelo menos um pet");
      return;
    }

    if (form.serviceIds.length === 0) {
      setError("Selecione pelo menos um serviço");
      return;
    }

    if (temTaxi && !form.bairro) {
      setError("Selecione o bairro para o serviço de taxi pet");
      return;
    }

    try {
      await api.post("/agendamentos", {
        ...form,
        petIds: form.petIds.map((id) => parseInt(id)),
        serviceIds: form.serviceIds.map((id) => parseInt(id)),
      });

      alert("Agendamento realizado com sucesso!");
      setForm({
        petIds: [],
        serviceIds: [],
        data: "",
        hora: "",
        bairro: "",
        observacoes: "",
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Erro ao realizar agendamento");
    }
  }

  return (
    // min-h-screen e flex flex-col garantem que o fundo ocupe tudo
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* flex-1 faz este container crescer e ocupar o espaço restante */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-green-600 p-6 text-white text-center">
            <h1 className="text-2xl md:text-3xl font-bold flex justify-center items-center gap-3">
              <FaCalendarAlt /> Agendar Serviço
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Reserve um horário para o seu melhor amigo
            </p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 text-2xl">
                  <FaPaw />
                </div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  Ops! Nenhum pet cadastrado.
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  Para agendar, precisamos saber quem é o pet primeiro.
                </p>
                <Link
                  to="/pets"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95"
                >
                  Cadastrar Meu Pet
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleção de Pets */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FaPaw className="text-green-600" />
                    Selecione os Pets (pode escolher mais de um)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        onClick={() => togglePet(pet.id)}
                        className={`
                          cursor-pointer p-4 rounded-xl border-2 transition-all
                          ${
                            form.petIds.includes(pet.id.toString())
                              ? "border-green-500 bg-green-50 shadow-md"
                              : "border-gray-200 bg-gray-50 hover:border-green-300"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center
                              ${
                                form.petIds.includes(pet.id.toString())
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }
                            `}
                          >
                            {form.petIds.includes(pet.id.toString()) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {pet.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {pet.raca} - {pet.idade} ano(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seleção de Serviços */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FaCut className="text-green-600" />
                    Selecione os Serviços (pode escolher mais de um)
                  </label>
                  <div className="space-y-2">
                    {servicos.map((servico) => (
                      <div
                        key={servico.id}
                        onClick={() => toggleService(servico.id)}
                        className={`
                          cursor-pointer p-4 rounded-xl border-2 transition-all
                          ${
                            form.serviceIds.includes(servico.id.toString())
                              ? "border-green-500 bg-green-50 shadow-md"
                              : "border-gray-200 bg-gray-50 hover:border-green-300"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center
                                ${
                                  form.serviceIds.includes(
                                    servico.id.toString(),
                                  )
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300"
                                }
                              `}
                            >
                              {form.serviceIds.includes(
                                servico.id.toString(),
                              ) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800">
                                  {servico.nome}
                                </p>
                                {servico.tipo === "taxi" && (
                                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <FaTaxi /> Taxi Pet
                                  </span>
                                )}
                              </div>
                              {servico.descricao && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {servico.descricao}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Duração: {servico.duracao} min
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            R$ {parseFloat(servico.preco).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seleção de Bairro */}
                {temTaxi && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaMapMarkerAlt className="text-green-600" />
                      Selecione o Bairro (necessário para Taxi Pet)
                    </label>
                    <select
                      className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={form.bairro}
                      onChange={(e) =>
                        setForm({ ...form, bairro: e.target.value })
                      }
                      required
                    >
                      <option value="">Escolha seu bairro</option>
                      {bairros.map((b) => (
                        <option key={b.id} value={b.bairro}>
                          {b.bairro} - R$ {parseFloat(b.taxa).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    {taxaBairro && (
                      <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Taxa do bairro:</strong> R${" "}
                          {parseFloat(taxaBairro.taxa).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Resumo do Pedido */}
                {(servicosSelecionados.length > 0 ||
                  petsSelecionados.length > 0) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-3">
                      📋 Resumo do Agendamento
                    </h3>

                    {petsSelecionados.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Pets:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {petsSelecionados.map((pet) => (
                            <span
                              key={pet.id}
                              className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-green-200"
                            >
                              🐾 {pet.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {servicosSelecionados.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Serviços:
                        </p>
                        <div className="space-y-1">
                          {servicosSelecionados.map((servico) => {
                            const quantidadePets = form.petIds.length;
                            const precoUnitario = parseFloat(servico.preco);
                            const precoTotal = precoUnitario * quantidadePets;

                            return (
                              <div
                                key={servico.id}
                                className="flex justify-between text-sm text-gray-700"
                              >
                                <span>
                                  {servico.nome}
                                  {quantidadePets > 1 && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      (R$ {precoUnitario.toFixed(2)} x{" "}
                                      {quantidadePets} pets)
                                    </span>
                                  )}
                                </span>
                                <span className="font-semibold">
                                  R$ {precoTotal.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {taxaBairro && (
                      <div className="mb-3 pb-3 border-b border-green-300">
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Taxa {taxaBairro.bairro}</span>
                          <span className="font-semibold">
                            R$ {parseFloat(taxaBairro.taxa).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600 text-xl" />
                        <span className="font-semibold text-gray-700">
                          Valor Total:
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        R$ {calcularTotal()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Data e Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                      <FaCalendarAlt className="text-green-600" /> Data
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      onChange={(e) =>
                        setForm({ ...form, data: e.target.value })
                      }
                      value={form.data}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                      <FaClock className="text-green-600" /> Horário
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      onChange={(e) =>
                        setForm({ ...form, hora: e.target.value })
                      }
                      value={form.hora}
                      required
                    />
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                    rows="3"
                    placeholder="Alguma informação adicional?"
                    onChange={(e) =>
                      setForm({ ...form, observacoes: e.target.value })
                    }
                    value={form.observacoes}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Confirmar Agendamento
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Agendamento;
