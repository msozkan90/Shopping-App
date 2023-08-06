import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * AppDataSource
 * Data source configuration for TypeORM to connect to the PostgreSQL database.
 */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: [User, Product, Order],
  subscribers: [],
  migrations: [],
});
