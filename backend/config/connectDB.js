import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const db_url =
  process.env.DB_URL ||
  "postgresql://postgres.zefqjjawrlpksvoluiuf:nadiry_root@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";
const sequelize = new Sequelize(db_url, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize DB connected");
  } catch (error) {
    console.error("❌ Unable to connect:", error);
    process.exit(1);
  }
};

export default sequelize;
