import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/prisma.js";
import { iniciarJobLembretes } from "./jobs/reminderJob.js";

const PORT = process.env.PORT || 3001;

console.log("🚀 Iniciando servidor...");

async function start() {
  try {
    console.log("📦 Conectando ao database...");
    await prisma.$connect();
    console.log("✅ Database conectado");

    const server = app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);

      // 🔔 Iniciar cron jobs
      console.log("🔔 Iniciando sistema de notificações...");
      iniciarJobLembretes();
    });

    server.on("error", (err) => {
      console.error("❌ Erro no servidor:", err);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Erro ao iniciar:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

start();
