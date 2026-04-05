export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_reservations_status"
    ADD VALUE IF NOT EXISTS 'pending';
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE "reservations"
    ALTER COLUMN "status" SET DEFAULT 'pending';
  `);
}