import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Payment } from '../infra/entities/payments.entity';
import { Customer } from '../infra/entities/customer.entity';
import { v4 as uuid } from 'uuid';
import {
  paymentStatusFromEvents,
  ReceivePayment,
  ReceiveInCash,
} from '../api-dto/receive-payment.dto';

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

    if (payment.type === 'Mensalidade') {
      payment.discount = {
        value: 20,
        dueDateLimitDays: 5,
        type: 'FIXED',
      };
      payment.interest = {
        value: 1,
      };
      payment.fine = {
        value: 10,
      };
    } else if (['Falta (Estágio)', 'Dependência'].includes(payment.type)) {
      payment.discount = {
        value: 0,
        dueDateLimitDays: 0,
        type: 'FIXED',
      };
      payment.interest = {
        value: 1,
      };
      payment.fine = {
        value: 10,
      };
    } else {
      payment.discount = {
        value: 0,
        dueDateLimitDays: 0,
        type: 'FIXED',
      };
      payment.interest = {
        value: 0,
      };
      payment.fine = {
        value: 0,
      };
    }

    try {
      if (
        payment.customer !== null &&
        payment.customer !== undefined &&
        payment.generateAssasPayment
      ) {
        const customer = await queryRunner.manager.findOne(
          Customer,
          payment.customer.id,
        );

        if (customer === undefined) {
          throw Error('Não foi possível encontrar o cliente especificado!');
        }

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

        const asaasCustomer = await this.httpService
          .post(`${process.env.ASAAS_URL}/api/v3/payments`, newAsaasPayment, {
            headers: {
              'Content-Type': 'application/json',
              access_token: process.env.ASAAS_API_KEY,
            },
          })
          .toPromise();
        payment.id = asaasCustomer.data.id;
        payment.status = asaasCustomer.data.status;
      } else {
        payment.id = uuid();
        payment.status = 'LOCAL';
      }

      const newPayment = await queryRunner.manager.save(Payment, payment);
      await queryRunner.commitTransaction();
      return newPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Não foi possível salvar o pagamento!');
    } finally {
      await queryRunner.release();
    }
  }

  async updatePayment(payment: Payment, id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentToUpdate: Payment = await queryRunner.manager.findOne(
        Payment,
        id,
      );

      if (paymentToUpdate === undefined) {
        throw Error('Não foi possível encontrar o pagamento especificado!');
      }

      if (
        payment.customer !== null &&
        payment.customer !== undefined &&
        payment.generateAssasPayment
      ) {
        const customer = await queryRunner.manager.findOne(
          Customer,
          payment.customer.id,
        );

        if (customer === undefined) {
          throw Error('Não foi possível encontrar o cliente especificado!');
        }

        const updatePayment = {
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

        if (paymentToUpdate.generateAssasPayment) {
          await this.httpService
            .post(
              `${process.env.ASAAS_URL}/api/v3/payments/${id}`,
              updatePayment,
              {
                headers: {
                  'Content-Type': 'application/json',
                  access_token: process.env.ASAAS_API_KEY,
                },
              },
            )
            .toPromise();
        }
      }

      paymentToUpdate.customer = payment.customer;
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
      throw Error('Não foi possível salvar o pagamento!');
    } finally {
      await queryRunner.release();
    }
  }

  async deletePaymentById(id: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const paymentToRemove: Payment = await queryRunner.manager.findOne(
        Payment,
        id,
      );

      if (paymentToRemove === undefined) {
        throw Error('Não foi possível encontrar o pagamento!');
      }

      if (paymentToRemove.generateAssasPayment) {
        await this.httpService
          .delete(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              access_token: process.env.ASAAS_API_KEY,
            },
          })
          .toPromise();
      }
      await queryRunner.manager.remove(Payment, paymentToRemove);
      await queryRunner.commitTransaction();
      return {};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Não foi possível excluir o pagamento!');
    } finally {
      await queryRunner.release();
    }
  }

  async listPayments() {
    try {
      const payments = await this.paymentRepository.find();

      return payments;
    } catch (error) {
      throw Error('Não foi possível listar os pagamentos!');
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
      throw Error('Não foi possível encontrar o pagamento!');
    }
  }

  async receivePayment({ event, payment }: ReceivePayment) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentToUpdate = await queryRunner.manager.findOne(
        Payment,
        payment.id,
      );

      if (paymentToUpdate === undefined) {
        throw Error('Não foi possível encontrar o pagamento!');
      }

      paymentToUpdate.status = paymentStatusFromEvents[event];

      await queryRunner.manager.save(Payment, paymentToUpdate);
      await queryRunner.commitTransaction();
      return paymentToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao fazer o recebimento em dinheiro!');
    } finally {
      await queryRunner.release();
    }
  }

  async receivePaymentInMoney(payment: ReceiveInCash, id: string) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const paymentToUpdate = await queryRunner.manager.findOne(Payment, id);

      if (paymentToUpdate === undefined) {
        throw Error('Não foi possível encontrar o pagamento!');
      }

      const updatePayment = await this.httpService
        .post(
          `${process.env.ASAAS_URL}/api/v3/payments/${id}/receiveInCash`,
          {
            payment,
          },
          {
            headers: {
              access_token: process.env.ASAAS_API_KEY,
            },
          },
        )
        .toPromise();

      paymentToUpdate.status = updatePayment.data.status;

      await queryRunner.manager.save(Payment, paymentToUpdate);
      await queryRunner.commitTransaction();
      return paymentToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao fazer o recebimento em dinheiro!');
    } finally {
      await queryRunner.release();
    }
  }
}
