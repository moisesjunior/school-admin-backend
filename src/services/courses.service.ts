import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../infra/entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async createCourse(course: Course): Promise<Course> {
    try {
      const newCourse = await this.courseRepository.save(course);

      return newCourse;
    } catch (error) {
      return error.description;
    }
  }

  async updateCourse(course: Course, id: string): Promise<Course> {
    try {
      const courseToUpdate = await this.courseRepository.findOne(id);

      courseToUpdate.description = course.description;
      courseToUpdate.startAt = course.startAt;
      courseToUpdate.endAt = course.endAt;
      courseToUpdate.monthlyPayment = course.monthlyPayment;

      await this.courseRepository.save(courseToUpdate);

      return courseToUpdate;
    } catch (error) {
      return error.description;
    }
  }

  async deleteCourseById(id: string) {
    try {
      const courseToRemove = await this.courseRepository.findOne(id);

      await this.courseRepository.remove(courseToRemove);

      return {};
    } catch (error) {
      return error;
    }
  }

  async listCourses() {
    try {
      const courses = await this.courseRepository.find();

      return courses;
    } catch (error) {
      return error;
    }
  }

  async listCourseById(id: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: {
          id: id,
        },
      });

      return course;
    } catch (error) {
      return error;
    }
  }
}
