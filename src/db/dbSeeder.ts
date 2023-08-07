import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { AppDataSource } from "./dataSource";
import { getRandomInteger } from "../utils/utils";
import bcrypt from "bcrypt";

export const dbSeeder = async () => {
    try{
        const user_object = new User();
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("password", saltRounds);
        user_object.email = "admin@example.com";
        user_object.name = "admin";
        user_object.surname = "admin";
        user_object.password = hashedPassword;
        user_object.is_admin = true;
        // Save the user to the database
        const admin_user = await AppDataSource.manager.save(user_object);

        const normal_user_object = new User();

        normal_user_object.email = "normal@example.com";
        normal_user_object.name = "normal";
        normal_user_object.surname = "user";
        normal_user_object.password = hashedPassword;
        normal_user_object.is_admin = false;
        // Save the user to the database
        const normal_user = await AppDataSource.manager.save(normal_user_object);

        for (let i = 0; i < 10; i++) {
            const product_object = new Product();
            product_object.name = `product${i+1}`;
            product_object.price = 100 + i;
            product_object.description = `product${i+1} description`;
            await AppDataSource.manager.save(product_object);
        }

        for (let i = 0; i < 10; i++) {
            const order_object = new Order();
            order_object.customer_id = normal_user;
            order_object.products_id = [getRandomInteger(),getRandomInteger()];
            await AppDataSource.manager.save(order_object);
        }

    }
    catch(err){
        console.log(err);
    }

}