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
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Customer } from '../infra/entities/customer.entity';
import { CustomerService } from '../services/customer.service';
import { PaymentService } from '../services/payments.service';
import { CourseService } from '../services/courses.service';
import { DateUtils } from '../utils/dateUtils';

@Controller('/customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService,
    private readonly courseService: CourseService,
    private readonly dateUtils: DateUtils,
  ) {}

  @Post()
  async createCustomer(
    @Res()
    response: Response,
    @Body()
    customer: Customer,
  ) {
    try {
      const findCustomerCpf = await this.customerService.listCustomers({
        cpf: customer.cpf,
      });

      const findCustomerRg = await this.customerService.listCustomers({
        rg: customer.rg,
      });

      if (findCustomerCpf.length > 0 || findCustomerRg.length > 0) {
        throw Error('Já existe um cliente cadastrado com esse CPF ou RG!');
      }

      const newCustomer = await this.customerService.createCustomer(customer);

      return response.status(HttpStatus.CREATED).send(newCustomer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Put('/:id')
  async updateCustomer(
    @Res()
    response: Response,
    @Param('id')
    id: string,
    @Body()
    customer: Customer,
  ) {
    try {
      const findCustomerCpf = await this.customerService.listCustomers({
        cpf: customer.cpf,
        id,
      });

      const findCustomerRg = await this.customerService.listCustomers({
        rg: customer.rg,
        id,
      });

      if (findCustomerCpf.length !== 0 || findCustomerRg.length !== 0) {
        throw Error('Já existe um cliente cadastrado com esse CPF e RG!');
      }

      const updatedCustomer = await this.customerService.updateCustomer(
        customer,
        id,
      );

      return response.status(HttpStatus.OK).send(updatedCustomer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Get()
  async listCustomers(
    @Res()
    response: Response,
    @Query('course')
    course?: string,
  ) {
    try {
      const customers = await this.customerService.listCustomers({ course });

      return response.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Get('/:id')
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
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Delete('/:id')
  async deleteCustomer(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const customerFound = await this.customerService.listCustomerById(id);

      if (customerFound === undefined) {
        throw Error('Não foi possível encontrar um cliente!');
      }

      const customer = await this.customerService.deleteCustomerById(id);

      return response.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Atenção!',
        title: error.message,
      });
    }
  }
}
