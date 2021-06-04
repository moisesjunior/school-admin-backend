import { HttpService, Injectable } from '@nestjs/common';
import { PaymentModel } from '../infra/model/payments.model';
import { ReceiveInCash } from '../types/payment';

@Injectable()
export class AsaasPaymentService {
  constructor(private httpService: HttpService) {}

  async create(payment: PaymentModel) {
    try {
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

      return asaasCustomer.data;
    } catch (error) {
      throw Error('Não foi possível salvar o pagamento no Asaas!');
    }
  }

  async update(payment: PaymentModel, id: string) {
    try {
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

      await this.httpService
        .post(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, updatePayment, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return {};
    } catch (error) {
      console.log(error.response.data);
      throw Error('Não foi possível editar o pagamento do Asaas!');
    }
  }

  async receiveInCash(payment: ReceiveInCash, id: string) {
    try {
      const updatePayment = await this.httpService
        .post(
          `${process.env.ASAAS_URL}/api/v3/payments/${id}/receiveInCash`,
          payment,
          {
            headers: {
              access_token: process.env.ASAAS_API_KEY,
            },
          },
        )
        .toPromise();

      return updatePayment.data.status;
    } catch (error) {
      throw Error('Não foi possível concluir o recebimento em dinheiro!');
    }
  }

  async delete(id: string) {
    try {
      await this.httpService
        .delete(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return {};
    } catch (error) {
      throw Error('Não foi possível excluir o pagamento do Asaas!');
    }
  }

  async getById(id: string) {
    try {
      const asaasCustomer = await this.httpService
        .delete(`${process.env.ASAAS_URL}/api/v3/payments/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return asaasCustomer.data;
    } catch (error) {
      throw Error('Não foi possível recuperar o pagamento do Asaas!');
    }
  }
}
