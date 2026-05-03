import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("🔐 Auth middleware - Token:", token ? "presente" : "ausente");

  if (!token) return res.status(401).json({ msg: "Sem token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token válido para usuário:", decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token inválido:", error.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
}

// Alias para compatibilidade
export const verificarToken = auth;

// Middleware para verificar se o usuário é admin
export function verificarAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Acesso negado. Apenas administradores." });
  }
  next();
}
