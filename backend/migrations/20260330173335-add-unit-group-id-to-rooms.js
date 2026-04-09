export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("rooms", "unit_group_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "unit_groups",
      key: "id",
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("rooms", "unit_group_id");
}
