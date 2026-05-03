import express from "express";
import {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  getUserById,
} from "../controllers/authControllers.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

console.log("🔥 Auth routes carregadas");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getCurrentUser);
router.get("/users", auth, getAllUsers);
router.get("/users/:id", auth, getUserById);

console.log("✅ Rotas de autenticação registradas");

export default router;
