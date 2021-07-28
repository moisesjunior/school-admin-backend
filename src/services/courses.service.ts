import { Injectable } from '@nestjs/common';
import { CourseModel } from '../infra/model/course.model';
import { CourseRepository } from '../infra/repositories/course.repository';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async createCourse(course: CourseModel): Promise<CourseModel> {
    try {
      const newCourse = await this.courseRepository.create(course);

      return newCourse;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async updateCourse(course: CourseModel, id: string): Promise<CourseModel> {
    try {
      const existCourse = await this.courseRepository.listById(id);

      if (!existCourse) {
        throw Error('Não foi possível encontrar o curso');
      }

      await this.courseRepository.update(course, id);
      const courseUpdated = await this.courseRepository.listById(id);
      return courseUpdated;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteCourseById(id: string): Promise<void> {
    try {
      const existCourse = await this.courseRepository.listById(id);

      if (!existCourse) {
        throw Error('Não foi possível encontrar o curso');
      }

      await this.courseRepository.delete(id);
      return;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async listCourses(): Promise<CourseModel[]> {
    try {
      const courses = await this.courseRepository.list();

      return courses;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async listCourseById(id: string): Promise<CourseModel> {
    try {
      const course = this.courseRepository.listById(id);

      return course;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
