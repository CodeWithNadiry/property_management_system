
'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('rooms', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    room_number: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    floor: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('rooms');
}