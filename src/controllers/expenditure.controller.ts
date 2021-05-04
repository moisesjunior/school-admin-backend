import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Expenditure } from '../infra/entities/expenditure.entity';
import { ExpenditureService } from '../services/expenditure.service';

@Controller('/expenditure')
export class ExpenditureController {
  constructor(private readonly expenditureService: ExpenditureService) {}

  @Post()
  async createExpenditure(
    @Res()
    response: Response,
    @Body()
    expenditure: Expenditure,
  ) {
    try {
      const newExpenditure = await this.expenditureService.createExpenditure(
        expenditure,
      );

      return response.status(HttpStatus.CREATED).send(newExpenditure);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Put(':id')
  async updateExpenditure(
    @Res()
    response: Response,
    @Param('id')
    id: string,
    @Body()
    expenditure: Expenditure,
  ) {
    try {
      const updatedExpenditure = await this.expenditureService.editExpenditure(
        expenditure,
        id,
      );

      return response.status(HttpStatus.OK).send(updatedExpenditure);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Get()
  async listExpenditures(
    @Res()
    response: Response,
  ) {
    try {
      const expenditures = await this.expenditureService.listExpenditure();

      return response.status(HttpStatus.OK).send(expenditures);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Get(':id')
  async listExpenditure(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const expenditure = await this.expenditureService.listExpenditureById(id);

      return response.status(HttpStatus.OK).send(expenditure);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }

  @Delete('/:id')
  async deleteExpenditure(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const expenditure = await this.expenditureService.deleteExpenditure(id);

      return response.status(HttpStatus.OK).send(expenditure);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        title: 'Atenção!',
        message: error.message,
      });
    }
  }
}
