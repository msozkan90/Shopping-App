import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

/**
 * Order Entity
 * Represents the Order table in the database.
 */
@Entity()
export class Order {
  /**
   * Order ID
   * Primary key of the Order table, auto-generated.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Customer ID
   * Many-to-One relationship with the User entity to represent the customer of this order.
   */
  @ManyToOne(() => User, (user) => user.id)
  customer_id!: number;

  /**
   * Products ID
   * Array of product IDs associated with this order.
   * Many-to-Many relationship with a Product entity can be established through a JoinTable.
   * However, the Product entity is not included in this code snippet.
   */
  @Column("simple-array")
  products_id!: number[];

  /**
   * Created At
   * Date and time when the order was created.
   * Automatically set when a new order is created.
   */
  @CreateDateColumn()
  created_at!: Date;

  /**
   * Updated At
   * Date and time when the order was last updated.
   * Automatically updated whenever the order is modified.
   */
  @UpdateDateColumn()
  updated_at!: Date;
}
