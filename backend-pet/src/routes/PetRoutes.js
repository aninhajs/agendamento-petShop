import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  createPet,
  getPets,
  deletePet,
  updatePet,
  getAllPets,
} from "../controllers/PetControllers.js";

const router = express.Router();

router.post("/", auth, createPet);
router.get("/", auth, getPets);
router.get("/admin/all", auth, getAllPets);
router.put("/:id", auth, updatePet);
router.delete("/:id", auth, deletePet);

export default router;
