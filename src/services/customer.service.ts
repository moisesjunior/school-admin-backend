import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Not, Repository } from 'typeorm';
import { Customer } from '../infra/entities/customer.entity';

interface findCustomer {
  course?: string;
  cpf?: string;
  id?: string;
  rg?: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private httpService: HttpService,
    private connection: Connection,
  ) {}

  async createCustomer(customer: Customer): Promise<Customer> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

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

      customer.id = asaasCustomer.data.id;

      await queryRunner.manager.save(Customer, customer);
      await queryRunner.commitTransaction();

      return customer;
    } catch (error) {
      console.log(error.response);
      await queryRunner.rollbackTransaction();
      throw Error('Não foi possível salvar o cliente!');
    } finally {
      await queryRunner.release();
    }
  }

  async updateCustomer(customer: Customer, id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

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
      const customerToUpdate: Customer = await queryRunner.manager.findOne(
        Customer,
        id,
      );

      if (customerToUpdate === undefined) {
        throw Error('Não foi possível encontrar o cliente especificado.');
      }

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

      customerToUpdate.name = customer.name;
      customerToUpdate.cpf = customer.cpf;
      customerToUpdate.email = customer.email;
      customerToUpdate.phoneNumber = customer.phoneNumber;
      customerToUpdate.mobilePhone = customer.mobilePhone;
      customerToUpdate.birthdate = customer.birthdate;
      customerToUpdate.nationality = customer.nationality;
      customerToUpdate.maritalStatus = customer.maritalStatus;
      customerToUpdate.rg = customer.rg;
      customerToUpdate.emitter = customer.emitter;
      customerToUpdate.emissionDate = customer.emissionDate;
      customerToUpdate.address = customer.address;
      customerToUpdate.addressNumber = customer.addressNumber;
      customerToUpdate.complement = customer.complement;
      customerToUpdate.province = customer.province;
      customerToUpdate.city = customer.city;
      customerToUpdate.state = customer.state;
      customerToUpdate.postalCode = customer.postalCode;
      customerToUpdate.reservist = customer.reservist;
      customerToUpdate.fatherName = customer.fatherName;
      customerToUpdate.motherName = customer.motherName;
      customerToUpdate.highSchool = customer.highSchool;
      customerToUpdate.whichSchool = customer.whichSchool;
      customerToUpdate.whichYear = customer.whichYear;
      customerToUpdate.whichCity = customer.whichCity;
      customerToUpdate.chronicDisease = customer.chronicDisease;
      customerToUpdate.hepatitis = customer.hepatitis;
      customerToUpdate.useMedication = customer.useMedication;
      customerToUpdate.whichMedication = customer.whichMedication;
      customerToUpdate.payment = customer.payment;
      customerToUpdate.course = customer.course;

      await queryRunner.manager.save(Customer, customerToUpdate);
      await queryRunner.commitTransaction();

      return customerToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao editar o cliente especificado!');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCustomerById(id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customerToRemove = await queryRunner.manager.findOne(Customer, id);

      if (customerToRemove === undefined) {
        throw Error('Não foi possível encontrar o cliente selecionado!');
      }

      await queryRunner.manager.remove(Customer, customerToRemove);
      await queryRunner.commitTransaction();

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
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao remover o cliente!');
    } finally {
      await queryRunner.release();
    }
  }

  async listCustomers({ course, cpf, id, rg }: findCustomer) {
    try {
      const customers = await this.customerRepository.find({
        where: {
          ...(course !== undefined ? { course: course } : {}),
          ...(cpf !== undefined ? { cpf: cpf } : {}),
          ...(rg !== undefined ? { rg: rg } : {}),
          ...(id !== undefined ? { id: Not(id) } : {}),
        },
      });

      return customers;
    } catch (error) {
      throw Error('Não foi possível listar os clientes!');
    }
  }

  async listCustomerById(id: string) {
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: id,
        },
      });

      return customer;
    } catch (error) {
      throw Error('Não foi possível encontrar o cliente selecionado!');
    }
  }
}
