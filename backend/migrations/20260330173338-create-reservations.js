export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("reservations", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

    name: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,

    room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "rooms", key: "id" },
    },

    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "properties", key: "id" },
    },

    check_in: Sequelize.DATE,
    check_out: Sequelize.DATE,

    status: {
      type: Sequelize.ENUM(
        "reserved",
        "checked_in",
        "checked_out",
        "cancelled",
        "noshow"
      ),
      defaultValue: "reserved",
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('reservations')
}