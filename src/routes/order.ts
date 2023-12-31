import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/authenticationMiddleware";
import { orderValidation, validateData } from "../validations/orderValidation";
import { Order } from "../entities/Order";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { AppDataSource } from "../db/dataSource";

const router = express.Router();
const orderRepository = AppDataSource.getRepository(Order);
const productRepository = AppDataSource.getRepository(Product);

/**
 * Get Orders
 * Fetch and return all orders for the authenticated customer.
 * Uses 'authMiddleware' to check the JWT token and retrieve the customer ID.
 */
router.get("/orders", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user as User | undefined;

  try {
    // Fetch orders for the authenticated customer by customer_id
    const orders = await orderRepository.findBy({ customer_id: customer });
    // Fetch details of products for each order and calculate the total price
    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const productIds = order.products_id;

        // Fetch products by their IDs
        const products = await productRepository.findBy(
          productIds.map((id) => ({ id }))
        );

        // Calculate the total price
        const total_price = products.reduce(
          (total, product) => total + Number(product.price),
          0
        );

        // Create a new order object without the products_id property and add total_price
        const orderDetail = {
          id: order.id,
          created_at: order.created_at,
          customer_id: order.customer_id,
          products,
          total_price,
        };
        return orderDetail;
      })
    );

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error(
      "Error fetching orders and product details from the database:",
      error
    );
    res.status(500).json({
      error: "Error fetching orders and product details from the database.",
    });
  }
});

/**
 * Create Order
 * Create a new order for the authenticated customer.
 * Validates the request body using 'orderValidation' and 'validateData' middlewares.
 * Checks if the product IDs in the 'products_id' array exist in the products table.
 * Saves the order to the database.
 */
router.post(
  "/order",
  orderValidation,
  validateData,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { products_id } = req.body;
    const customer = req.user as User | undefined;
    if (customer) {
      const order_object = new Order();
      order_object.products_id = products_id;
      order_object.customer_id = customer;
      try {
        // Check if all product IDs in the 'products_id' array exist in the products table
        const validProducts = await productRepository
          .createQueryBuilder("product")
          .where("product.id = ANY(:productIds)", { productIds: products_id })
          .select("product.id")
          .getMany();

        if (validProducts.length !== products_id.length) {
          // If the number of valid products found is not equal to the input length,
          // it means there are invalid product IDs
          return res
            .status(400)
            .json({ error: "Invalid product ID(s) in the products_id array." });
        }

        const order = await AppDataSource.manager.save(order_object);
        res.status(201).json(order);
      } catch (error) {
        console.error("Error inserting order into the database:", error);
        res
          .status(500)
          .json({ error: "Error inserting order into the database." });
      }
    }
  }
);

/**
 * Get Order by ID
 * Fetch and return the order with the specified ID for the authenticated customer.
 * Uses 'authMiddleware' to check the JWT token and retrieve the customer ID.
 */
router.get(
  "/order/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const customer = req.user as User | undefined;
    const id = parseInt(req.params?.id, 10);

    try {
      // Fetch orders for the authenticated customer by customer_id and order ID
      const orders = await orderRepository.find({
        where: { customer_id: customer, id: id },
      });

      // Fetch details of products for each order and calculate the total price
      const orderDetails = await Promise.all(
        orders.map(async (order) => {
          const productIds = order.products_id;

          // Fetch products by their IDs
          const products = await productRepository.find({
            where: productIds.map((id) => ({ id })),
          });

          // Calculate the total price
          const total_price = products.reduce(
            (total, product) => total + Number(product.price),
            0
          );

          // Create a new order object without the products_id property and add total_price
          const orderDetail = {
            id: order.id,
            created_at: order.created_at,
            products,
            total_price,
          };
          return orderDetail;
        })
      );

      if (orderDetails.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(orderDetails);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching orders and product details from the database.",
      });
    }
  }
);

/**
 * Update Order by ID
 * Update the order with the specified ID for the authenticated customer.
 * Validates the request body using 'orderValidation' and 'validateData' middlewares.
 * Checks if the order with the specified ID exists and belongs to the authenticated customer.
 * Updates the order in the database.
 */
router.patch(
  "/order/:id",
  orderValidation,
  validateData,
  authMiddleware,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params?.id, 10);
    const { products_id } = req.body;
    const customer = req.user as User | undefined;

    try {
      // Check if the products with the given IDs exist in the database
      const existingProducts = await productRepository
        .createQueryBuilder("product")
        .where("product.id IN (:...ids)", { ids: products_id })
        .getMany();
      if (existingProducts.length !== products_id.length) {
        return res.status(400).json({ error: "Some products do not exist" });
      }

      // Update the order with the specified ID and customer ID
      const updatedOrder = await orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ products_id: products_id })
        .where("id = :id", { id })
        .andWhere({ customer_id: customer })
        .returning("*")
        .execute();

      if (!updatedOrder.affected || updatedOrder.affected === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Return a success response with relevant information
      res
        .status(200)
        .json({
          message: "Order updated successfully",
          order: updatedOrder.raw,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating order in the database." });
    }
  }
);

/**
 * Delete Order by ID
 * Delete the order with the specified ID for the authenticated customer.
 * Checks if the order with the specified ID exists and belongs to the authenticated customer.
 * Deletes the order from the database.
 */
router.delete(
  "/order/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params?.id, 10);
    const customer = req.user as User | undefined;

    try {
      // Delete the order with the specified ID and customer ID
      const deletedOrder = await orderRepository
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where("id = :id", { id })
        .andWhere({ customer_id: customer })
        .returning("*")
        .execute();

      if (!deletedOrder.affected || deletedOrder.affected === 0) {
        // If no rows were affected (order not found or not matching customer_id)
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting order from the database." });
    }
  }
);

export default router;
