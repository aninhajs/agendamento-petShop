import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/PetRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import neighborhoodRateRoutes from "./routes/neighborhoodRateRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

console.log("📦 Criando aplicação Express...");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🔗 Registrando rotas...");
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/agendamentos", appointmentRoutes);
app.use("/api", serviceRoutes);
app.use("/api", neighborhoodRateRoutes);
app.use("/api/chatbot", chatbotRoutes);

console.log("✅ Rotas registradas:", {
  auth: "/api/auth",
  pets: "/api/pets",
  agendamentos: "/api/agendamentos",
  services: "/api",
  neighborhoodRates: "/api/taxas-bairro",
  chatbot: "/api/chatbot",
});

export default app;
