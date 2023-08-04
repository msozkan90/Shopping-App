// models/Product.ts
import { QueryResult } from 'pg';
import pool from '../db/db';

// Product modeli
export interface Product {
  id: number;
  name: string;
  price: number;
}

// Tüm ürünleri getiren fonksiyon
export async function getAllProducts(): Promise<Product[]> {
  const query = 'SELECT * FROM products';
  const result: QueryResult = await pool.query(query);
  return result.rows;
}

// Yeni ürün ekleyen fonksiyon
export async function addProduct(newProduct: Product): Promise<void> {
  const query = 'INSERT INTO products (name, price) VALUES ($1, $2)';
  const values = [newProduct.name, newProduct.price];
  await pool.query(query, values);
}
