export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("unit_groups", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "properties", key: "id" },
    },

    type: {
      type: Sequelize.ENUM("single", "double"),
      allowNull: false,
    },

    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("unit_groups");
}
