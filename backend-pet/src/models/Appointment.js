import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Appointment = sequelize.define("Appointment", {
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servico: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pendente",
  },
  // Campos adicionais opcionais
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Appointment;
