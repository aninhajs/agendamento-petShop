import { User, sequelize } from "./models/index.js";

async function createTestUser() {
  try {
    await sequelize.sync();

    // Criar usuário admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@petshop.com",
      password: "123456",
      role: "admin",
    });

    console.log("✅ Usuário admin criado:", admin.email);

    // Criar usuário cliente
    const client = await User.create({
      name: "Cliente Teste",
      email: "cliente@petshop.com",
      password: "123456",
      role: "client",
    });

    console.log("✅ Usuário cliente criado:", client.email);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar usuários:", error.message);
    process.exit(1);
  }
}

createTestUser();
