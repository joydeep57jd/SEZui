import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GATE_IN_DATA } from './gate-in-data';
import { DataTableComponent, DATA_TABLE_HEADERS } from 'src/app';

@Component({
  selector: 'app-gate-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent],
  templateUrl: './gate-in.component.html',
  styleUrls: ['./gate-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateInComponent {
  readonly operationTypes = GATE_IN_DATA.operationTypes;
  readonly deliveryTypes = GATE_IN_DATA.deliveryTypes;
  readonly containerTypes = GATE_IN_DATA.containerTypes;
  readonly sizes = GATE_IN_DATA.sizes;
  readonly materialTypes = GATE_IN_DATA.materialTypes;
  readonly records = GATE_IN_DATA.records;
  readonly headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_IN

  form!: FormGroup;

  constructor() {
    this.makeForm();
  }

  makeForm() {
    this.form = new FormGroup({
      referenceNo: new FormControl("", []),
      operationType: new FormControl("", []),
      deliveryType: new FormControl("", []),
      party: new FormControl("", []),
      shippingLine: new FormControl("", []),
      remarks: new FormControl("", []),
      containerType: new FormControl(this.containerTypes[1].value, []),
      containerNo: new FormControl("", []),
      size: new FormControl("", []),
      materialType: new FormControl("", []),
      vehicleNo: new FormControl("", []),
      driverName: new FormControl("", []),
      driverLicenseNo: new FormControl("", []),
    })
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = this.makePayload()
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
