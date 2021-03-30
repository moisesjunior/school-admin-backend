import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Customer } from '../infra/entities/customer.entity';
import { CustomerService } from '../services/customer.service';
import { PaymentService } from '../services/payments.service';
import { v4 as uuidv4 } from 'uuid';
import { CourseService } from '../services/courses.service';

@Controller('/customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService,
    private readonly courseService: CourseService,
  ) {}

  @Post()
  async createCustomer(
    @Res()
    response: Response,
    @Body()
    customer: Customer,
  ) {
    try {
      const newCustomer = await this.customerService.createCustomer(customer);
      const course = await this.courseService.listCourseById(
        String(newCustomer.course),
      );
      const dueDate = await this.paymentService.getDueDate(
        course.startAt,
        course.endAt,
      );

      await this.paymentService.createPayment({
        id: uuidv4(),
        billingType: 'BOLETO',
        customer: newCustomer,
        value: course.monthlyPayment,
        dueDate: dueDate.toISOString().split('T')[0],
        description: `${newCustomer.name}`,
        externalReference: '',
        discount: {
          value: 20,
          dueDateLimitDays: 0,
          type: 'FIXED',
        },
        interest: {
          value: 0.13,
        },
        fine: {
          value: 10,
        },
        createdAt: new Date(),
      });

      return response.status(HttpStatus.CREATED).send(newCustomer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Put(':id')
  async updateCustomer(
    @Res()
    response: Response,
    @Param('id')
    id: string,
    @Body()
    customer: Customer,
  ) {
    try {
      const updatedCustomer = await this.customerService.updateCustomer(
        customer,
        id,
      );

      return response.status(HttpStatus.OK).send(updatedCustomer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get()
  async listCustomers(
    @Res()
    response: Response,
  ) {
    try {
      const customers = await this.customerService.listCustomers();

      return response.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get(':id')
  async listCustomer(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const customer = await this.customerService.listCustomerById(id);

      return response.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Delete(':id')
  async deleteCustomer(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const customer = await this.customerService.deleteCustomerById(id);

      return response.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
