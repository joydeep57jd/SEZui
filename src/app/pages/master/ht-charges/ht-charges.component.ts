import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { operationTypes, containerTypes, types, sizes, commodityTypes, containerLoadTypes, transportFroms, eximTypes } from './ht-charges-data';
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
  readonly operationTypes = operationTypes
  readonly containerTypes = containerTypes
  readonly types = types
  readonly sizes = sizes
  readonly commodityTypes = commodityTypes
  readonly containerLoadTypes = containerLoadTypes
  readonly transportFromList = transportFroms
  readonly eximTypes = eximTypes
  readonly headers = DATA_TABLE_HEADERS.MASTER.HT_CHARGES
  readonly apiUrls = API.MASTER.HT_CHARGES;

  apiService = inject(ApiService);
  toasterService = inject(ToastService);
  utilService = inject(UtilService);

  form!: FormGroup;
  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setEditCallback();
    this.makeForm();
  }

  makeForm(details?: any) {
    const effectiveDate = details?.effectiveDate ? this.utilService.getNgbDateObject(details.effectiveDate) : null;
    this.form = new FormGroup({
      HTChargesID: new FormControl(details?.htChargesID ?? 0, []),
      EffectiveDate: new FormControl(details?.effectiveDate ? effectiveDate : null, []),
      OperationId: new FormControl(details?.operationId ?? "", []),
      operationCode: new FormControl(details?.operationCode ?? "", []),
      ContainerType: new FormControl(details?.containerType ?? "", []),
      Type: new FormControl(details?.type ?? "", []),
      Size: new FormControl(details?.size ?? "", []),
      MaxDistance: new FormControl(details?.maxDistance ?? "", []),
      CommodityType: new FormControl(details?.commodityType ?? "", []),
      ContainerLoadType: new FormControl(details?.containerLoadType ?? "", []),
      TransportFrom: new FormControl(details?.transportFrom ?? "", []),
      EximType: new FormControl(details?.eximType ?? "", []),
      RateCWC: new FormControl(details?.rateCWC ?? "", []),
      ContractorRate: new FormControl(details?.contractorRate ?? "", []),
    })
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.CREATE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("H&T Charges saved successfully");
          this.table.reload();
          this.makeForm();
        }, error: () => {
          this.toasterService.showError("Error while saving H&T Charges");
        }
      })
    }
  }

  edit(record: any) {
    this.makeForm(record);
  }

  view(record: any) {
    this.makeForm(record);
    this.form.disable();
  }

  reset() {
    this.makeForm();
    this.form.enable();
  }

  makePayload() {
    const value = {...this.form.value};
    value.EffectiveDate = value.EffectiveDate ? this.utilService.getDateObject(value.EffectiveDate) : new Date();
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
