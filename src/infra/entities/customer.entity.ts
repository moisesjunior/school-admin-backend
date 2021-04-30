import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Course } from './course.entity';
import { Payment } from './payments.entity';

@Entity()
export class Customer {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column('varchar', {
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @Column({
    type: 'varchar',
  })
  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  birthdate: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  nationality: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  maritalStatus: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  address: string;

  @Column('numeric', {
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  addressNumber: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  complement: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  province: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  city: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  state: string;

  @Column('varchar', {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  postalCode: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  rg: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  emitter: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  emissionDate: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  voterRegistration: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  reservist: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  fatherName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  motherName: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  highSchool: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  whichSchool: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  whichYear: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  whichCity: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  chronicDisease: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  hepatitis: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  useMedication: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  whichMedication: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Course, (course) => course.customers, {
    eager: true,
    nullable: true,
  })
  course: Course;

  @OneToMany(() => Payment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  payments: Payment[];
}
