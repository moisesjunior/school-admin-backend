import {
  Module,
  HttpModule,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { CourseModel } from './infra/model/course.model';
import { PaymentModel } from './infra/model/payments.model';
import { CustomerModel } from './infra/model/customer.model';
import { ExpenditureModel } from './infra/model/expenditure.model';

import { CourseController } from './controllers/course.controller';
import { CustomerController } from './controllers/customer.controller';
import { PaymentController } from './controllers/payments.controller';
import { ExpenditureController } from './controllers/expenditure.controller';

import { PaymentService } from './services/payments.service';
import { CourseService } from './services/courses.service';
import { CustomerService } from './services/customer.service';
import { ExpenditureService } from './services/expenditure.service';

import { CourseRepository } from './infra/repositories/course.repository';

import 'reflect-metadata';
import { DateUtils } from './utils/dateUtils';

import { AuthMiddleware } from './middlewares/auth.middleware';
import { CustomerRepository } from './infra/repositories/customer.repository';
import { AsaasCustomerService } from './utils/asaasCustomer.service';
import { ExpenditureRepository } from './infra/repositories/expenditure.repository';
import { PaymentRepository } from './infra/repositories/payments.repository';
import { AsaasPaymentService } from './utils/asaasPayment.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [CourseModel, PaymentModel, CustomerModel, ExpenditureModel],
      migrations: ['build/infra/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      logging: true,
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([
      CourseModel,
      PaymentModel,
      CustomerModel,
      ExpenditureModel,
    ]),
  ],
  controllers: [
    CourseController,
    CustomerController,
    PaymentController,
    ExpenditureController,
  ],
  providers: [
    CourseService,
    CustomerService,
    PaymentService,
    ExpenditureService,
    AsaasCustomerService,
    AsaasPaymentService,
    DateUtils,
    CourseRepository,
    CustomerRepository,
    ExpenditureRepository,
    PaymentRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/payment/webhook', method: RequestMethod.POST })
      .forRoutes(
        PaymentController,
        CourseController,
        CustomerController,
        ExpenditureController,
      );
  }
}
