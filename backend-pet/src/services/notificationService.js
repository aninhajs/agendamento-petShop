import twilio from "twilio";
import nodemailer from "nodemailer";
import prisma from "../config/prisma.js";

// Inicializar Twilio apenas se as credenciais forem válidas
let twilioClient = null;

if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_ACCOUNT_SID.startsWith("AC") && // Validação: Account SID deve começar com "AC"
  process.env.TWILIO_ACCOUNT_SID !== "seu_account_sid_aqui" // Não é o valor placeholder
) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    console.log("✅ Twilio inicializado com sucesso");
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Twilio:", error.message);
    twilioClient = null;
  }
} else {
  console.warn(
    "⚠️ Twilio não configurado. Configure TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN no .env para ativar WhatsApp/SMS",
  );
}

// Configurar transportador de email
let transporter = null;

if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_USER !== "seu_email@gmail.com" // Não é o valor placeholder
) {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log("✅ Email configurado com sucesso");
  } catch (error) {
    console.warn("⚠️ Erro ao configurar email:", error.message);
    transporter = null;
  }
} else {
  console.warn(
    "⚠️ Email não configurado. Configure EMAIL_USER e EMAIL_PASSWORD no .env para ativar emails",
  );
}

/**
 * 📱 Enviar mensagem via WhatsApp
 */
