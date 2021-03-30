import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Course } from './infra/entities/course.entity';
import { Payment } from './infra/entities/payments.entity';
import { Customer } from './infra/entities/customer.entity';
import { Expenditure } from './infra/entities/expenditure.entity';

import { CourseController } from './controllers/course.controller';
import { CustomerController } from './controllers/customer.controller';
import { PaymentController } from './controllers/payments.controller';

import { PaymentService } from './services/payments.service';
import { CourseService } from './services/courses.service';
import { CustomerService } from './services/customer.service';

import { ConfigModule } from '@nestjs/config';
import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Course, Payment, Customer, Expenditure],
      migrations: ['build/infra/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      logging: true,
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Course, Payment, Customer, Expenditure]),
  ],
  controllers: [CourseController, CustomerController, PaymentController],
  providers: [CourseService, CustomerService, PaymentService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
