import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getNgbDateObject(date: Date | string) {
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return { day, month, year };
  }
}
