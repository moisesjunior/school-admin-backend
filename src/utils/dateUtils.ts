import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getDueDate(startAt: Date, endAt: Date) {
    if (new Date() < endAt) {
      const addMonth =
        new Date() > startAt && new Date() < endAt
          ? new Date().getDay() > 10
            ? 1
            : 0
          : startAt.getDay() > 10
          ? 1
          : 0;

      const month =
        (new Date() > startAt ? new Date().getMonth() : startAt.getMonth()) +
        addMonth;

      const year =
        new Date() > startAt ? new Date().getFullYear() : startAt.getFullYear();

      return this.checkWorkDay(new Date(year, month, 10));
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
