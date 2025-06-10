import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HT_CHARGES_DATA } from './ht-charges-data';
import { DataTableComponent } from 'src/app/components';
import {API, DATA_TABLE_HEADERS} from 'src/app/lib';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {ApiService, ToastService, UtilService} from "../../../services";

@Component({
  selector: 'app-ht-charges',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, DataTableComponent],
  templateUrl: './ht-charges.component.html',
  styleUrls: ['./ht-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtChargesComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);
  utilService = inject(UtilService);

  readonly operationTypes = HT_CHARGES_DATA.operationTypes
  readonly containerTypes = HT_CHARGES_DATA.containerTypes
  readonly types = HT_CHARGES_DATA.types
  readonly sizes = HT_CHARGES_DATA.sizes
  readonly commodityTypes = HT_CHARGES_DATA.commodityTypes
  readonly containerLoadTypes = HT_CHARGES_DATA.containerLoadTypes
  readonly transportFromList = HT_CHARGES_DATA.transportFroms
  readonly eximTypes = HT_CHARGES_DATA.eximTypes
  readonly headers = DATA_TABLE_HEADERS.MASTER.HT_CHARGES
  readonly apiUrls = API.MASTER.HT_CHARGES;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setEditCallback();
    this.makeForm();
  }

  makeForm() {
    this.form = new FormGroup({
      htChargesID: new FormControl(0, []),
      effectiveDate: new FormControl( null, []),
      operationId: new FormControl("", []),
      operationCode: new FormControl("", []),
      containerType: new FormControl("", []),
      type: new FormControl("", []),
      size: new FormControl("", []),
      maxDistance: new FormControl("", []),
      commodityType: new FormControl("", []),
      containerLoadType: new FormControl("", []),
      transportFrom: new FormControl("", []),
      eximType: new FormControl("", []),
      rateCWC: new FormControl("", []),
      contractorRate: new FormControl("", []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.effectiveDate = record.effectiveDate ? this.utilService.getNgbDateObject(record.effectiveDate) : null;
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode = signal(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode(){
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
        next:() => {
          this.toasterService.showSuccess("H&T Charges saved successfully");
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
    const value = {...this.form.value};
    value.effectiveDate = value.effectiveDate ? this.utilService.getDateObject(value.effectiveDate) : new Date();
    return value;
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setEditCallback() {
    this.headers.forEach(header => {
      if(header.field === "edit") {
        header.callback = this.edit.bind(this);
      }
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
    });
  }
}
