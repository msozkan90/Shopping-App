import express from "express";
import bodyParser from "body-parser";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import customerRouter from "./routes/customer";
import dotenv from "dotenv";
import { AppDataSource } from "./db/dataSource";

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express application
const app = express();

// Initialize the data source (database connection)
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    // At this point, you can start working with your database
  })
  .catch((error) => console.log(error));

// Use body-parser middleware to handle JSON data
app.use(bodyParser.json());

// Define routes
app.use(productRouter);
app.use(customerRouter);
app.use(orderRouter);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
