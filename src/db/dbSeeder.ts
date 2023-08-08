// Import required modules and entities
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { AppDataSource } from "./dataSource";
import { getRandomInteger } from "../utils/utils";
import bcrypt from "bcrypt";

// Function to seed the database with sample data
export const dbSeeder = async () => {
  try {
    // Seed admin user
    const user_object = new User();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password", saltRounds);
    user_object.email = "admin@example.com";
    user_object.name = "admin";
    user_object.surname = "admin";
    user_object.password = hashedPassword;
    user_object.is_admin = true;
    const admin_user = await AppDataSource.manager.save(user_object);

    // Seed normal user
    const normal_user_object = new User();
    normal_user_object.email = "normal@example.com";
    normal_user_object.name = "normal";
    normal_user_object.surname = "user";
    normal_user_object.password = hashedPassword;
    normal_user_object.is_admin = false;
    const normal_user = await AppDataSource.manager.save(normal_user_object);

    // Seed products
    for (let i = 0; i < 10; i++) {
      const product_object = new Product();
      product_object.name = `product${i + 1}`;
      product_object.price = 100 + i;
      product_object.description = `product${i + 1} description`;
      await AppDataSource.manager.save(product_object);
    }

    // Seed orders
    for (let i = 0; i < 10; i++) {
      const order_object = new Order();
      order_object.customer_id = normal_user;
      order_object.products_id = [getRandomInteger(), getRandomInteger()];
      await AppDataSource.manager.save(order_object);
    }
  } catch (err) {
    console.log(err);
  }
};

// Export the function for use in other parts of the application
export default dbSeeder;
