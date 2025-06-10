import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GATE_IN_DATA } from './gate-in-data';
import {DataTableComponent, DATA_TABLE_HEADERS, ApiService, ToastService, API} from 'src/app';
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";

@Component({
  selector: 'app-gate-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, AutoCompleteComponent],
  templateUrl: './gate-in.component.html',
  styleUrls: ['./gate-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateInComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly operationsNames = GATE_IN_DATA.operationsNames
  readonly operationTypes = GATE_IN_DATA.operationTypes;
  readonly deliveryTypes = GATE_IN_DATA.deliveryTypes;
  readonly containerTypes = GATE_IN_DATA.containerTypes;
  readonly sizes = GATE_IN_DATA.sizes;
  readonly materialTypes = GATE_IN_DATA.materialTypes;
  readonly headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_IN
  readonly apiUrls = API.GATE_OPERATION.GATE_IN;

  form!: FormGroup;
  partyList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPartyList();
    this.setEditCallback();
    this.makeForm();
  }

  getPartyList() {
    this.apiService.get(API.MASTER.PARTY.LIST).subscribe({
      next: (response: any) => {
        this.partyList.set(response.data)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      entryId: new FormControl(0, []),
      operationName: new FormControl(this.operationsNames[0].value, []),
      referenceNo: new FormControl("", []),
      operationType: new FormControl("", []),
      deliveryType: new FormControl("", []),
      partyId: new FormControl("", []),
      shippingLine: new FormControl("", []),
      containerType: new FormControl(this.containerTypes[0].value, []),
      containerNo: new FormControl("", []),
      size: new FormControl("", []),
      materialType: new FormControl("", []),
      vehicleNo: new FormControl("", []),
      driverName: new FormControl("", []),
      driverLicenseNo: new FormControl("", []),
      remarks: new FormControl("", []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode = signal(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode() {
    this.form.enable();
    this.isViewMode = signal(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next: () => {
          this.toasterService.showSuccess("GST against SAC saved successfully");
          this.table.reload();
          this.makeForm();
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    return {...this.form.value};
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setEditCallback() {
    this.headers.forEach(header => {
      if (header.field === "edit") {
        header.callback = this.edit.bind(this);
      }
      if (header.field === "view") {
        header.callback = this.view.bind(this);
      }
    });
  }
}
