import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, UtilService} from "../../../services";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {API} from "../../../lib";

@Component({
  selector: 'app-daily-cash-book',
  standalone: true,
  imports: [CommonModule, NgbInputDatepicker, ReactiveFormsModule],
  templateUrl: './daily-cash-book.component.html',
  styleUrls: ['./daily-cash-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCashBookComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService)

  readonly apiUrls = API.CASH_MANAGEMENT.DAILY_CASH_BOOK

  form!: FormGroup;
  isPrinting = signal(false);

  constructor() {
    this.makeForm()
  }

  makeForm() {
    this.form = new FormGroup({
      fromDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
      toDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = this.form.value;
      const params = {
        fromDate: this.utilService.getDateObject(value.fromDate),
        toDate: this.utilService.getDateObject(value.toDate),
      }
      this.isPrinting.set(true);
      this.apiService.get(this.apiUrls.REPORT, params).subscribe({
        next: (response: any) => {
          this.isPrinting.set(false);
          // window.open(response.data, '_blank');
          console.log(response)
        }, error: () => {
          this.isPrinting.set(false);
        }
      })
    }
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }
}
