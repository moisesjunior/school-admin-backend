import { Injectable } from '@nestjs/common';
import { FindCustomer } from '../types/customer';
import { CustomerModel } from '../infra/model/customer.model';
import { AsaasCustomerService } from '../utils/asaasCustomer.service';
import { CustomerRepository } from '../infra/repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private asaasCustomerService: AsaasCustomerService,
  ) {}

  async createCustomer(customer: CustomerModel): Promise<CustomerModel> {
    const rg = customer.rg || null;

    const customerCpf = await this.customerRepository.list({
      cpf: customer.cpf,
    });

    const customerRg = await this.customerRepository.list({
      rg,
    });

    if (customerCpf.length > 0 || (rg !== null && customerRg.length > 0)) {
      throw Error('Já existe um usuário cadastrado com esse CPF e RG!');
    }

    const asaasCustomer = await this.asaasCustomerService.create(customer);
    customer.id = asaasCustomer.id;

    const newCustomer = await this.customerRepository.create(customer);

    return newCustomer;
  }

  async updateCustomer(customer: CustomerModel, id: string) {
    const rg = customer.rg || '';

    const customerCpf = await this.customerRepository.list({
      cpf: customer.cpf,
      id,
    });

    const customerRg = await this.customerRepository.list({
      rg: customer.rg,
      id,
    });

    if (customerCpf.length !== 0 || (rg !== '' && customerRg.length > 0)) {
      throw Error('Já existe um cliente cadastrado com esse CPF e RG!');
    }

    const customerToUpdate: CustomerModel = await this.customerRepository.listById(
      id,
    );

    const asaasCustomerToUpdate = await this.asaasCustomerService.getById(id);

    if (customerToUpdate === undefined || asaasCustomerToUpdate === undefined) {
      throw Error('Não foi possível encontrar o cliente especificado.');
    }

    await this.asaasCustomerService.update(customer, id);
    await this.customerRepository.update(customer, id);

    const customerUpdated: CustomerModel = await this.customerRepository.listById(
      id,
    );

    return customerUpdated;
  }

  async deleteCustomerById(id: string) {
    const customerToRemove = await this.customerRepository.listById(id);

    const asaasCustomerToRemove = await this.asaasCustomerService.getById(id);

    if (customerToRemove === undefined || asaasCustomerToRemove === undefined) {
      throw Error('Não foi possível encontrar o cliente selecionado!');
    }

    await this.asaasCustomerService.delete(id);
    await this.customerRepository.delete(id);

    return {};
  }

  async listCustomers({ course, name, cpf, status, id, rg }: FindCustomer) {
    const customers = await this.customerRepository.list({
      course,
      name,
      cpf,
      status,
      id,
      rg,
    });

    return customers;
  }

  async listCustomerById(id: string) {
    const customer = await this.customerRepository.listById(id);

    return customer;
  }
}
