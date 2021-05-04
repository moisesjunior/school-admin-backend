import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Course } from '../infra/entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private connection: Connection,
  ) {}

  async createCourse(course: Course): Promise<Course> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newCourse = await queryRunner.manager.save(Course, course);

      await queryRunner.commitTransaction();

      return newCourse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao salvar o curso!');
    } finally {
      await queryRunner.release();
    }
  }

  async updateCourse(course: Course, id: string): Promise<Course> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const courseToUpdate: Course = await queryRunner.manager.findOne(
        Course,
        id,
      );

      courseToUpdate.description = course.description;
      courseToUpdate.startAt = course.startAt;
      courseToUpdate.endAt = course.endAt;
      courseToUpdate.monthlyPayment = course.monthlyPayment;

      await queryRunner.manager.save(Course, courseToUpdate);
      await queryRunner.commitTransaction();

      return courseToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao editar o curso!');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCourseById(id: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const courseToRemove = await queryRunner.manager.findOne(Course, id);

      await queryRunner.manager.remove(Course, courseToRemove);
      await queryRunner.commitTransaction();

      return {};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error('Ocorreu um erro ao excluir o curso!');
    } finally {
      await queryRunner.release();
    }
  }

  async listCourses() {
    try {
      const courses = await this.courseRepository.find();

      return courses;
    } catch (error) {
      throw Error('Ocorreu um erro ao listar os cursos!');
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
      throw Error('Ocorreu um erro ao listar o curso selecionado!');
    }
  }
}
