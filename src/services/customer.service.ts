import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../infra/entities/customer.entity';
import axios from 'axios';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(customer: Customer): Promise<Customer> {
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
      const asaasCustomer = await axios.post(
        `${process.env.ASAAS_URL}/api/v3/customers`,
        newAsaasCustomer,
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        },
      );
      customer.id = asaasCustomer.data.id;

      return await this.customerRepository.save(customer);
    } catch (error) {
      return error.description;
    }
  }

  async updateCustomer(customer: Customer, id: string) {
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
      await axios.post(
        `${process.env.ASAAS_URL}/api/v3/customers/${id}`,
        updateCustomer,
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: process.env.ASAAS_API_KEY,
          },
        },
      );

      const customerToUpdate = await this.customerRepository.findOne(id);

      customerToUpdate.name = customer.name;
      customerToUpdate.email = customer.email;
      customerToUpdate.phoneNumber = customer.phoneNumber;
      customerToUpdate.mobilePhone = customer.mobilePhone;
      customerToUpdate.birthdate = customer.birthdate;
      customerToUpdate.nationality = customer.nationality;
      customerToUpdate.maritalStatus = customer.maritalStatus;
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
      customerToUpdate.course = customer.course;

      await this.customerRepository.save(customerToUpdate);

      return customerToUpdate;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  }

  async deleteCustomerById(id: string) {
    try {
      const customerToRemove = await this.customerRepository.findOne(id);

      await axios.delete(`${process.env.ASAAS_URL}/api/v3/customers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: process.env.ASAAS_API_KEY,
        },
      });
      await this.customerRepository.remove(customerToRemove);

      return {};
    } catch (error) {
      return error;
    }
  }

  async listCustomers() {
    try {
      const customers = await this.customerRepository.find();

      return customers;
    } catch (error) {
      return error;
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
      return error;
    }
  }
}
