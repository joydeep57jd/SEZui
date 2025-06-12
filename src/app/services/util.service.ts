import { Injectable } from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getNgbDateObject(date: Date | string): NgbDateStruct {
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return { year, month, day };
  }

  getDateObject(data: { year: number, month: number, day: number } | null) {
    if(!data) return null;
    const { year, month, day } = data;
    return new Date(year, month, day).toISOString()
  }
}
