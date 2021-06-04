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
  Patch,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymentModel } from '../infra/model/payments.model';
import { PaymentService } from '../services/payments.service';
import {
  ReceivePayment,
  ReceiveInCash,
  PaymentsType,
  PaymentsStatus,
} from '../types/payment';
import { CustomerModel } from '../infra/model/customer.model';

@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Res()
    response: Response,
    @Body()
    payment: PaymentModel,
  ) {
    try {
      const newPayment = await this.paymentService.createPayment(payment);

      return response.status(HttpStatus.CREATED).send(newPayment);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  // @Post('/webhook')
  // async receiveUpdateFromAsaas(
  //   @Res()
  //   response: Response,
  //   @Body()
  //   { event, payment }: ReceivePayment,
  // ) {
  //   try {
  //     const updatedPayment = await this.paymentService.receivePayment({
  //       event,
  //       payment,
  //     });

  //     return response.status(HttpStatus.OK).send(updatedPayment);
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).send({
  //       message: 'Atenção!',
  //       title: error.message,
  //     });
  //   }
  // }

  // @Patch(':id')
  // async receivePaymentInCash(
  //   @Res()
  //   response: Response,
  //   @Param('id')
  //   id: string,
  //   @Body()
  //   payment: ReceiveInCash,
  // ) {
  //   try {
  //     const updatedPayment = await this.paymentService.receivePaymentInMoney(
  //       payment,
  //       id,
  //     );

  //     return response.status(HttpStatus.OK).send(updatedPayment);
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).send({
  //       message: 'Atenção!',
  //       title: error.message,
  //     });
  //   }
  // }

  @Put(':id')
  async updatePayment(
    @Res()
    response: Response,
    @Param('id')
    id: string,
    @Body()
    payment: PaymentModel,
  ) {
    try {
      const updatedPayment = await this.paymentService.updatePayment(
        payment,
        id,
      );

      return response.status(HttpStatus.OK).send(updatedPayment);
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Atenção!',
        title: error.message,
      });
    }
  }

  @Get()
  async listPayments(
    @Res()
    response: Response,
    @Query('type')
    type: PaymentsType,
    @Query('status')
    status: PaymentsStatus,
    @Query('customer')
    customer: string,
  ) {
    try {
      const payments = await this.paymentService.listPayments({
        type,
        status,
        customer,
      });

      return response.status(HttpStatus.OK).json(payments);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Atenção!',
        title: error.message,
      });
    }
  }

  @Get(':id')
  async listPayment(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const payment = await this.paymentService.listPaymentById(id);

      return response.status(HttpStatus.OK).json(payment);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Atenção!',
        title: error.message,
      });
    }
  }

  @Delete(':id')
  async deletePayment(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const paymentFound = await this.paymentService.listPaymentById(id);

      if (paymentFound === undefined) {
        throw Error('Não foi possível encontrar o pagamento!');
      }

      const payment = await this.paymentService.deletePaymentById(id);

      return response.status(HttpStatus.OK).json(payment);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Atenção!',
        title: error.message,
      });
    }
  }
}
