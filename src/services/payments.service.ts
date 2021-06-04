import { Injectable } from '@nestjs/common';
import { PaymentModel } from '../infra/model/payments.model';
import { v4 as uuid } from 'uuid';
import {
  paymentStatusFromEvents,
  ReceivePayment,
  ReceiveInCash,
  FindPayments,
  PaymentsType,
} from '../types/payment';
import { PaymentRepository } from '../infra/repositories/payments.repository';
import { CustomerRepository } from '../infra/repositories/customer.repository';
import { AsaasPaymentService } from '../utils/asaasPayment.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly asaasPaymentService: AsaasPaymentService,
  ) {}

  async createDiscountFineAndInterest(type: PaymentsType) {
    let discount = {
      value: 0,
      dueDateLimitDays: 0,
      type: 'FIXED',
    };

    let interest = {
      value: 0,
    };

    let fine = {
      value: 0,
    };

    if (type === 'Mensalidade') {
      discount = {
        value: 20,
        dueDateLimitDays: 5,
        type: 'FIXED',
      };
      interest = {
        value: 1,
      };
      fine = {
        value: 10,
      };
    } else if (['Falta (Estágio)', 'Dependência'].includes(type)) {
      discount = {
        value: 0,
        dueDateLimitDays: 0,
        type: 'FIXED',
      };
      interest = {
        value: 1,
      };
      fine = {
        value: 10,
      };
    }

    return { discount, interest, fine };
  }

  async createPayment(payment: PaymentModel): Promise<PaymentModel> {
    if (
      payment.customer !== null &&
      payment.customer !== undefined &&
      payment.generateAssasPayment
    ) {
      const customer = await this.customerRepository.listById(
        payment.customer.id,
      );
      if (customer === undefined) {
        throw Error('Não foi possível encontrar o cliente especificado!');
      }

      const {
        discount,
        interest,
        fine,
      } = await this.createDiscountFineAndInterest(payment.type);
      payment.discount = discount;
      payment.interest = interest;
      payment.fine = fine;

      const asaasPayment = await this.asaasPaymentService.create(payment);

      payment.id = asaasPayment.id;
      payment.status = asaasPayment.status;
    } else {
      payment.id = uuid();
      payment.status = 'LOCAL';
    }

    const newPayment = await this.paymentRepository.create(payment);
    return newPayment;
  }

  async updatePayment(payment: PaymentModel, id: string) {
    const paymentToUpdate: PaymentModel = await this.paymentRepository.listById(
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
      const customer = await this.customerRepository.listById(
        payment.customer.id,
      );

      if (customer === undefined) {
        throw Error('Não foi possível encontrar o cliente especificado!');
      }
      const {
        discount,
        interest,
        fine,
      } = await this.createDiscountFineAndInterest(payment.type);
      payment.discount = discount;
      payment.interest = interest;
      payment.fine = fine;

      if (paymentToUpdate.generateAssasPayment) {
        await this.asaasPaymentService.update(payment, id);
      }
    }

    await this.paymentRepository.update(payment, id);
    const paymentUpdated = await this.paymentRepository.listById(id);
    return paymentUpdated;
  }

  async deletePaymentById(id: string) {
    const paymentToRemove: PaymentModel = await this.paymentRepository.listById(
      id,
    );

    if (paymentToRemove === undefined) {
      throw Error('Não foi possível encontrar o pagamento!');
    }

    if (paymentToRemove.generateAssasPayment) {
      await this.asaasPaymentService.delete(id);
    }

    await this.paymentRepository.delete(id);
    return {};
  }

  async listPayments({ type, status, customer }: FindPayments) {
    const payment = await this.paymentRepository.list({
      type,
      status,
      customer,
    });

    return payment;
  }

  async listPaymentById(id: string) {
    const payment = await this.paymentRepository.listById(id);

    return payment;
  }

  // async receivePayment({ event, payment }: ReceivePayment) {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const paymentToUpdate = await queryRunner.manager.findOne(
  //       PaymentModel,
  //       payment.id,
  //     );

  //     if (paymentToUpdate === undefined) {
  //       throw Error('Não foi possível encontrar o pagamento!');
  //     }

  //     paymentToUpdate.status = paymentStatusFromEvents[event];

  //     await queryRunner.manager.save(PaymentModel, paymentToUpdate);
  //     await queryRunner.commitTransaction();
  //     return paymentToUpdate;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw Error('Ocorreu um erro ao fazer o recebimento em dinheiro!');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async receivePaymentInMoney(payment: ReceiveInCash, id: string) {
  //   const queryRunner = this.connection.createQueryRunner();
  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const paymentToUpdate = await queryRunner.manager.findOne(
  //       PaymentModel,
  //       id,
  //     );

  //     if (paymentToUpdate === undefined) {
  //       throw Error('Não foi possível encontrar o pagamento!');
  //     }

  //     paymentToUpdate.status = updatePayment.data.status;

  //     await queryRunner.manager.save(PaymentModel, paymentToUpdate);
  //     await queryRunner.commitTransaction();
  //     return paymentToUpdate;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw Error('Ocorreu um erro ao fazer o recebimento em dinheiro!');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
