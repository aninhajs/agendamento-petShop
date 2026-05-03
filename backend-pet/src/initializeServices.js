import { Service, AvailableTime } from "./models/index.js";
import sequelize from "./config/database.js";

async function initializeServices() {
  try {
    await sequelize.sync({ alter: true });

    // Criar serviços exemplo
    const servicosExemplo = [
      {
        nome: "Banho",
        descricao: "Banho completo com shampoo especial",
        preco: 50.0,
        duracao: 60,
      },
      {
        nome: "Tosa",
        descricao: "Tosa higiênica ou completa",
        preco: 80.0,
        duracao: 90,
      },
      {
        nome: "Banho e Tosa",
        descricao: "Pacote completo de banho e tosa",
        preco: 120.0,
        duracao: 120,
      },
      {
        nome: "Consulta Veterinária",
        descricao: "Consulta completa com veterinário",
        preco: 150.0,
        duracao: 45,
      },
      {
        nome: "Vacinação",
        descricao: "Aplicação de vacinas",
        preco: 80.0,
        duracao: 30,
      },
    ];

    for (const servicoData of servicosExemplo) {
      const [servico, created] = await Service.findOrCreate({
        where: { nome: servicoData.nome },
        defaults: servicoData,
      });

      if (created) {
        console.log(`✅ Serviço criado: ${servico.nome}`);
      } else {
        console.log(`ℹ️  Serviço já existe: ${servico.nome}`);
      }
    }

    // Criar horários exemplo (Segunda a Sexta, 8h às 18h)
    const horariosExemplo = [
      { diaSemana: 1, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 1, horaInicio: "13:00", horaFim: "18:00" },
      { diaSemana: 2, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 2, horaInicio: "13:00", horaFim: "18:00" },
      { diaSemana: 3, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 3, horaInicio: "13:00", horaFim: "18:00" },
      { diaSemana: 4, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 4, horaInicio: "13:00", horaFim: "18:00" },
      { diaSemana: 5, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 5, horaInicio: "13:00", horaFim: "18:00" },
      { diaSemana: 6, horaInicio: "08:00", horaFim: "13:00" }, // Sábado só manhã
    ];

    for (const horarioData of horariosExemplo) {
      const [horario, created] = await AvailableTime.findOrCreate({
        where: horarioData,
        defaults: horarioData,
      });

      if (created) {
        console.log(
          `✅ Horário criado: Dia ${horario.diaSemana}, ${horario.horaInicio} - ${horario.horaFim}`,
        );
      }
    }

    console.log("\n✅ Serviços e horários inicializados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar serviços:", error);
  } finally {
    process.exit();
  }
}

initializeServices();
