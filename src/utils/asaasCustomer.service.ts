import { HttpService, Injectable } from '@nestjs/common';
import { CustomerModel } from '../infra/model/customer.model';

@Injectable()
export class AsaasCustomerService {
  constructor(private httpService: HttpService) {}

  async create(customer: CustomerModel): Promise<any> {
    const newAsaasCustomer = {
      name: customer.name,
      cpfCnpj: customer.cpf,
      email: customer.email,
      phone: customer.phoneNumber,
      mobilePhone: customer.mobilePhone,
      address: customer.address,
      addressNumber: customer.addressNumber,
      complement: customer.complement,
      province: customer.province,
      postalCode: customer.postalCode,
    };

    try {
      const asaasCustomer = await this.httpService
        .post(`${process.env.ASAAS_URL}/api/v3/customers`, newAsaasCustomer, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return asaasCustomer.data;
    } catch (error) {
      throw Error('Não foi possível salvar o cliente no Asaas!');
    }
  }

  async update(customer: CustomerModel, id: string) {
    const updateCustomer = {
      name: customer.name,
      cpfCnpj: customer.cpf,
      email: customer.email,
      phone: customer.phoneNumber,
      mobilePhone: customer.mobilePhone,
      address: customer.address,
      addressNumber: customer.addressNumber,
      complement: customer.complement,
      province: customer.province,
      postalCode: customer.postalCode,
    };

    try {
      await this.httpService
        .post(
          `${process.env.ASAAS_URL}/api/v3/customers/${id}`,
          updateCustomer,
          {
            headers: {
              'Content-Type': 'application/json',
              access_token: process.env.ASAAS_API_KEY,
            },
          },
        )
        .toPromise();

      return {};
    } catch (error) {
      throw Error('Não foi possível editar o usuário no Asaas!');
    }
  }

  async delete(id: string) {
    try {
      await this.httpService
        .delete(`${process.env.ASAAS_URL}/api/v3/customers/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return {};
    } catch (error) {
      throw Error('Não foi possível excluir o usuário do Asaas!');
    }
  }

  async getById(id: string) {
    try {
      const asaasCustomer = await this.httpService
        .get(`${process.env.ASAAS_URL}/api/v3/customers/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        })
        .toPromise();

      return asaasCustomer.data;
    } catch (error) {
      throw Error('Não foi possível encontrar o usuário no Asaas!');
    }
  }
}
