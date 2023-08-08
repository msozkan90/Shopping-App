import express from "express";
import bodyParser from "body-parser";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import customerRouter from "./routes/customer";
import dotenv from "dotenv";
import { AppDataSource } from "./db/dataSource";
import { dbSeeder } from "./db/dbSeeder";

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Initialize the data source (database connection)
AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    // At this point, the database connection is established
    // and you can start working with your database
    await dbSeeder(); // Seed the database with sample data
    console.log("Database has been seeded!");
  })
  .catch((error) => console.log(error));

// Use body-parser middleware to handle JSON data
app.use(bodyParser.json());

// Define routes
app.use(productRouter); // Mount the product router
app.use(customerRouter); // Mount the customer router
app.use(orderRouter);    // Mount the order router

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
