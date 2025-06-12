import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {OBL_ENTRY_DATA} from "./obl-entry-data";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";

@Component({
  selector: 'app-obl-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, NgbDatepickerModule, AutoCompleteComponent],
  templateUrl: './obl-entry.component.html',
  styleUrls: ['./obl-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OblEntryComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.IMPORT.OBL_ENTRY
  readonly apiUrls = API.IMPORT.OBL_ENTRY;
  readonly containerCBTs = OBL_ENTRY_DATA.containerCBTs;
  readonly containerCBTSizes = OBL_ENTRY_DATA.containerCBTSizes;
  readonly movementTypes = OBL_ENTRY_DATA.movementTypes;

  form!: FormGroup;
  sacList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);
  portList = signal<any[]>([]);
  countryList = signal<any[]>([]);
  commodityList = signal<any[]>([]);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPortList();
    this.getCountryList();
    this.getCommodityList();
    this.setEditCallback();
    this.makeForm();
  }

  getPortList() {
    this.apiService.get(API.MASTER.PORT.LIST).subscribe({
      next: (response: any) => {
        this.portList.set(response.data)
      }
    })
  }

  getCountryList() {
    this.apiService.get(API.MASTER.COUNTRY).subscribe({
      next: (response: any) => {
        this.countryList.set(response.data)
      }
    })
  }

  getCommodityList() {
    this.apiService.get(API.MASTER.COMMODITY.LIST).subscribe({
      next: (response: any) => {
        this.commodityList.set(response.data)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      id: new FormControl(0, []),
      containerCBTType: new FormControl("", []),
      containerCBTNo: new FormControl("", []),
      containerCBTSize: new FormControl("", []),
      igmNo: new FormControl("", []),
      igmDate: new FormControl(null, []),
      tpNo: new FormControl("", []),
      tpDate: new FormControl(null, []),
      movementType: new FormControl("", []),
      port: new FormControl(null, []),
      country: new FormControl("", []),
      shippingLine: new FormControl("", []),
      requestOblEntryAddDtls: new FormArray([])
    })
  }

  addRequestOblEntryAddDtls() {
    const control = this.getRequestOblEntryAddDtlsFormGroup();
    control.push(new FormGroup({
      id: new FormControl(0, []),
      addId: new FormControl(0, []),
      icesContId: new FormControl(0, []),
      obL_HBL_No: new FormControl("", []),
      obL_HBL_Date: new FormControl(null, []),
      smtP_No: new FormControl("", []),
      smtP_Date: new FormControl(null, []),
      cargo_Desc: new FormControl("", []),
      commodity: new FormControl("", []),
      cargo_Type: new FormControl(0, []),
      no_of_PKG: new FormControl(0, []),
      pkG_Type: new FormControl("", []),
      gR_WT_Kg: new FormControl(0, []),
      importer_Name: new FormControl("", []),
      igM_Importer_Name: new FormControl("", []),
      isProcessed: new FormControl(false, []),
      oblEntryId: new FormControl(0, []),
    }))
  }

  removeRequestOblEntryAddDtls(index: number) {
    const control = this.getRequestOblEntryAddDtlsFormGroup();
    control.removeAt(index);
  }

  resetRequestOblEntryAddDtls(){
    const control = this.getRequestOblEntryAddDtlsFormGroup();
    control.clear();
  }

  getRequestOblEntryAddDtlsFormGroup() {
    return this.form.get('requestOblEntryAddDtls') as FormArray;
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
          this.toasterService.showSuccess("Obl entry saved successfully");
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
    return {...this.form.value, branchId: 0, operationCode: "", pkgCount: ""};
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
