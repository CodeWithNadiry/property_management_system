export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("rooms", "status", {
    type: Sequelize.ENUM("available", "reserved", "occupied"),
    allowNull: false,
    defaultValue: "available",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("rooms", "status");
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_rooms_status";',
  );
}
