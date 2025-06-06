import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { operationTypes, containerTypes, types, sizes, commodityTypes, containerLoadTypes, transportForms, eximTypes } from './ht-charges-data';
import { DataTableComponent } from 'src/app/components';
import { DATA_TABLE_HEADERS } from 'src/app/lib';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ht-charges',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, DataTableComponent],
  templateUrl: './ht-charges.component.html',
  styleUrls: ['./ht-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtChargesComponent {
  readonly operationTypes = operationTypes
  readonly containerTypes = containerTypes
  readonly types = types
  readonly sizes = sizes
  readonly commodityTypes = commodityTypes
  readonly containerLoadTypes = containerLoadTypes
  readonly transportForms = transportForms
  readonly eximTypes = eximTypes
  readonly headers = DATA_TABLE_HEADERS.MASTER.HT_CHARGES

  form!: FormGroup;

  constructor() {
    this.makeForm()
  }

  makeForm() {
    this.form = new FormGroup({
      effectiveDate: new FormControl("", []),
      operationType: new FormControl("", []),
      operationCode: new FormControl("", []),
      containerType: new FormControl("", []),
      type: new FormControl("", []),
      size: new FormControl("", []),
      maxDistance: new FormControl("", []),
      commodityType: new FormControl("", []),
      containerLoadType: new FormControl("", []),
      transportForm: new FormControl("", []),
      eximType: new FormControl("", []),
      cwcRate: new FormControl("", []),
      contractorRate: new FormControl("", []),
    })
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = this.makePayload();
      console.log(data);
    }
  }

  makePayload() {
    const value = this.form.value;
    return { ...value };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }
}
