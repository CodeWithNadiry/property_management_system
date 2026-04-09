export async function up(queryInterface) {
  await queryInterface.removeConstraint(
    "passcodes",
    "passcodes_reservation_id_fkey",
  );

  await queryInterface.addConstraint("passcodes", {
    fields: ["reservation_id"],
    type: "foreign key",
    name: "passcodes_reservation_id_fkey",
    references: {
      table: "reservations",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeConstraint(
    "passcodes",
    "passcodes_reservation_id_fkey",
  );

  await queryInterface.addConstraint("passcodes", {
    fields: ["reservation_id"],
    type: "foreign key",
    name: "passcodes_reservation_id_fkey",
    references: {
      table: "reservations",
      field: "id",
    },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  });
}
