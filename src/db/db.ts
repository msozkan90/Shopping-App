import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // .env dosyasını yükle

const pool = new Pool({
  user: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export default pool;
