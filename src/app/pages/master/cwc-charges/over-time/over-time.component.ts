import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../../lib";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../../components";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {OVER_TIME_DATA} from "./over-time-data";

@Component({
  selector: 'app-over-time',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, NgbInputDatepicker, ReactiveFormsModule],
  templateUrl: './over-time.component.html',
  styleUrls: ['./over-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverTimeComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.CWC_CHARGES.OVER_TIME
  readonly apiUrls = API.MASTER.CWC_CHARGES.OVER_TIME;
  readonly operationTypes = OVER_TIME_DATA.operationTypes;

  form!: FormGroup;
  sacList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);
  sacMap = signal(new Map<string, string>());

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getSacList()
    this.setHeaderCallbacks();
    this.makeForm();
  }

  getSacList() {
    this.apiService.get(API.MASTER.SAC.LIST).subscribe({
      next: (response: any) => {
        this.sacList.set(response.data)
        const sacMap = new Map<string, string>();
        response.data.forEach((sac: any) => {
          sacMap.set(sac.sacId, sac.sacCode);
        })
        this.sacMap.set(sacMap);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      overTimeChargeId: new FormControl(0, []),
      effectiveDate: new FormControl(null, []),
      sacCodeId: new FormControl(null, []),
      operationType: new FormControl("", []),
      holiday: new FormControl(false, []),
      time: new FormControl(null, []),
      rate: new FormControl(null, []),
      maxMinHours: new FormControl("", []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.effectiveDate = this.utilService.getNgbDateObject(record.effectiveDate);
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Over time saved successfully");
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
    return {...this.form.value, effectiveDate: this.utilService.getDateObject(this.form.value.effectiveDate)};
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "edit") {
        header.callback = this.edit.bind(this);
      }
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
      if(header.field === "sacCode") {
        header.valueGetter = this.getSacCodeBySacId.bind(this) ;
      }
    });
  }

  getSacCodeBySacId(record: any) {
    return this.sacMap().get(record.sacCodeId)!
  }
}
