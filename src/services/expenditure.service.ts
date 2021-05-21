import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { FindExpenditures } from '../api-dto/expenditure.dto';
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
      throw Error('Não foi possível salvar a despesa!');
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

      if (expenditureToUpdate === undefined) {
        throw Error('Não foi possível encontrar a despesa especificada!');
      }

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
      throw Error('Não foi possível editar a despesa especificada!');
    } finally {
      await queryRunner.release();
    }
  }

  async listExpenditure({ referenceDate }: FindExpenditures) {
    try {
      const expenditures = this.expenditureRepository.find({
        where: {
          ...(referenceDate !== undefined ? { referenceDate } : {}),
        },
      });

      return expenditures;
    } catch (error) {
      throw Error('Não foi possível listar as despesas!');
    }
  }

  async listExpenditureById(id: string) {
    try {
      const expenditure = this.expenditureRepository.findOne(id);

      return expenditure;
    } catch (error) {
      throw Error('Não foi possível encontrar as despesas especificadas!');
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

      if (expenditureToRemove === undefined) {
        throw Error('Não foi possível encontrar a despesa especificada!');
      }

      await queryRunner.manager.remove(Expenditure, expenditureToRemove);
      await queryRunner.commitTransaction();

      return {};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Não foi possível excluir a despesa especificada!');
    } finally {
      await queryRunner.release();
    }
  }
}
