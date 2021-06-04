import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindPayments, PaymentsStatus } from '../../types/payment';
import { PaymentModel } from '../model/payments.model';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentModel)
    private readonly PaymentRepo: Repository<PaymentModel>,
  ) {}

  async create(payment: PaymentModel) {
    try {
      const newPayment = this.PaymentRepo.create(payment);
      await this.PaymentRepo.save(newPayment);

      return newPayment;
    } catch (error) {
      throw Error('Não foi possível criar um pagamento!');
    }
  }

  async update(payment: PaymentModel, id: string) {
    try {
      const updated = await this.PaymentRepo.update(id, payment);

      return updated.affected;
    } catch (error) {
      throw Error('Não foi possível editar um pagamento!');
    }
  }

  async updateStatus(status: PaymentsStatus | string, id: string) {
    try {
      const updated = await this.PaymentRepo.update(id, { status });

      return updated.affected;
    } catch (error) {
      throw Error('Não foi possível editar um pagamento!');
    }
  }

  async list({ type, status, customer }: FindPayments) {
    try {
      const payments = await this.PaymentRepo.find({
        where: {
          ...(type !== undefined ? { type } : {}),
          ...(status !== undefined ? { status } : {}),
          ...(customer !== undefined ? { customer } : {}),
        },
      });

      return payments;
    } catch (error) {
      throw Error('Não foi possível listar os pagamentos!');
    }
  }

  async listById(id: string) {
    try {
      const payment = await this.PaymentRepo.findOne({
        where: {
          id: id,
        },
      });

      return payment;
    } catch (error) {
      throw Error('Não foi possível encontrar o pagamento!');
    }
  }

  async delete(id: string) {
    try {
      await this.PaymentRepo.delete(id);

      return {};
    } catch (error) {}
  }
}
