import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/authenticationMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";
import {
  productCreateValidation,
  productUpdateValidation,
  validateData,
} from "../validations/productValidation";
import { Product } from "../entities/Product";
import { AppDataSource } from "../db/dataSource";

const router = express.Router();

/**
 * Get All Products
 * Fetch and return all products.
 * Requires authentication using 'authMiddleware'.
 */
router.get("/products", authMiddleware, async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Create Product
 * Create a new product with the provided information.
 * Validates the request body using 'productCreateValidation' and 'validateData' middlewares.
 * Requires permission using 'permissionMiddleware'.
 */
router.post(
  "/product",
  productCreateValidation,
  validateData,
  permissionMiddleware,
  async (req: Request, res: Response) => {
    try {
      const product_object = new Product();
      const { name, price, description } = req.body;
      product_object.name = name;
      product_object.price = price;
      product_object.description = description;

      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.save(product_object);

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * Update Product by ID
 * Update the product with the specified ID.
 * Validates the request body using 'productUpdateValidation' and 'validateData' middlewares.
 * Requires permission using 'permissionMiddleware'.
 */
router.patch(
  "/product/:id",
  productUpdateValidation,
  validateData,
  permissionMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id); // Convert the id to a number
      const { name, price, description } = req.body;

      const productRepository = AppDataSource.getRepository(Product);

      // Find the product by its primary key (id)
      const productToUpdate = await productRepository.findOne({
        where: { id: id },
      });

      if (!productToUpdate) {
        // If productToUpdate is null, it means the product with the specified id doesn't exist
        return res.status(404).json({ error: "Product not found" });
      }

      // Update the product properties if provided in the request body
      if (name) {
        productToUpdate.name = name;
      }

      if (price) {
        productToUpdate.price = price;
      }

      if (description) {
        productToUpdate.description = description;
      }

      const updated_product = await productRepository.save(productToUpdate);

      res.status(200).json(updated_product); // Return the updated product
    } catch (err) {
      console.error("Error while updating product:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * Delete Product by ID
 * Delete the product with the specified ID.
 * Requires permission using 'permissionMiddleware'.
 */
router.delete(
  "/product/:id",
  permissionMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id); // Convert the id to a number
      const productRepository = AppDataSource.getRepository(Product);
      const productToDelete = await productRepository.findOne({
        where: { id: id },
      });

      if (!productToDelete) {
        // If the product with the specified ID doesn't exist, return an error
        return res.status(404).json({ error: "Product not found" });
      }

      await productRepository.remove(productToDelete);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
