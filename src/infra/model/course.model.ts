import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerModel } from './customer.model';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'course',
})
export class CourseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  startAt: Date;

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  endAt: Date;

  @Column('numeric')
  @IsNumber()
  @IsNotEmpty()
  monthlyPayment: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => CustomerModel, (customer) => customer.course)
  customers: CustomerModel[];
}
