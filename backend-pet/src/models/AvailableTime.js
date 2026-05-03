import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AvailableTime = sequelize.define("AvailableTime", {
  diaSemana: {
    type: DataTypes.INTEGER, // 0=Domingo, 1=Segunda, ..., 6=Sábado
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.STRING, // formato "HH:MM"
    allowNull: false,
  },
  horaFim: {
    type: DataTypes.STRING, // formato "HH:MM"
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default AvailableTime;
