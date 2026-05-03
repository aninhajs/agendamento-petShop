import sequelize from "../config/database.js";
import User from "./User.js";
import Pet from "./Pet.js";
import Appointment from "./Appointment.js";
import Service from "./Service.js";
import AvailableTime from "./AvailableTime.js";

// 🔥 Definir todas as associações AQUI para evitar imports circulares

// User <-> Pet
User.hasMany(Pet, { foreignKey: "UserId" });
Pet.belongsTo(User, { foreignKey: "UserId" });

// User <-> Appointment
User.hasMany(Appointment, { foreignKey: "UserId" });
Appointment.belongsTo(User, { foreignKey: "UserId" });

// Pet <-> Appointment
Pet.hasMany(Appointment, { foreignKey: "PetId" });
Appointment.belongsTo(Pet, { foreignKey: "PetId" });

// Service <-> Appointment (opcional, para conectar serviço ao agendamento)
Service.hasMany(Appointment, { foreignKey: "ServiceId" });
Appointment.belongsTo(Service, { foreignKey: "ServiceId" });

export { sequelize, User, Pet, Appointment, Service, AvailableTime };
