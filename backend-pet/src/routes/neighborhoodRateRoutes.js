import express from "express";
import {
  getAllRates,
  createRate,
  updateRate,
  deleteRate,
  getRateByNeighborhood,
} from "../controllers/neighborhoodRateController.js";
import {
  verificarToken,
  verificarAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rotas públicas (para clientes consultarem)
router.get("/taxas-bairro", getAllRates);
router.get("/taxas-bairro/bairro/:bairro", getRateByNeighborhood);

// Rotas protegidas (requer autenticação)
router.post("/taxas-bairro", verificarToken, createRate);
router.put("/taxas-bairro/:id", verificarToken, updateRate);
router.delete("/taxas-bairro/:id", verificarToken, deleteRate);

export default router;
