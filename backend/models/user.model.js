import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Property from "./property.model.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Property, key: "id" },
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: {
      type: DataTypes.ENUM("superadmin", "admin", "staff"),
      allowNull: false,
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

User.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(User, { foreignKey: "property_id" });

export default User;
