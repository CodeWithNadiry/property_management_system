import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // allowNull exists with this primary key
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "properties",
    timestamps: false,
  },
);

export default Property;
