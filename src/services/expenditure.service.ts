import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Expenditure } from '../infra/entities/expenditure.entity';

@Injectable()
export class ExpenditureService {
  constructor(
    @InjectRepository(Expenditure)
    private readonly expenditureRepository: Repository<Expenditure>,
    private connection: Connection,
  ) {}

  async createExpenditure(expenditure: Expenditure) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Expenditure, expenditure);
      await queryRunner.commitTransaction();

      return expenditure;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async editExpenditure(expenditure: Expenditure, id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const expenditureToUpdate: Expenditure = await queryRunner.manager.findOne(
        Expenditure,
        id,
      );

      expenditureToUpdate.description = expenditure.description;
      expenditureToUpdate.dueDate = expenditure.dueDate;
      expenditureToUpdate.expenditureType = expenditure.expenditureType;
      expenditureToUpdate.paymentDay = expenditure.paymentDay;
      expenditureToUpdate.referenceDate = expenditure.referenceDate;
      expenditureToUpdate.value = expenditure.value;

      await queryRunner.manager.save(Expenditure, expenditureToUpdate);
      await queryRunner.commitTransaction();

      return expenditureToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error.response.data;
    } finally {
      await queryRunner.release();
    }
  }

  async listExpenditure() {
    try {
      const expenditures = this.expenditureRepository.find();

      return expenditures;
    } catch (error) {
      return error;
    }
  }

  async listExpenditureById(id: string) {
    try {
      const expenditure = this.expenditureRepository.findOne(id);

      return expenditure;
    } catch (error) {
      return error;
    }
  }

  async deleteExpenditure(id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const expenditureToRemove = await queryRunner.manager.findOne(
        Expenditure,
        id,
      );

      await queryRunner.manager.remove(Expenditure, expenditureToRemove);
      await queryRunner.commitTransaction();

      return {};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
