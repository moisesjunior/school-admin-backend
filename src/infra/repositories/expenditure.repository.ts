import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindExpenditures } from '../../types/expenditure';
import { ExpenditureModel } from '../model/expenditure.model';

@Injectable()
export class ExpenditureRepository {
  constructor(
    @InjectRepository(ExpenditureModel)
    private readonly expenditureRepo: Repository<ExpenditureModel>,
  ) {}

  async create(expenditure: ExpenditureModel) {
    try {
      const newExpenditure = this.expenditureRepo.create(expenditure);
      await this.expenditureRepo.save(newExpenditure);

      return newExpenditure;
    } catch (error) {
      throw Error('Ocorreu um erro ao salvar a despesa!');
    }
  }

  async update(expenditure: ExpenditureModel, id: string) {
    try {
      const updated = await this.expenditureRepo.update(id, expenditure);

      return updated.affected;
    } catch (error) {
      throw Error('Ocorreu um erro ao editar a despesa!');
    }
  }

  async list({ referenceDate, expenditureType }: FindExpenditures) {
    try {
      const expenditures = this.expenditureRepo.find({
        where: {
          ...(referenceDate !== undefined ? { referenceDate } : {}),
          ...(expenditureType !== undefined ? { expenditureType } : {}),
        },
      });

      return expenditures;
    } catch (error) {
      throw Error('Não foi possível listar as despesas!');
    }
  }

  async listById(id: string) {
    try {
      const expenditure = this.expenditureRepo.findOne(id);

      return expenditure;
    } catch (error) {
      throw Error('Não foi possível encontrar as despesas especificadas!');
    }
  }

  async delete(id: string) {
    try {
      await this.expenditureRepo.delete(id);

      return {};
    } catch (error) {
      throw Error('Não foi possível excluir a despesa especificada!');
    }
  }
}
