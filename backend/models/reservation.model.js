import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Room from "./room.model.js";
import Property from "./property.model.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },

    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Room, key: "id" },
    },

    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Property, key: "id" },
    },

    check_in: { type: DataTypes.DATE, allowNull: false },
    check_out: { type: DataTypes.DATE, allowNull: false },

    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "noshow"
      ),
      defaultValue: "pending",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "reservations", timestamps: false }
);

// Relations
Reservation.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(Reservation, { foreignKey: "room_id" });

Reservation.belongsTo(Property, { foreignKey: "property_id" });


export default Reservation;