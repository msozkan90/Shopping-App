import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  is_admin!: boolean;
}
