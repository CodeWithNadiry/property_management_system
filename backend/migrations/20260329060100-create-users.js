'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'properties', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    password: { type: Sequelize.TEXT, allowNull: false },
    role: { type: Sequelize.ENUM('superadmin', 'admin', 'staff'), allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}