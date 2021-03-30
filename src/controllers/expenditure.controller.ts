import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ExpenditureService } from '../services/expenditure.service';

@Controller('/expenditure')
export class CourseController {
  constructor(private readonly expenditureService: ExpenditureService) {}

  @Post()
  async createCourse(): Promise<string> {
    return 'Teste';
  }

  @Put(':id')
  async updateCourse(
    @Param('id')
    id: string,
  ): Promise<string> {
    return id;
  }

  @Get()
  async listCourses(): Promise<string> {
    return '';
  }

  @Get(':id')
  async listCourse(
    @Param('id')
    id: string,
  ): Promise<string> {
    return id;
  }

  @Delete()
  async deleteCourse(): Promise<void> {
    return;
  }
}
