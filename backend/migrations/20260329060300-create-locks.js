"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("locks", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "properties", // table name of Property model
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    serial_number: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("locks");
}
