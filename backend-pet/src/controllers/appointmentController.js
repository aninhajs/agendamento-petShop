import prisma from "../config/prisma.js";
import {
  notificarConfirmacao,
  notificarMudancaStatus,
} from "../services/notificationService.js";

export const createAppointment = async (req, res) => {
  try {
    const { data, hora, petIds, serviceIds, bairro, observacoes } = req.body;

    // Validação de campos obrigatórios
    if (!data || !hora || !petIds || !serviceIds) {
      return res.status(400).json({
        msg: "Campos obrigatórios: data, hora, petIds (array), serviceIds (array)",
      });
    }

    if (!Array.isArray(petIds) || petIds.length === 0) {
      return res.status(400).json({
        msg: "Você deve selecionar pelo menos um pet",
      });
    }

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        msg: "Você deve selecionar pelo menos um serviço",
      });
    }

    // Verifica se os pets existem e pertencem ao usuário
    const pets = await prisma.pet.findMany({
      where: {
        id: { in: petIds.map((id) => parseInt(id)) },
        userId: req.user.id,
      },
    });

    if (pets.length !== petIds.length) {
      return res.status(404).json({
        msg: "Um ou mais pets não foram encontrados ou não pertencem a você",
      });
    }

    // Busca os serviços selecionados
    const servicos = await prisma.service.findMany({
      where: {
        id: { in: serviceIds.map((id) => parseInt(id)) },
        ativo: true,
      },
    });

    if (servicos.length !== serviceIds.length) {
      return res.status(404).json({
        msg: "Um ou mais serviços não foram encontrados",
      });
    }

    // Verifica se há serviço de taxi e se o bairro foi informado
    const temTaxi = servicos.some((s) => s.tipo === "taxi");
    let taxaBairro = null;

    if (temTaxi && bairro) {
      const taxaEncontrada = await prisma.neighborhoodRate.findFirst({
        where: {
          bairro: {
            equals: bairro,
            mode: "insensitive",
          },
          ativo: true,
        },
      });

      if (taxaEncontrada) {
        taxaBairro = taxaEncontrada.taxa;
      }
    }

    // Converte a data string para DateTime
    const dataDateTime = new Date(`${data}T${hora}:00`);

    // 🔒 Validação: Verifica se o horário já está ocupado
    const horarioOcupado = await prisma.appointment.findFirst({
      where: {
        data: dataDateTime,
        hora,
        status: {
          in: ["pendente", "aprovado"],
        },
      },
    });

    if (horarioOcupado) {
      return res.status(400).json({
        msg: "Este horário já está ocupado. Escolha outro horário.",
      });
    }

    // Cria o agendamento principal
    const agendamento = await prisma.appointment.create({
      data: {
        data: dataDateTime,
        hora,
        userId: req.user.id,
        status: "pendente",
        bairro: bairro || null,
        taxaBairro: taxaBairro,
        observacoes: observacoes || null,
      },
    });

    // Associa os pets ao agendamento
    const appointmentPets = await Promise.all(
      petIds.map((petId) =>
        prisma.appointmentPet.create({
          data: {
            appointmentId: agendamento.id,
            petId: parseInt(petId),
          },
        }),
      ),
    );

    // Associa os serviços ao agendamento
    // Multiplica o preço de cada serviço pela quantidade de pets
    const quantidadePets = petIds.length;
    const appointmentServices = await Promise.all(
      servicos.map((servico) =>
        prisma.appointmentService.create({
          data: {
            appointmentId: agendamento.id,
            serviceId: servico.id,
            preco: parseFloat(servico.preco) * quantidadePets,
          },
        }),
      ),
    );

    // Busca o agendamento completo com as relações
    const agendamentoCompleto = await prisma.appointment.findUnique({
      where: { id: agendamento.id },
      include: {
        appointmentPets: {
          include: { pet: true },
        },
        appointmentServices: {
          include: { service: true },
        },
      },
    });

    // 📧 Enviar notificação de confirmação (async, não bloqueia a resposta)
    notificarConfirmacao(agendamento.id).catch((error) => {
      console.error("Erro ao enviar notificação:", error);
    });

    res.status(201).json({
      msg: "Agendamento criado com sucesso",
      agendamento: agendamentoCompleto,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({
      msg: "Erro ao criar agendamento",
      error: error.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const agendamentos = await prisma.appointment.findMany({
      where: { userId: req.user.id },
      include: {
        appointmentPets: {
          include: { pet: true },
        },
        appointmentServices: {
          include: { service: true },
        },
      },
      orderBy: { data: "desc" },
    });

    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({
      msg: "Erro ao buscar agendamentos",
      error: error.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const agendamentos = await prisma.appointment.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        appointmentPets: {
          include: { pet: true },
        },
        appointmentServices: {
          include: { service: true },
        },
      },
      orderBy: { data: "desc" },
    });

    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar todos agendamentos:", error);
    res.status(500).json({
      msg: "Erro ao buscar agendamentos",
      error: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        msg: "Status é obrigatório",
      });
    }

    const agendamento = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!agendamento) {
      return res.status(404).json({
        msg: "Agendamento não encontrado",
      });
    }

    await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // 📧 Notificar mudança de status (async, não bloqueia)
    if (status !== agendamento.status) {
      notificarMudancaStatus(parseInt(id), status).catch((error) => {
        console.error("Erro ao enviar notificação de mudança:", error);
      });
    }

    res.json({ msg: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({
      msg: "Erro ao atualizar status",
      error: error.message,
    });
  }
};

// Estatísticas para o Dashboard
export const getStatistics = async (req, res) => {
  try {
    // Total de clientes
    const totalClientes = await prisma.user.count();

    // Total de pets
    const totalPets = await prisma.pet.count();

    // Agendamentos de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const agendamentosHoje = await prisma.appointment.count({
      where: {
        data: {
          gte: hoje,
          lt: amanha,
        },
        status: {
          in: ["pendente", "aprovado"],
        },
      },
    });

    // Faturamento do mês (soma dos preços dos serviços aprovados)
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    // Início e fim do mês atual
    const inicioMes = new Date(anoAtual, mesAtual - 1, 1);
    const fimMes = new Date(anoAtual, mesAtual, 0, 23, 59, 59);

    const agendamentosAprovados = await prisma.appointment.findMany({
      where: {
        status: "aprovado",
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      include: {
        appointmentServices: {
          include: {
            service: true,
          },
        },
      },
    });

    // Calcular faturamento do mês atual
    let faturamentoMes = 0;
    agendamentosAprovados.forEach((agendamento) => {
      // Somar todos os serviços do agendamento
      if (agendamento.appointmentServices) {
        agendamento.appointmentServices.forEach((appointmentService) => {
          faturamentoMes += parseFloat(appointmentService.preco);
        });
      }

      // Adicionar taxa de bairro se existir
      if (agendamento.taxaBairro) {
        faturamentoMes += parseFloat(agendamento.taxaBairro);
      }
    });

    res.json({
      totalClientes,
      totalPets,
      agendamentosHoje,
      faturamentoMes: faturamentoMes.toFixed(2),
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      msg: "Erro ao buscar estatísticas",
      error: error.message,
    });
  }
};

