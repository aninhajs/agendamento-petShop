import prisma from "../config/prisma.js";

export const createPet = async (req, res) => {
  try {
    const { nome, raca, idade, porte, peso, alergias, observacoes } = req.body;

    // Validação de campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        msg: "Nome do pet é obrigatório",
      });
    }

    const pet = await prisma.pet.create({
      data: {
        name: nome,
        raca: raca || "",
        idade: parseInt(idade),
        porte: porte || "",
        peso: peso ? parseFloat(peso) : null,
        alergias: alergias || "",
        observacoes: observacoes || "",
        userId: req.user.id,
      },
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error("Erro ao criar pet:", error);
    res.status(500).json({
      msg: "Erro ao criar pet",
      error: error.message,
    });
  }
};

export const getPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { userId: req.user.id },
    });

    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({
      msg: "Erro ao buscar pets",
      error: error.message,
    });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!pet) {
      return res.status(404).json({
        msg: "Pet não encontrado",
      });
    }

    await prisma.pet.delete({
      where: { id: parseInt(id) },
    });

    res.json({ msg: "Pet removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    res.status(500).json({
      msg: "Erro ao deletar pet",
      error: error.message,
    });
  }
};

// Atualizar pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, raca, idade, porte, peso, alergias, observacoes } = req.body;

    // Verifica se o pet pertence ao usuário
    const petExistente = await prisma.pet.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!petExistente) {
      return res.status(404).json({ erro: "Pet não encontrado" });
    }

    const pet = await prisma.pet.update({
      where: { id: parseInt(id) },
      data: {
        name: nome,
        raca,
        idade: parseInt(idade),
        porte: porte || null,
        peso: peso ? parseFloat(peso) : null,
        alergias: alergias || null,
        observacoes: observacoes || null,
      },
    });

    res.json(pet);
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    res.status(500).json({
      msg: "Erro ao atualizar pet",
      error: error.message,
    });
  }
};

// Listar todos os pets (admin)
export const getAllPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar todos os pets:", error);
    res.status(500).json({
      msg: "Erro ao buscar pets",
      error: error.message,
    });
  }
};
