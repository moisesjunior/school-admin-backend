import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Course } from '../infra/entities/course.entity';
import { CourseService } from '../services/courses.service';

@Controller('/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async createCourse(
    @Res()
    response: Response,
    @Body()
    course: Course,
  ) {
    try {
      const newCourse = await this.courseService.createCourse(course);

      return response.status(HttpStatus.CREATED).send(newCourse);
    } catch (error) {
      return response.send(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Put(':id')
  async updateCourse(
    @Param('id')
    id: string,
    @Res()
    response: Response,
    @Body()
    course: Course,
  ) {
    try {
      const updatedCourse = await this.courseService.updateCourse(course, id);

      return response.status(HttpStatus.OK).send(updatedCourse);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get()
  async listCourses(
    @Res()
    response: Response,
  ) {
    try {
      const courses = await this.courseService.listCourses();

      return response.status(HttpStatus.OK).json(courses);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get(':id')
  async listCourse(
    @Param('id')
    id: string,
    @Res()
    response: Response,
  ) {
    try {
      const course = await this.courseService.listCourseById(id);

      return response.status(HttpStatus.OK).json(course);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Delete(':id')
  async deleteCourse(
    @Res()
    response: Response,
    @Param('id')
    id: string,
  ) {
    try {
      const course = await this.courseService.deleteCourseById(id);

      return response.status(HttpStatus.OK).json(course);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
