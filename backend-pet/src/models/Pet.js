import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pet = sequelize.define("Pet", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca: DataTypes.STRING,
  idade: DataTypes.INTEGER,
});

export default Pet;
