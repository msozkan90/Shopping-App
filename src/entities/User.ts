import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * User Entity
 * Represents the User table in the database.
 */
@Entity()
export class User {
  /**
   * User ID
   * Primary key of the User table, auto-generated.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * User Email
   * Email address of the user.
   */
  @Column()
  email!: string;

  /**
   * User Name
   * First name of the user.
   */
  @Column()
  name!: string;

  /**
   * User Surname
   * Last name or surname of the user.
   */
  @Column()
  surname!: string;

  /**
   * User Password
   * Hashed or encrypted password of the user.
   */
  @Column()
  password!: string;

  /**
   * Is Admin
   * A flag indicating if the user is an admin.
   * Default value is false.
   */
  @Column({ default: false })
  is_admin!: boolean;
}
