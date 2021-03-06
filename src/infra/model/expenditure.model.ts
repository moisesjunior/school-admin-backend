import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'expenditure',
})
export class ExpenditureModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @Column('numeric')
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  expenditureType: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  referenceDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  paymentDay: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
