import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExpenditureModel } from '../infra/model/expenditure.model';
import { ExpenditureService } from '../services/expenditure.service';

@Controller('/expenditure')
export class ExpenditureController {
  constructor(private readonly expenditureService: ExpenditureService) {}

  @Post()
  async createExpenditure(
    @Res()
    response: Response,
    @Body()
    expenditure: ExpenditureModel,
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
    expenditure: ExpenditureModel,
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
    @Query('referenceDate')
    referenceDate: Date,
    @Query('expenditureType')
    expenditureType: string,
  ) {
    try {
      const expenditures = await this.expenditureService.listExpenditure({
        referenceDate,
        expenditureType,
      });

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
