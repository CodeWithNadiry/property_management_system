import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Reservation from "./reservation.model.js";
import Room from "./room.model.js";

const Passcode = sequelize.define(
  "Passcode",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    reservation_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      unique: true,
      references: { model: Reservation, key: "id" } 
    },

    room_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: { model: Room, key: "id" } 
    },

    code: { type: DataTypes.STRING(6), allowNull: false },

    status: { 
      type: DataTypes.ENUM("active", "expired"), 
      defaultValue: "active" 
    },

    valid_from: { type: DataTypes.DATE, allowNull: false },
    valid_until: { type: DataTypes.DATE, allowNull: false },

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "passcodes", timestamps: false }
);

Reservation.hasOne(Passcode, { foreignKey: "reservation_id" });
Passcode.belongsTo(Reservation, { foreignKey: "reservation_id", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Room.hasOne(Passcode, { foreignKey: "room_id" });
Passcode.belongsTo(Room, { foreignKey: "room_id" });

export default Passcode;