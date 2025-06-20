import {Injectable} from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getNgbDateObject(date: Date | string, isTimeRequired: boolean = false): (NgbDateStruct & {hour: number, minute: number}) | null {
    if(!date) return null
    if( !(date as string).endsWith("Z")) {
       date = date + "Z";
    }
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return { year, month, day, hour, minute };
  }

  getDateObject(data: { year: number, month: number, day: number } | null, hour: number = 0, minute: number = 0) {
    if(!data) return null;
    const { year, month, day } = data;
    return new Date(year, month - 1, day, hour, minute).toISOString()
  }

  generateUniqueCode(noOfDigits: number = 3, noOfString: number = 3): string {
    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < noOfDigits; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }

    for (let i = 0; i < noOfString; i++) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
  }

  formatCurrency(
    value: number,
    locale: string = 'en-IN',
    currency: string = 'INR'
  ): string {
    if(isNaN(value) || value === null) return '';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
