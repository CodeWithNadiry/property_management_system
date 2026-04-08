export async function up(queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    "confirmation_forms",
    "confirmation_forms_reservation_id_fkey",
  );

  await queryInterface.addConstraint("confirmation_forms", {
    fields: ["reservation_id"],
    type: "foreign key",
    name: "confirmation_forms_reservation_id_fkey",
    references: {
      table: "reservations",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    "confirmation_forms",
    "confirmation_forms_reservation_id_fkey",
  );

  await queryInterface.addConstraint("confirmation_forms", {
    fields: ["reservation_id"],
    type: "foreign key",
    name: "confirmation_forms_reservation_id_fkey",
    references: {
      table: "reservations",
      field: "id",
    },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  });
}
