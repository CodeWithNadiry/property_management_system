export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_reservations_status"
    RENAME VALUE 'reserved' TO 'confirmed';
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_reservations_status"
    RENAME VALUE 'confirmed' TO 'reserved';
  `);
}