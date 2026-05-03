import prisma from "../config/prisma.js";

// Listar todas as taxas de bairro
export const getAllRates = async (req, res) => {
  try {
    const rates = await prisma.neighborhoodRate.findMany({
      where: { ativo: true },
      orderBy: { bairro: "asc" },
    });
    res.json(rates);
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    res.status(500).json({ msg: "Erro ao buscar taxas de bairro" });
  }
};

// Criar nova taxa de bairro
export const createRate = async (req, res) => {
  try {
    const { bairro, taxa } = req.body;

    if (!bairro || !taxa) {
      return res.status(400).json({ msg: "Bairro e taxa são obrigatórios" });
    }

    const rate = await prisma.neighborhoodRate.create({
      data: { bairro, taxa: parseFloat(taxa) },
    });

    res.status(201).json({ msg: "Taxa criada com sucesso", rate });
  } catch (error) {
    console.error("Erro ao criar taxa:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ msg: "Este bairro já possui taxa cadastrada" });
    }
    res.status(500).json({ msg: "Erro ao criar taxa" });
  }
};

// Atualizar taxa de bairro
export const updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { bairro, taxa, ativo } = req.body;

    const rate = await prisma.neighborhoodRate.update({
      where: { id: parseInt(id) },
      data: {
        ...(bairro && { bairro }),
        ...(taxa && { taxa: parseFloat(taxa) }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ msg: "Taxa atualizada com sucesso", rate });
  } catch (error) {
    console.error("Erro ao atualizar taxa:", error);
    res.status(500).json({ msg: "Erro ao atualizar taxa" });
  }
};

// Deletar taxa de bairro
export const deleteRate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.neighborhoodRate.delete({
      where: { id: parseInt(id) },
    });

    res.json({ msg: "Taxa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar taxa:", error);
    res.status(500).json({ msg: "Erro ao deletar taxa" });
  }
};

// Buscar taxa de um bairro específico
export const getRateByNeighborhood = async (req, res) => {
  try {
    const { bairro } = req.params;

    const rate = await prisma.neighborhoodRate.findFirst({
      where: {
        bairro: {
          equals: bairro,
          mode: "insensitive",
        },
        ativo: true,
      },
    });

    if (!rate) {
      return res
        .status(404)
        .json({ msg: "Taxa não encontrada para este bairro" });
    }

    res.json(rate);
  } catch (error) {
    console.error("Erro ao buscar taxa:", error);
    res.status(500).json({ msg: "Erro ao buscar taxa" });
  }
};
