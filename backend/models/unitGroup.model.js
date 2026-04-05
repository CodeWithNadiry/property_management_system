import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Property from "./property.model.js";

const UnitGroup = sequelize.define(
  "UnitGroup",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Property, key: "id" },
    },

    type: {
      type: DataTypes.ENUM("single", "double"),
      allowNull: false,
    },

    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "unit_groups", timestamps: false }
);

UnitGroup.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(UnitGroup, { foreignKey: "property_id" });

export default UnitGroup;