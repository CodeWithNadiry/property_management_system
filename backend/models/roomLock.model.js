import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Room from "./room.model.js";
import Lock from "./lock.model.js";
import Property from "./property.model.js";

const RoomLock = sequelize.define(
  "RoomLock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Only one lock per room
      references: {
        model: Room,
        key: "id",
      },
    },
    lock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Only one room per lock
      references: {
        model: Lock,
        key: "id",
      },
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Property,
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "room_lock_connection",
    timestamps: false,
  }
);

RoomLock.belongsTo(Room, { foreignKey: "room_id" });
Room.hasOne(RoomLock, { foreignKey: "room_id" });

RoomLock.belongsTo(Lock, { foreignKey: "lock_id" });
Lock.hasOne(RoomLock, { foreignKey: "lock_id" });

RoomLock.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(RoomLock, { foreignKey: "property_id" });

export default RoomLock;