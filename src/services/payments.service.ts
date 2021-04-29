import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Payment } from '../infra/entities/payments.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private httpService: HttpService,
    private connection: Connection,
  ) {}

  async createPayment(payment: Payment): Promise<Payment> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newAsaasPayment = {
      customer: payment.customer,
      billingType: payment.billingType,
      value: payment.value,
      dueDate: payment.dueDate,
      description: payment.description,
      externalReference: payment.externalReference,
      installmentCount: payment.installmentCount,
      installmentValue: payment.installmentValue,
      discount: payment.discount,
      interest: payment.interest,
      fine: payment.fine,
      postalService: false,
    };

    try {
      const asaasCustomer = await this.httpService
        .post(`${process.env.ASAAS_URL}/api/v3/payments`, newAsaasPayment, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();
      payment.id = asaasCustomer.data.id;

      const newPayment = await queryRunner.manager.save(Payment, payment);
      await queryRunner.commitTransaction();
      return newPayment;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return error.response.data;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePayment(payment: Payment, id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const updatePayment = {
      billingType: payment.billingType,
      value: payment.value,
      dueDate: payment.dueDate,
      description: payment.description,
      externalReference: payment.externalReference,
      installmentCount: payment.installmentCount,
      installmentValue: payment.installmentValue,
      discount: payment.discount,
      interest: payment.interest,
      fine: payment.fine,
      postalService: false,
    };

    try {
      await this.httpService
        .post(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, updatePayment, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      const paymentToUpdate: Payment = await queryRunner.manager.findOne(
        Payment,
        id,
      );

      paymentToUpdate.billingType = payment.billingType;
      paymentToUpdate.value = payment.value;
      paymentToUpdate.dueDate = payment.dueDate;
      paymentToUpdate.description = payment.description;
      paymentToUpdate.externalReference = payment.externalReference;
      paymentToUpdate.installmentCount = payment.installmentCount;
      paymentToUpdate.installmentValue = payment.installmentValue;
      paymentToUpdate.discount = payment.discount;
      paymentToUpdate.interest = payment.interest;
      paymentToUpdate.fine = payment.fine;

      await queryRunner.manager.save(Payment, paymentToUpdate);
      await queryRunner.commitTransaction();
      return paymentToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error.description;
    } finally {
      await queryRunner.release();
    }
  }

  async deletePaymentById(id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const paymentToRemove: Payment = await queryRunner.manager.findOne(
        Payment,
        id,
      );

      await this.httpService
        .delete(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();
      await queryRunner.manager.remove(Payment, paymentToRemove);
      await queryRunner.commitTransaction();
      return {};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async listPayments() {
    try {
      const payments = await this.paymentRepository.find();

      return payments;
    } catch (error) {
      return error;
    }
  }

  async listPaymentById(id: string) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: {
          id: id,
        },
      });

      return payment;
    } catch (error) {
      return error;
    }
  }
}
