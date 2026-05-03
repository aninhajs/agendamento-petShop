import { Router } from "express";
import {
  listarServicos,
  criarServico,
  atualizarServico,
  deletarServico,
  listarHorarios,
  criarHorario,
  atualizarHorario,
  deletarHorario,
} from "../controllers/serviceController.js";
import auth from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas de Serviços
router.get("/servicos", listarServicos); // público para clientes verem
router.post("/servicos", auth, criarServico); // admin
router.put("/servicos/:id", auth, atualizarServico); // admin
router.delete("/servicos/:id", auth, deletarServico); // admin

// Rotas de Horários Disponíveis
router.get("/horarios", listarHorarios); // público
router.post("/horarios", auth, criarHorario); // admin
router.put("/horarios/:id", auth, atualizarHorario); // admin
router.delete("/horarios/:id", auth, deletarHorario); // admin

export default router;
