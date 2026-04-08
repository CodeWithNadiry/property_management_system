export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("passcodes", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

    reservation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "reservations", key: "id" },
    },

    room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "rooms", key: "id" },
    },

    code: Sequelize.STRING(6),

    status: {
      type: Sequelize.ENUM("active", "expired"),
      defaultValue: "active",
    },

    valid_from: Sequelize.DATE,
    valid_until: Sequelize.DATE,

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("passcodes");
}
