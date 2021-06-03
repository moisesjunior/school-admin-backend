import { Injectable } from '@nestjs/common';
import { FindExpenditures } from '../types/expenditure';
import { ExpenditureModel } from '../infra/model/expenditure.model';
import { ExpenditureRepository } from '../infra/repositories/expenditure.repository';

@Injectable()
export class ExpenditureService {
  constructor(private readonly expenditureRepository: ExpenditureRepository) {}

  async createExpenditure(expenditure: ExpenditureModel) {
    const newExpenditure = await this.expenditureRepository.create(expenditure);

    return newExpenditure;
  }

  async editExpenditure(expenditure: ExpenditureModel, id: string) {
    const expenditureToUpdate = await this.expenditureRepository.listById(id);

    if (expenditureToUpdate === undefined) {
      throw Error('Não foi possível encontrar a despesa especificada!');
    }

    await this.expenditureRepository.update(expenditure, id);
    const expenditureUpdated = await this.expenditureRepository.listById(id);

    return expenditureUpdated;
  }

  async listExpenditure({ referenceDate }: FindExpenditures) {
    const expenditures = this.expenditureRepository.list({ referenceDate });

    return expenditures;
  }

  async listExpenditureById(id: string) {
    const expenditure = this.expenditureRepository.listById(id);

    return expenditure;
  }

  async deleteExpenditure(id: string) {
    const expenditureToRemove = await this.expenditureRepository.listById(id);

    if (expenditureToRemove === undefined) {
      throw Error('Não foi possível encontrar a despesa especificada!');
    }

    await this.expenditureRepository.delete(id);

    return {};
  }
}
