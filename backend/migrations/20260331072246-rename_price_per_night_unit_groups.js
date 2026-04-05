export async function up(queryInterface, Sequelize) {
  await queryInterface.renameColumn('unit_groups', 'price', 'price_per_night')
}