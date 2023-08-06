import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * Product Entity
 * Represents the Product table in the database.
 */
@Entity()
export class Product {
  /**
   * Product ID
   * Primary key of the Product table, auto-generated.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Product Name
   * Name of the product.
   */
  @Column()
  name!: string;

  /**
   * Product Price
   * Price of the product in numeric format.
   */
  @Column("numeric")
  price!: number;

  /**
   * Product Description
   * Description of the product.
   */
  @Column()
  description!: string;
}
