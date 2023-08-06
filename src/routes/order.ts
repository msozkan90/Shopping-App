import express, { Request, Response } from 'express';
import {authMiddleware} from '../middlewares/authenticationMiddleware';
import {orderValidation, validateData} from '../validations/orderValidation';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { AppDataSource } from '../db/dataSource';

const router = express.Router();
const orderRepository = AppDataSource.getRepository(Order);
const productRepository = AppDataSource.getRepository(Product);
// Create an interface representing the shape of the data you expect to retrieve from the query

router.get('/orders', authMiddleware, async (req: Request, res: Response) => {
    const customerId = Number(req.user?.id);

    try {

      const orders = await orderRepository.find({ where: { customer_id: customerId } });

      // Fetch details of products for each order and calculate the total price
      const orderDetails = await Promise.all(orders.map(async (order) => {
        const productIds = order.products_id;

        const products = await productRepository.find({ where: productIds.map(id => ({ id })) }); // Fetch products by their IDs

        // Calculate the total price
        const total_price = products.reduce((total, product) => total + Number(product.price), 0);

        // Create a new order object without the products_id property and add total_price
        const orderDetail = {
          id: order.id,
          created_at: order.created_at,
          products,
          total_price,
        };
        return orderDetail;
      }));

      res.json(orderDetails);

    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders and product details from the database.' });
    }
  });

router.post('/order', orderValidation, validateData,  authMiddleware, async (req: Request, res: Response) => {
    const { products_id } = req.body;
    const customer_id = Number(req.user?.id);

    try {
        const order_object = new Order()
        order_object.products_id = products_id
        order_object.customer_id = customer_id

        // Check if all product IDs in the products_id array exist in the products table
        const validProducts = await productRepository.createQueryBuilder('product')
        .where('product.id = ANY(:productIds)', { productIds: products_id })
        .select('product.id')
        .getMany();

        if (validProducts.length !== products_id.length) {
            // If the number of valid products found is not equal to the input length,
            // it means there are invalid product IDs
            return res.status(400).json({ error: 'Invalid product ID(s) in the products_id array.' });
        }
        const order = await AppDataSource.manager.save(order_object)
        res.status(201).json(order);
    } catch (error) {
        console.error('Error inserting order into the database:', error);
        res.status(500).json({ error: 'Error inserting order into the database.' });
    }
});


router.get('/order/:id', authMiddleware, async (req: Request, res: Response) => {
    const customerId = Number(req.user?.id);
    const  id  = parseInt(req.params?.id, 10);
    try {

        const orders = await orderRepository.find({ where: { customer_id: customerId, id: id } });

        // Fetch details of products for each order and calculate the total price
        const orderDetails = await Promise.all(orders.map(async (order) => {
          const productIds = order.products_id;

          const products = await productRepository.find({ where: productIds.map(id => ({ id })) }); // Fetch products by their IDs

          // Calculate the total price
          const total_price = products.reduce((total, product) => total + Number(product.price), 0);

          // Create a new order object without the products_id property and add total_price
          const orderDetail = {
            id: order.id,
            created_at: order.created_at,
            products,
            total_price,
          };
          return orderDetail;
        }));

        if(orderDetails.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }

        res.json(orderDetails);

      } catch (error) {
        res.status(500).json({ error: 'Error fetching orders and product details from the database.' });
      }
});


router.patch('/order/:id', orderValidation, validateData, authMiddleware, async (req: Request, res: Response) => {
    const  id  = parseInt(req.params?.id, 10);
    const { products_id } = req.body;
    const userId = Number(req.user?.id);
    try {

        const updatedOrder = await orderRepository.createQueryBuilder()
        .update(Order) // Use the entity name 'Order' here
        .set({ products_id })
        .where('id = :id', { id })
        .andWhere('customer_id = :userId', { userId })
        .returning('*')
        .execute();

        if (!updatedOrder.affected || updatedOrder.affected === 0) {
            // If productToUpdate is null, it means the product with the specified id doesn't exist
            return res.status(404).json({ error: 'Product not found' });
          }

        res.json(updatedOrder.raw);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order in the database.' });
    }
})

router.delete('/order/:id', authMiddleware, async (req: Request, res: Response) => {
    const  id  = parseInt(req.params?.id, 10); ;
    const userId = Number(req.user?.id);
    try {

        const deletedOrder = await orderRepository.createQueryBuilder()
        .delete()
        .from(Order) // Use the entity name 'Order' here
        .where('id = :id', { id })
        .andWhere('customer_id = :userId', { userId })
        .returning('*')
        .execute();
        if (!deletedOrder.affected || deletedOrder.affected === 0) {
            // If no rows were affected (order not found or not matching customer_id)
            return res.status(404).json({ error: 'Order not found' });
          }

        res.json({ message: 'Order deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Error deleting order from the database.' });
    }
})

export default router;