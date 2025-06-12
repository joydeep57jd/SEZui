import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
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
  utilService = inject(UtilService);
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

  constructor(private cdr: ChangeDetectorRef) {
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

  getAdditionalInfo(oblEntryId: number) {
    this.apiService.get(API.IMPORT.OBL_ENTRY.ADDITIONAL_INFO, {oblEntryId}).subscribe({
      next: (response: any) => {
        response.data.forEach((item: any) => {
          this.addRequestOblEntryAddDtls(item)
        })
        this.cdr.detectChanges();
        if (this.isViewMode()) {
          this.form.disable();
        } else {
          this.form.enable();
        }
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

  addRequestOblEntryAddDtls(detail?: any) {
    this.getRequestOblEntryAddDtlsFormGroup().push(this.createOblEntryAddDtlGroup(detail));
  }

  createOblEntryAddDtlGroup(detail?: any) {
    return new FormGroup({
      id: new FormControl(detail?.id ?? 0, []),
      addId: new FormControl(detail?.addId ?? 0, []),
      icesContId: new FormControl(detail?.icesContId ?? 0, []),
      obL_HBL_No: new FormControl(detail?.obL_HBL_No ?? "", []),
      obL_HBL_Date: new FormControl(detail?.obL_HBL_Date ? this.utilService.getNgbDateObject(detail?.obL_HBL_Date) : null, []),
      smtP_No: new FormControl(detail?.smtP_No ?? "", []),
      smtP_Date: new FormControl(detail?.smtP_Date ? this.utilService.getNgbDateObject(detail?.smtP_Date) : null, []),
      cargo_Desc: new FormControl(detail?.cargo_Desc ?? "", []),
      commodity: new FormControl(detail?.commodity ?? "", []),
      cargo_Type: new FormControl(detail?.cargo_Type ?? "", []),
      no_of_PKG: new FormControl(detail?.no_of_PKG ?? 0, []),
      pkG_Type: new FormControl(detail?.pkG_Type ?? "", []),
      gR_WT_Kg: new FormControl(detail?.gR_WT_Kg ?? 0, []),
      importer_Name: new FormControl(detail?.importer_Name ?? "", []),
      igM_Importer_Name: new FormControl(detail?.igM_Importer_Name ?? "", []),
      isProcessed: new FormControl(detail?.isProcessed ?? false, []),
      oblEntryId: new FormControl(detail?.oblEntryId ?? 0, []),
    })
  }

  removeRequestOblEntryAddDtls(index: number) {
    if(!this.isViewMode()) {
      const control = this.getRequestOblEntryAddDtlsFormGroup();
      control.removeAt(index);
    }
  }

  resetRequestOblEntryAddDtls(){
    this.getRequestOblEntryAddDtlsFormGroup().clear();
  }

  getRequestOblEntryAddDtlsFormGroup() {
    return this.form.get('requestOblEntryAddDtls') as FormArray;
  }

  getRequestOblEntryAddDtlsFormGroupAsArray() {
    let arr: number[] = [];
    this.getRequestOblEntryAddDtlsFormGroup().controls.forEach((control: any, index: number) => {
      arr.push(index);
    })
    return arr;
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.igmDate = record.igmDate ? this.utilService.getNgbDateObject(record.igmDate) : null;
    record.tpDate = record.tpDate ? this.utilService.getNgbDateObject(record.tpDate) : null;
    this.resetRequestOblEntryAddDtls();
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode = signal(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getAdditionalInfo(record.id);
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
    const value = {...this.form.value};
    value.igmDate = this.utilService.getDateObject(value.igmDate)
    value.tpDate = this.utilService.getDateObject(value.tpDate)
    value.requestOblEntryAddDtls = value.requestOblEntryAddDtls.map((item: any) => ({
      ...item,
      obL_HBL_Date: this.utilService.getDateObject(item.obL_HBL_Date),
      smtP_Date: this.utilService.getDateObject(item.smtP_Date),
    }));

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