export async function enviarWhatsApp(telefone, mensagem) {
  try {
    if (!twilioClient) {
      console.warn(
        "⚠️ Twilio não configurado. Configure TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN no .env",
      );
      return { success: false, error: "Twilio não configurado" };
    }

    if (!telefone) {
      console.warn("⚠️ Telefone não fornecido");
      return { success: false, error: "Telefone não fornecido" };
    }

    // Formatar telefone para formato WhatsApp (assumindo número brasileiro)
    let numeroFormatado = telefone.replace(/\D/g, ""); // Remove não-dígitos

    // Se não tiver código do país, adiciona +55 (Brasil)
    if (numeroFormatado.length === 11 || numeroFormatado.length === 10) {
      numeroFormatado = `+55${numeroFormatado}`;
    } else if (!numeroFormatado.startsWith("+")) {
      numeroFormatado = `+${numeroFormatado}`;
    }

    const message = await twilioClient.messages.create({
      body: mensagem,
      from: process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886",
      to: `whatsapp:${numeroFormatado}`,
    });

    console.log(`✅ WhatsApp enviado para ${numeroFormatado}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("❌ Erro ao enviar WhatsApp:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 📧 Enviar email
 */
export async function enviarEmail(destinatario, assunto, html) {
  try {
    if (!transporter) {
      console.warn(
        "⚠️ Email não configurado. Configure EMAIL_USER e EMAIL_PASSWORD no .env",
      );
      return { success: false, error: "Email não configurado" };
    }

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Pet Shop"} 🐾" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      html: html,
    });

    console.log(`✅ Email enviado para ${destinatario}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🎉 Notificação: Confirmação de Agendamento
 */
export async function notificarConfirmacao(agendamentoId) {
  try {
    // Buscar dados completos do agendamento
    const agendamento = await prisma.appointment.findUnique({
      where: { id: agendamentoId },
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
      throw new Error("Agendamento não encontrado");
    }

    const usuario = agendamento.user;
    const nomePets = agendamento.appointmentPets
      .map((ap) => ap.pet.name)
      .join(", ");
    const nomeServicos = agendamento.appointmentServices
      .map((as) => as.service.nome)
      .join(", ");

    const dataFormatada = new Date(agendamento.data).toLocaleDateString(
      "pt-BR",
    );

    // Calcular valor total
    const valorServicos = agendamento.appointmentServices.reduce(
      (total, as) => total + parseFloat(as.preco),
      0,
    );
    const taxaBairro = parseFloat(agendamento.taxaBairro || 0);
    const valorTotal = valorServicos + taxaBairro;

    // Mensagem para WhatsApp (texto simples)
    const mensagemWhatsApp = `
🐾 *Pet Shop - Confirmação de Agendamento*

Olá ${usuario.name}! ✅

Seu agendamento foi confirmado:

📅 Data: ${dataFormatada}
🕐 Horário: ${agendamento.hora}
🐶 Pet(s): ${nomePets}
✂️ Serviço(s): ${nomeServicos}
💰 Valor Total: R$ ${valorTotal.toFixed(2)}

Status: ${agendamento.status === "pendente" ? "Aguardando aprovação" : "Aprovado"}

${agendamento.observacoes ? `📝 Observações: ${agendamento.observacoes}` : ""}

Qualquer dúvida, entre em contato!

Até breve! 🐾
    `.trim();

    // HTML para email (estilizado)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; 
                      border-left: 4px solid #10b981; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 14px; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; 
                         background: #fef3c7; color: #92400e; font-weight: bold; }
          .status-aprovado { background: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;"> Agendamento Confirmado!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${usuario.name}</strong>,</p>
            <p>Seu agendamento foi confirmado com sucesso:</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">📅 Data:</span>
                <span class="value">${dataFormatada}</span>
              </div>
              <div class="info-row">
                <span class="label">🕐 Horário:</span>
                <span class="value">${agendamento.hora}</span>
              </div>
              <div class="info-row">
                <span class="label">🐶 Pet(s):</span>
                <span class="value">${nomePets}</span>
              </div>
              <div class="info-row">
                <span class="label">✂️ Serviço(s):</span>
                <span class="value">${nomeServicos}</span>
              </div>
              <div class="info-row">
                <span class="label">💰 Valor Total:</span>
                <span class="value">R$ ${valorTotal.toFixed(2)}</span>
              </div>
              ${
                agendamento.observacoes
                  ? `
              <div class="info-row">
                <span class="label">📝 Observações:</span>
                <span class="value">${agendamento.observacoes}</span>
              </div>`
                  : ""
              }
              <div class="info-row" style="margin-top: 15px;">
                <span class="label">Status:</span>
                <span class="status-badge ${agendamento.status === "aprovado" ? "status-aprovado" : ""}">
                  ${agendamento.status === "pendente" ? "⏳ Aguardando Aprovação" : "✓ Aprovado"}
                </span>
              </div>
            </div>
            
            <p>Você receberá um lembrete 24 horas antes do seu agendamento.</p>
            <p>Até breve! 🐾</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pet Shop - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar notificações
    const resultados = {};

    // Enviar WhatsApp (se telefone disponível)
    if (usuario.telefone) {
      resultados.whatsapp = await enviarWhatsApp(
        usuario.telefone,
        mensagemWhatsApp,
      );
    }

    // Enviar Email
    resultados.email = await enviarEmail(
      usuario.email,
      "Agendamento Confirmado - Pet Shop",
      emailHtml,
    );

    console.log(` Notificações enviadas para agendamento #${agendamentoId}`);
    return { success: true, resultados };
  } catch (error) {
    console.error(" Erro ao notificar confirmação:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ⏰ Notificação: Lembrete 24h antes
 */
export async function notificarLembrete(agendamentoId) {
  try {
    // Buscar dados completos do agendamento
    const agendamento = await prisma.appointment.findUnique({
      where: { id: agendamentoId },
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
      throw new Error("Agendamento não encontrado");
    }

    const usuario = agendamento.user;
    const nomePets = agendamento.appointmentPets
      .map((ap) => ap.pet.name)
      .join(", ");
    const nomeServicos = agendamento.appointmentServices
      .map((as) => as.service.nome)
      .join(", ");

    const dataFormatada = new Date(agendamento.data).toLocaleDateString(
      "pt-BR",
    );

    // Mensagem para WhatsApp
    const mensagemWhatsApp = `
🔔 *Lembrete - Pet Shop*

Olá ${usuario.name}! 

⏰ Lembrete: Você tem um agendamento AMANHÃ!

📅 Data: ${dataFormatada}
🕐 Horário: ${agendamento.hora}
🐶 Pet(s): ${nomePets}
✂️ Serviço(s): ${nomeServicos}

Nos vemos em breve! 🐾

Caso precise cancelar, entre em contato o quanto antes.
    `.trim();

    // HTML para email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fef3c7; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; 
                      border-left: 4px solid #f59e0b; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🔔 Lembrete de Agendamento</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${usuario.name}</strong>,</p>
            <p><strong>Este é um lembrete do seu agendamento AMANHÃ:</strong></p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">📅 Data:</span>
                <span class="value">${dataFormatada}</span>
              </div>
              <div class="info-row">
                <span class="label">🕐 Horário:</span>
                <span class="value">${agendamento.hora}</span>
              </div>
              <div class="info-row">
                <span class="label">🐶 Pet(s):</span>
                <span class="value">${nomePets}</span>
              </div>
              <div class="info-row">
                <span class="label">✂️ Serviço(s):</span>
                <span class="value">${nomeServicos}</span>
              </div>
            </div>
            
            <p>Estamos ansiosos para receber ${nomePets}! 🐾</p>
            <p>Caso precise cancelar ou reagendar, entre em contato o quanto antes.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pet Shop - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar notificações
    const resultados = {};

    // Enviar WhatsApp (se telefone disponível)
    if (usuario.telefone) {
      resultados.whatsapp = await enviarWhatsApp(
        usuario.telefone,
        mensagemWhatsApp,
      );
    }

    // Enviar Email
    resultados.email = await enviarEmail(
      usuario.email,
      "🔔 Lembrete: Seu agendamento é amanhã! - Pet Shop",
      emailHtml,
    );

    console.log(` Lembretes enviados para agendamento #${agendamentoId}`);
    return { success: true, resultados };
  } catch (error) {
    console.error(" Erro ao notificar lembrete:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 🔄 Notificação: Mudança de Status
 */
export async function notificarMudancaStatus(agendamentoId, novoStatus) {
  try {
    const agendamento = await prisma.appointment.findUnique({
      where: { id: agendamentoId },
      include: {
        user: true,
        appointmentPets: { include: { pet: true } },
      },
    });

    if (!agendamento) {
      throw new Error("Agendamento não encontrado");
    }

    const usuario = agendamento.user;
    const nomePets = agendamento.appointmentPets
      .map((ap) => ap.pet.name)
      .join(", ");
    const dataFormatada = new Date(agendamento.data).toLocaleDateString(
      "pt-BR",
    );

    const statusEmojis = {
      aprovado: "✅",
      cancelado: "❌",
      concluido: "✅",
    };

    const statusTextos = {
      aprovado: "APROVADO",
      cancelado: "CANCELADO",
      concluido: "CONCLUÍDO",
    };

    const emoji = statusEmojis[novoStatus] || "🔔";
    const statusTexto = statusTextos[novoStatus] || novoStatus.toUpperCase();

    const mensagem = `
${emoji} *Pet Shop - Atualização de Agendamento*

Olá ${usuario.name}!

Seu agendamento foi ${statusTexto}:

📅 Data: ${dataFormatada}
🕐 Horário: ${agendamento.hora}
🐶 Pet(s): ${nomePets}

${novoStatus === "cancelado" ? "Se precisar reagendar, estamos à disposição!" : ""}
    `.trim();

    const resultados = {};

    if (usuario.telefone) {
      resultados.whatsapp = await enviarWhatsApp(usuario.telefone, mensagem);
    }

    resultados.email = await enviarEmail(
      usuario.email,
      `${emoji} Agendamento ${statusTexto} - Pet Shop`,
      `<p>Olá <strong>${usuario.name}</strong>,</p>
       <p>Seu agendamento para <strong>${dataFormatada}</strong> às <strong>${agendamento.hora}</strong> 
       com ${nomePets} foi <strong>${statusTexto}</strong>.</p>`,
    );

    return { success: true, resultados };
  } catch (error) {
    console.error(" Erro ao notificar mudança de status:", error);
    return { success: false, error: error.message };
  }
}
