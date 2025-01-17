import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'usr',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  forgotPasswordToken: string;
}
