import { Injectable } from '@nestjs/common';

@Injectable()
export class dateUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getDueDate(startAt: Date, endAt: Date) {
    if (new Date() > startAt && new Date() < endAt) {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const dueDate = new Date(year, month, 5);
      const dayOfWeek = dueDate.getDay();

      switch (dayOfWeek) {
        case 0:
          return new Date(year, month, 5 + 1);
        case 6:
          return new Date(year, month, 5 + 2);
      }
    } else if (new Date() < startAt && new Date() < endAt) {
      const month = startAt.getMonth();
      const year = startAt.getFullYear();

      return new Date(year, month, 5);
    }
  }

  async verifyHoliday() {
    const holidays = {};
  }
}
