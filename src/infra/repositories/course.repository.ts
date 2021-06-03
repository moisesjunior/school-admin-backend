import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModel } from '../model/course.model';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(CourseModel)
    private CourseRepo: Repository<CourseModel>,
  ) {}

  async create(course: CourseModel) {
    try {
      const newCourse = this.CourseRepo.create(course);
      await this.CourseRepo.save(newCourse);

      return newCourse;
    } catch (error) {
      throw Error('Ocorreu um erro ao salvar o curso!');
    }
  }

  async update(course: CourseModel, id: string) {
    try {
      const updated = await this.CourseRepo.update(id, course);

      return updated.affected;
    } catch (error) {
      throw Error('Ocorreu um erro ao editar o curso!');
    }
  }

  async list() {
    try {
      const courses = await this.CourseRepo.find();

      return courses;
    } catch (error) {
      throw Error('Ocorreu um erro ao listar os cursos!');
    }
  }

  async listById(id: string) {
    try {
      const course = await this.CourseRepo.findOne({
        where: {
          id: id,
        },
      });

      return course;
    } catch (error) {
      throw Error('Ocorreu um erro ao listar o curso selecionado!');
    }
  }

  async delete(id: string) {
    try {
      await this.CourseRepo.delete(id);

      return {};
    } catch (error) {
      throw Error('Ocorreu um erro ao excluir o curso!');
    }
  }
}