// Estatísticas de agendamentos por status (para gráfico de pizza)
export const getAppointmentsByStatus = async (req, res) => {
  try {
    const pendentes = await prisma.appointment.count({
      where: { status: "pendente" },
    });
    const aprovados = await prisma.appointment.count({
      where: { status: "aprovado" },
    });
    const cancelados = await prisma.appointment.count({
      where: { status: "cancelado" },
    });

    res.json([
      { name: "Pendentes", value: pendentes, color: "#FCD34D" },
      { name: "Aprovados", value: aprovados, color: "#10B981" },
      { name: "Cancelados", value: cancelados, color: "#EF4444" },
    ]);
  } catch (error) {
    console.error("Erro ao buscar agendamentos por status:", error);
    res.status(500).json({ msg: "Erro ao buscar dados", error: error.message });
  }
};

// Faturamento dos últimos 6 meses (para gráfico de linha)
export const getMonthlyRevenue = async (req, res) => {
  try {
    const meses = [];
    const hoje = new Date();

    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesInicio = new Date(data.getFullYear(), data.getMonth(), 1);
      const mesFim = new Date(
        data.getFullYear(),
        data.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const agendamentos = await prisma.appointment.findMany({
        where: {
          status: "aprovado",
          data: {
            gte: mesInicio,
            lte: mesFim,
          },
        },
        include: {
          appointmentServices: true,
        },
      });

      let faturamento = 0;
      agendamentos.forEach((ag) => {
        if (ag.appointmentServices) {
          ag.appointmentServices.forEach((as) => {
            faturamento += parseFloat(as.preco);
          });
        }
        if (ag.taxaBairro) {
          faturamento += parseFloat(ag.taxaBairro);
        }
      });

      const mesesNomes = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      meses.push({
        mes: mesesNomes[data.getMonth()],
        faturamento: parseFloat(faturamento.toFixed(2)),
      });
    }

    res.json(meses);
  } catch (error) {
    console.error("Erro ao buscar faturamento mensal:", error);
    res.status(500).json({ msg: "Erro ao buscar dados", error: error.message });
  }
};

// Serviços mais solicitados (para gráfico de barras)
export const getTopServices = async (req, res) => {
  try {
    const servicos = await prisma.appointmentService.groupBy({
      by: ["serviceId"],
      _count: {
        serviceId: true,
      },
      orderBy: {
        _count: {
          serviceId: "desc",
        },
      },
      take: 5,
    });

    const resultado = await Promise.all(
      servicos.map(async (s) => {
        const service = await prisma.service.findUnique({
          where: { id: s.serviceId },
        });
        return {
          nome: service?.nome || "Desconhecido",
          quantidade: s._count.serviceId,
        };
      }),
    );

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar serviços mais solicitados:", error);
    res.status(500).json({ msg: "Erro ao buscar dados", error: error.message });
  }
};
