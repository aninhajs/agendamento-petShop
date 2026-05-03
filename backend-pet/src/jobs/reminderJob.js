import cron from "node-cron";
import prisma from "../config/prisma.js";
import { notificarLembrete } from "../services/notificationService.js";

/**
 * 🔄 Job: Enviar lembretes 24h antes dos agendamentos
 * Executa todos os dias às 10:00 da manhã
 */
export function iniciarJobLembretes() {
  // Cron pattern: "0 10 * * *" = todos os dias às 10:00
  // Formato: segundo minuto hora dia mês dia-da-semana
  // Exemplo: "0 10 * * *" = minuto 0, hora 10, todos os dias

  cron.schedule("0 10 * * *", async () => {
    console.log("🔄 [CRON] Iniciando job de lembretes...");
    console.log(`📅 Data/Hora: ${new Date().toLocaleString("pt-BR")}`);

    try {
      // Calcular data de amanhã (início e fim do dia)
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(0, 0, 0, 0);

      const depoisDeAmanha = new Date(amanha);
      depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 1);

      console.log(
        `🔍 Buscando agendamentos para ${amanha.toLocaleDateString("pt-BR")}...`,
      );

      // Buscar agendamentos para amanhã com status ativo
      const agendamentos = await prisma.appointment.findMany({
        where: {
          data: {
            gte: amanha,
            lt: depoisDeAmanha,
          },
          status: {
            in: ["pendente", "aprovado"],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              telefone: true,
            },
          },
          appointmentPets: {
            include: {
              pet: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      console.log(
        `📨 Encontrados ${agendamentos.length} agendamentos para notificar`,
      );

      if (agendamentos.length === 0) {
        console.log("✅ [CRON] Nenhum agendamento para amanhã. Job concluído.");
        return;
      }

      // Enviar lembretes
      let enviados = 0;
      let erros = 0;

      for (const agendamento of agendamentos) {
        try {
          const nomePets = agendamento.appointmentPets
            .map((ap) => ap.pet.name)
            .join(", ");

          console.log(
            `📤 Enviando lembrete para ${agendamento.user.name} (${agendamento.user.email}) - Pet(s): ${nomePets}`,
          );

          const resultado = await notificarLembrete(agendamento.id);

          if (resultado.success) {
            enviados++;
            console.log(
              `✅ Lembrete enviado com sucesso para agendamento #${agendamento.id}`,
            );
          } else {
            erros++;
            console.error(
              `❌ Falha ao enviar lembrete para agendamento #${agendamento.id}`,
            );
          }

          // Pequeno delay entre envios para evitar sobrecarga
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          erros++;
          console.error(
            `❌ Erro ao processar agendamento #${agendamento.id}:`,
            error.message,
          );
        }
      }

      console.log("\n📊 [CRON] Resumo do Job:");
      console.log(`   ✅ Enviados: ${enviados}`);
      console.log(`   ❌ Erros: ${erros}`);
      console.log(`   📝 Total: ${agendamentos.length}`);
      console.log("✅ [CRON] Job de lembretes concluído!\n");
    } catch (error) {
      console.error("❌ [CRON] Erro crítico no job de lembretes:", error);
    }
  });

  console.log("✅ [CRON] Job de lembretes inicializado!");
  console.log("⏰ [CRON] Lembretes serão enviados todos os dias às 10:00");
}

/**
 * 🧪 Função para testar o job manualmente (útil para desenvolvimento)
 * Execute: node -e "require('./src/jobs/reminderJob.js').testarJobManual()"
 */
export async function testarJobManual() {
  console.log("🧪 [TESTE] Executando job de lembretes manualmente...\n");

  try {
    // Buscar agendamentos para amanhã
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);

    const depoisDeAmanha = new Date(amanha);
    depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 1);

    const agendamentos = await prisma.appointment.findMany({
      where: {
        data: {
          gte: amanha,
          lt: depoisDeAmanha,
        },
        status: {
          in: ["pendente", "aprovado"],
        },
      },
      include: {
        user: true,
      },
    });

    console.log(
      `📨 Encontrados ${agendamentos.length} agendamentos para amanhã`,
    );

    if (agendamentos.length === 0) {
      console.log("ℹ️ Nenhum agendamento encontrado para teste");
      console.log("💡 Dica: Crie um agendamento para amanhã e teste novamente");
    } else {
      for (const agendamento of agendamentos) {
        console.log(
          `\n📤 Enviando para: ${agendamento.user.name} (${agendamento.user.email})`,
        );
        const resultado = await notificarLembrete(agendamento.id);
        console.log(`Resultado:`, resultado);
      }
    }

    console.log("\n✅ [TESTE] Teste concluído!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ [TESTE] Erro no teste:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
