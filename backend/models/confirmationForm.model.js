import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Reservation from "./reservation.model.js";

const ConfirmationForm = sequelize.define(
  "ConfirmationForm",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: Reservation, key: "id" },
    },

    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    number_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "confirmation_forms", timestamps: false },
);

ConfirmationForm.belongsTo(Reservation, {
  foreignKey: "reservation_id",
});

Reservation.hasOne(ConfirmationForm, {
  foreignKey: "reservation_id",
  onDelete: "CASCADE",
});

export default ConfirmationForm;
