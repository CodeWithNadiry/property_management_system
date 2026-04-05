export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    
    // 1. Fix existing data
    await queryInterface.sequelize.query(`
      UPDATE passcodes SET status = 'expired' WHERE status = 'used';
    `, { transaction });

    // 2. Drop default temporarily
    await queryInterface.sequelize.query(`
      ALTER TABLE passcodes ALTER COLUMN status DROP DEFAULT;
    `, { transaction });

    // 3. Create new ENUM
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_passcodes_status_new" AS ENUM ('active', 'expired');
    `, { transaction });

    // 4. Alter column to new ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE passcodes
      ALTER COLUMN status
      TYPE "enum_passcodes_status_new"
      USING status::text::enum_passcodes_status_new;
    `, { transaction });

    // 5. Drop old ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_passcodes_status";
    `, { transaction });

    // 6. Rename new ENUM
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_passcodes_status_new"
      RENAME TO "enum_passcodes_status";
    `, { transaction });

    // 7. Set default again
    await queryInterface.sequelize.query(`
      ALTER TABLE passcodes ALTER COLUMN status SET DEFAULT 'active';
    `, { transaction });

  });
}