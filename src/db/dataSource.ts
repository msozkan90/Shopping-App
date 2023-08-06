import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { Product } from "../entities/Product"
import { Order } from "../entities/Order"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "pass123",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [User, Product, Order],
    subscribers: [],
    migrations: [],
})