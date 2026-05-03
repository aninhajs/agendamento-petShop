import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, telefone, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Campos obrigatórios: name, email, password",
      });
    }

    // Validate telefone is required
    if (!telefone || telefone.trim() === "") {
      return res.status(400).json({
        message: "Telefone é obrigatório para receber notificações",
      });
    }

    // Validate telefone format (minimum length)
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (telefoneNumeros.length < 10) {
      return res.status(400).json({
        message: "Telefone inválido. Deve conter pelo menos 10 dígitos",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        telefone: telefone,
        password: hashedPassword,
        role: role || "cliente",
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({
      message: "Erro ao criar usuário",
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message,
    });
  }
};

// Get current user (me)
export const getCurrentUser = async (req, res) => {
  try {
    console.log("🔍 GET /auth/me - User ID:", req.user?.id);
    const userId = req.user.id; // Vem do middleware de autenticação

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        telefone: true,
      },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado:", userId);
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    console.log("✅ Usuário encontrado:", user.email);
    res.json(user);
  } catch (error) {
    console.error("❌ Erro ao buscar usuário atual:", error);
    res.status(500).json({
      message: "Erro ao buscar usuário",
      error: error.message,
    });
  }
};

// Listar todos os usuários (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({
      message: "Erro ao listar usuários",
      error: error.message,
    });
  }
};

// Buscar usuário por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({
      message: "Erro ao buscar usuário",
      error: error.message,
    });
  }
};
