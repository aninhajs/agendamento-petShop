import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Service = sequelize.define("Service", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duracao: {
    type: DataTypes.INTEGER, // duração em minutos
    allowNull: false,
    defaultValue: 60,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Service;
