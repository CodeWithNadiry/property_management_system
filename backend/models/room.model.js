import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Property from "./property.model.js";
import UnitGroup from "./unitGroup.model.js";

const Room = sequelize.define(
  "Room",
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

    unit_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // keep true for now (safe during migration)
      references: {
        model: UnitGroup,
        key: "id",
      },
    },

    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("available", "reserved", "occupied"),
      allowNull: false,
      defaultValue: "available",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rooms",
    timestamps: false,
  }
);

Room.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(Room, { foreignKey: "property_id" });

Room.belongsTo(UnitGroup, { foreignKey: "unit_group_id" });
UnitGroup.hasMany(Room, { foreignKey: "unit_group_id" });

export default Room;