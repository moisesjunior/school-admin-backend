import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

interface Discount {
  value: number;
  dueDateLimitDays: number;
  type: string;
}

interface FineAndInterest {
  value: number;
}

@Entity()
export class Payment {
  @PrimaryColumn('varchar')
  id: string = uuidv4();

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  billingType: string;

  @Column('numeric')
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @Column('varchar')
  @IsString()
  @IsOptional()
  description: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  externalReference: string;

  @Column('int', {
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  installmentCount?: number;

  @Column('numeric', {
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  installmentValue?: number;

  @Column('json')
  @IsObject()
  @IsNotEmpty()
  discount: Discount;

  @Column('json')
  @IsObject()
  @IsNotEmpty()
  interest: FineAndInterest;

  @Column('json')
  @IsObject()
  @IsNotEmpty()
  fine: FineAndInterest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;
}
