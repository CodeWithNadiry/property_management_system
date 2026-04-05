import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Property from "./property.model.js";

const Lock = sequelize.define(
  "Lock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Property,
        key: "id",
      },
    },
    serial_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "locks",
    timestamps: false,
  }
);

// Associations
Lock.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(Lock, { foreignKey: "property_id" });

export default Lock;