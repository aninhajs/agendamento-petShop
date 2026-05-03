import "dotenv/config";
import {
  notificarConfirmacao,
  notificarLembrete,
} from "./src/services/notificationService.js";
import prisma from "./src/config/prisma.js";
import readline from "readline";

console.log(" Script de Teste - Sistema de Notificações\n");

async function testar() {
  try {
    // Buscar o agendamento mais recente
    const agendamento = await prisma.appointment.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        appointmentPets: {
          include: { pet: true },
        },
        appointmentServices: {
          include: { service: true },
        },
      },
    });

    if (!agendamento) {
      console.log(" Nenhum agendamento encontrado no banco de dados");
      console.log(" Crie um agendamento primeiro e tente novamente");
      await prisma.$disconnect();
      return;
    }

    console.log(" Agendamento encontrado:");
    console.log(`   ID: ${agendamento.id}`);
    console.log(`   Cliente: ${agendamento.user.name}`);
    console.log(`   Email: ${agendamento.user.email}`);
    console.log(`   Telefone: ${agendamento.user.telefone || "Não informado"}`);
    console.log(
      `   Data: ${new Date(agendamento.data).toLocaleDateString("pt-BR")}`,
    );
    console.log(`   Horário: ${agendamento.hora}`);
    console.log(`   Status: ${agendamento.status}\n`);

    // Perguntar qual teste fazer
    console.log("Qual notificação você quer testar?");
    console.log("1. Confirmação de Agendamento");
    console.log("2. Lembrete 24h Antes\n");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Digite o número (1 ou 2): ", async (resposta) => {
      console.log();

      if (resposta === "1") {
        console.log(" Enviando confirmação de agendamento...\n");
        const resultado = await notificarConfirmacao(agendamento.id);
        console.log("\n Resultado:", JSON.stringify(resultado, null, 2));
      } else if (resposta === "2") {
        console.log("    Enviando lembrete...\n");
        const resultado = await notificarLembrete(agendamento.id);
        console.log("\n Resultado:", JSON.stringify(resultado, null, 2));
      } else {
        console.log(" Opção inválida");
      }

      console.log("\n Teste concluído!");
      console.log(" Verifique seu email e WhatsApp\n");

      await prisma.$disconnect();
      rl.close();
    });
  } catch (error) {
    console.error(" Erro no teste:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testar();
