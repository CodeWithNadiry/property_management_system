export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("confirmation_forms", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

    reservation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "reservations", key: "id" },
    },

    city: Sequelize.STRING,
    country: Sequelize.STRING,
    number_of_guests: Sequelize.INTEGER,

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('confirmation_forms')
}