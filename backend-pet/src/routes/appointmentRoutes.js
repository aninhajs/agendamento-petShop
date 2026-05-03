import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateStatus,
  getStatistics,
  getAppointmentsByStatus,
  getMonthlyRevenue,
  getTopServices,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", auth, createAppointment);
router.get("/meus", auth, getMyAppointments);
router.get("/admin", auth, getAllAppointments);
router.get("/stats", auth, getStatistics);
router.get("/stats/status", auth, getAppointmentsByStatus);
router.get("/stats/revenue", auth, getMonthlyRevenue);
router.get("/stats/top-services", auth, getTopServices);
router.put("/:id", auth, updateStatus);

export default router;
