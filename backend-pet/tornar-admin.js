import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function tornarAdmin(email) {
  try {
    console.log(`🔍 Buscando usuário: ${email}`);

    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuario) {
      console.log("❌ Usuário não encontrado!");
      return;
    }

    console.log(`📋 Usuário atual: ${usuario.name} (Role: ${usuario.role})`);

    if (usuario.role === "admin") {
      console.log("✅ Usuário já é admin!");
      return;
    }

    // Atualiza para admin
    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    console.log(`✅ Usuário ${usuario.name} agora é ADMIN!`);
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Pega o email da linha de comando ou usa o padrão
const email = process.argv[2] || "anajeize24@gmail.com";
tornarAdmin(email);
