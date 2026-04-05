import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("reservations", "total_price", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0, // give a default so migration works if table already has rows
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("reservations", "total_price");
}