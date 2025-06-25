import {Injectable} from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getNgbDateObject(date: Date | string, isTimeRequired: boolean = false): (NgbDateStruct & {hour: number, minute: number}) | null {
    if(!date) return null
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
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00.000`
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


  numberToWords(num: number): string {
    if (num === 0) return 'Zero';

    const belowTwenty = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety',
    ];

    const thousands = [
      '', 'Thousand', 'Million', 'Billion',
    ];

    function helper(n: number): string {
      if (n === 0) return '';
      if (n < 20) return belowTwenty[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
      return belowTwenty[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
    }

    let result = '';
    let i = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        result = helper(num % 1000) + thousands[i] + ' ' + result;
      }
      num = Math.floor(num / 1000);
      i++;
    }

    return result.trim();
  }

  convertAmountToWords(amount: number): string {
    const [rupees, paise] = amount.toFixed(2).split('.').map(Number);

    let words = '';
    if (rupees > 0) {
      words += this.numberToWords(rupees) + ' Rupees';
    }

    if (paise > 0) {
      words += (words ? ' and ' : '') + this.numberToWords(paise) + ' Paise';
    }

    return words ? words + ' Only' : 'Zero Rupees Only';
  }
}
