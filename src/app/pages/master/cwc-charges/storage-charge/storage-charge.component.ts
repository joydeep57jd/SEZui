import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../../lib";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../../components";
import {STORAGE_CHARGE_DATA} from "./storage-charge-data";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-storage-charge',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, FormsModule, NgbInputDatepicker, ReactiveFormsModule],
  templateUrl: './storage-charge.component.html',
  styleUrls: ['./storage-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageChargeComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.CWC_CHARGES.STORAGE_CHARGE
  readonly apiUrls = API.MASTER.CWC_CHARGES.STORAGE_CHARGE;
  readonly arcaTypes = STORAGE_CHARGE_DATA.arcaTypes;
  readonly storageFors = STORAGE_CHARGE_DATA.storageFors;
  readonly basisList = STORAGE_CHARGE_DATA.basisList;

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
      storageChargeID: new FormControl(0, []),
      effectiveDate: new FormControl(null, []),
      sacCodeId: new FormControl(null, []),
      storageForId: new FormControl("", []),
      areaTypeId: new FormControl("", []),
      basisId: new FormControl("", []),
      ratePerSqmWeek: new FormControl("", []),
      ratePerSqmMonth: new FormControl(null, []),
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
          this.toasterService.showSuccess("Storage charge saved successfully");
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
    const {storageForId, areaTypeId, basisId} = this.form.value;
    const storageForName = this.storageFors.find(storageFor => storageFor.value == storageForId)?.label ?? '';
    const basisName = this.basisList.find(basis => basis.value == basisId)?.label ?? '';
    const areaTypeName = this.arcaTypes.find(arcaType => arcaType.value == areaTypeId)?.label ?? '';

    return {...this.form.value, effectiveDate: this.utilService.getDateObject(this.form.value.effectiveDate), storageForName, basisName, areaTypeName};
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
