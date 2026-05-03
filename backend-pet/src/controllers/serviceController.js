import prisma from "../config/prisma.js";

// ========== SERVIÇOS ==========

// Listar todos os serviços
export const listarServicos = async (req, res) => {
  try {
    const servicos = await prisma.service.findMany({
      orderBy: {
        nome: "asc",
      },
    });
    res.json(servicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar serviços" });
  }
};

// Criar novo serviço
export const criarServico = async (req, res) => {
  try {
    const { nome, descricao, preco, duracao, tipo } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
    }

    const servico = await prisma.service.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: parseFloat(preco),
        duracao: parseInt(duracao) || 60,
        tipo: tipo || "normal",
      },
    });

    res.status(201).json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar serviço" });
  }
};

// Atualizar serviço
export const atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, duracao, tipo, ativo } = req.body;

    const servico = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    const servicoAtualizado = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        preco: preco ? parseFloat(preco) : undefined,
        duracao: duracao ? parseInt(duracao) : undefined,
        tipo: tipo || undefined,
        ativo,
      },
    });

    res.json(servicoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar serviço" });
  }
};

// Deletar serviço
export const deletarServico = async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    await prisma.service.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensagem: "Serviço deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar serviço" });
  }
};

// ========== HORÁRIOS DISPONÍVEIS ==========

// Listar todos os horários
export const listarHorarios = async (req, res) => {
  try {
    const horarios = await prisma.availableTime.findMany({
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
    });
    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar horários" });
  }
};

// Criar horário disponível
export const criarHorario = async (req, res) => {
  try {
    const { diaSemana, horaInicio, horaFim } = req.body;

    if (diaSemana === undefined || !horaInicio || !horaFim) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const horario = await prisma.availableTime.create({
      data: {
        diaSemana: parseInt(diaSemana),
        horaInicio,
        horaFim,
      },
    });

    res.status(201).json(horario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar horário" });
  }
};

// Atualizar horário
export const atualizarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { diaSemana, horaInicio, horaFim, ativo } = req.body;

    const horario = await prisma.availableTime.findUnique({
      where: { id: parseInt(id) },
    });
    if (!horario) {
      return res.status(404).json({ erro: "Horário não encontrado" });
    }

    const horarioAtualizado = await prisma.availableTime.update({
      where: { id: parseInt(id) },
      data: {
        diaSemana: diaSemana !== undefined ? parseInt(diaSemana) : undefined,
        horaInicio,
        horaFim,
        ativo,
      },
    });

    res.json(horarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar horário" });
  }
};

// Deletar horário
export const deletarHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const horario = await prisma.availableTime.findUnique({
      where: { id: parseInt(id) },
    });
    if (!horario) {
      return res.status(404).json({ erro: "Horário não encontrado" });
    }

    await prisma.availableTime.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensagem: "Horário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar horário" });
  }
};
