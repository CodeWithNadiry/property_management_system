import dotenv from "dotenv";
dotenv.config();

const db_url = process.env.DB_URL || 'postgresql://postgres.zefqjjawrlpksvoluiuf:nadiry_root@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'

export default {
  development: {
    url: db_url,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: db_url,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};