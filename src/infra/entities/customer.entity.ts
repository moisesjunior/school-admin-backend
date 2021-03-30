import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Course } from './course.entity';
import { Payment } from './payments.entity';

@Unique(['cpf', 'rg', 'email'])
@Entity()
export class Customer {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @Column('varchar')
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  birthdate: Date;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column('numeric')
  @IsNumber()
  @IsNotEmpty()
  addressNumber: number;

  @Column('varchar')
  @IsString()
  @IsOptional()
  complement: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  province: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  city: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  state: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  rg: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  emitter: string;

  @Column('timestamp')
  @IsDateString()
  @IsNotEmpty()
  emissionDate: Date;

  @Column('varchar')
  @IsString()
  @IsOptional()
  voterRegistration: string;

  @Column('boolean')
  @IsBoolean()
  @IsOptional()
  reservist: boolean;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  motherName: string;

  @Column('boolean')
  @IsBoolean()
  @IsNotEmpty()
  highSchool: boolean;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  whichSchool: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  whichYear: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  whichCity: string;

  @Column('boolean')
  @IsBoolean()
  @IsNotEmpty()
  chronicDisease: boolean;

  @Column('boolean')
  @IsBoolean()
  @IsNotEmpty()
  hepatitis: boolean;

  @Column('boolean')
  @IsBoolean()
  @IsNotEmpty()
  useMedication: boolean;

  @Column('varchar', {
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
  })
  course: Course;

  @OneToMany(() => Payment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  payments: Payment[];
}
