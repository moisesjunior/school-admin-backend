import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { FindCustomer } from '../../types/customer';
import { CustomerModel } from '../model/customer.model';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustomerModel)
    private readonly CustomerRepo: Repository<CustomerModel>,
  ) {}

  async create(customer: CustomerModel) {
    try {
      const newCustomer = this.CustomerRepo.create(customer);
      await this.CustomerRepo.save(newCustomer);

      return newCustomer;
    } catch (error) {
      throw Error('Ocorreu um erro ao salvar o cliente!');
    }
  }

  async update(customer: CustomerModel, id: string) {
    try {
      const updated = await this.CustomerRepo.update(id, customer);

      return updated.affected;
    } catch (error) {
      throw Error('Ocorreu um erro ao editar o cliente!');
    }
  }

  async list({ course, name, cpf, status, id, rg }: FindCustomer) {
    try {
      const customers = await this.CustomerRepo.find({
        where: {
          ...(course !== undefined ? { course } : {}),
          ...(name !== undefined ? { name: ILike(name) } : {}),
          ...(status !== undefined ? { status } : {}),
          ...(cpf !== undefined ? { cpf } : {}),
          ...(rg !== undefined ? { rg } : {}),
          ...(id !== undefined ? { id: Not(id) } : {}),
        },
      });

      return customers;
    } catch (error) {
      throw Error('Ocorreu um erro ao listar os clientes!');
    }
  }

  async listById(id: string) {
    try {
      const customer = await this.CustomerRepo.findOne({
        where: {
          id: id,
        },
      });

      return customer;
    } catch (error) {
      throw Error('Ocorreu um erro ao listar o cliente selecionado!');
    }
  }

  async delete(id: string) {
    try {
      await this.CustomerRepo.delete(id);

      return {};
    } catch (error) {
      throw Error('Ocorreu um erro ao excluir o cliente!');
    }
  }
}
