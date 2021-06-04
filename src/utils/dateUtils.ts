import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getDueDate(dueDate: string, endAt: Date) {
    if (new Date() < endAt) {
      const newDueDate = new Date(dueDate);

      const newDate = await this.checkWorkDay(
        new Date(newDueDate.getFullYear(), newDueDate.getMonth() + 1, 10),
      );
      const stringDate = newDate.toLocaleDateString().split('/');

      return `${stringDate[2]}-${stringDate[0]}-${stringDate[1]}`;
    } else {
      throw Error(
        'Não é possível gerar uma nova mensalidade para um curso já finalizado!',
      );
    }
  }

  async checkWorkDay(date: Date) {
    let newDate: Date;
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth();

    switch (dayOfWeek) {
      case 0:
        newDate = new Date(year, month, 10 + 1);
      case 6:
        newDate = new Date(year, month, 10 + 2);
      default:
        newDate = date;
    }

    return newDate;
  }
}
