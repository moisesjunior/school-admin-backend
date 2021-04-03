import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../infra/entities/payments.entity';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(payment: Payment): Promise<Payment> {
    console.log(payment.dueDate);

    const newAsaasPayment = {
      customer: payment.customer.id,
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
      const asaasCustomer = await axios.post(
        `${process.env.ASAAS_URL}/api/v3/payments`,
        newAsaasPayment,
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        },
      );
      payment.id = asaasCustomer.data.id;

      const newPayment = await this.paymentRepository.save(payment);

      return newPayment;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  }

  async updatePayment(payment: Payment, id: string) {
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
      await axios.post(
        `${process.env.ASAAS_URL}/api/v3/payments/${id}`,
        updatePayment,
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        },
      );

      const paymentToUpdate = await this.paymentRepository.findOne(id);

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

      await this.paymentRepository.save(paymentToUpdate);

      return paymentToUpdate;
    } catch (error) {
      console.log(error);
      return error.description;
    }
  }

  async deletePaymentById(id: string) {
    try {
      const paymentToRemove = await this.paymentRepository.findOne(id);

      await axios.delete(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: process.env.ASAAS_API_KEY,
        },
      });
      await this.paymentRepository.remove(paymentToRemove);

      return {};
    } catch (error) {
      return error;
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
