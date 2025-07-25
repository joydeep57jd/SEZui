import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {CCIN_ENTRY_DATA} from "./ccin-entry-data";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-ccin-entry',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, ReactiveFormsModule, NgbInputDatepicker],
  templateUrl: './ccin-entry.component.html',
  styleUrls: ['./ccin-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcinEntryComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.EXPORT.CCIN_ENTRY
  readonly apiUrls = API.EXPORT.CCIN_ENTRY;
  readonly sbTypes = CCIN_ENTRY_DATA.sbTypes;
  readonly cargoTypes = CCIN_ENTRY_DATA.cargoTypes
  readonly packageTypes = CCIN_ENTRY_DATA.packageTypes

  form!: FormGroup;
  exporterList = signal<any[]>([]);
  shippingLineList = signal<any[]>([]);
  chaList = signal<any[]>([]);
  portList = signal<any[]>([]);
  commodityList = signal<any[]>([]);
  countryList = signal<any[]>([]);
  packUqcList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setHeaderCallbacks();
    this.makeForm();
    this.getExporterList();
    this.getShippingLineList();
    this.getChaList();
    this.getPortList();
    this.getCommodityList();
    this.getCountryList();
    this.getPackUqcList()
  }

  getPackUqcList() {
    this.apiService.get(API.MASTER.PACK_UQC).subscribe({
      next: (response: any) => {
        this.packUqcList.set(response.data)
      }
    })
  }

  getExporterList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.EXPORTER}).subscribe({
      next: (response: any) => {
        this.exporterList.set(response.data)
      }
    })
  }

  getShippingLineList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.SHIPPING_LINE}).subscribe({
      next: (response: any) => {
        this.shippingLineList.set(response.data)
      }
    })
  }

  getChaList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.CHA}).subscribe({
      next: (response: any) => {
        this.chaList.set(response.data)
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

  getPortList() {
    this.apiService.get(API.MASTER.PORT.LIST).subscribe({
      next: (response: any) => {
        this.portList.set(response.data)
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
      ccinId: new FormControl(0, []),
      ccinNo: new FormControl("", []),
      ccinDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      sbNo: new FormControl("", []),
      sbDate: new FormControl(null, []),
      sbType: new FormControl("", []),
      sez: new FormControl(false, []),
      exporterId: new FormControl(null, []),
      shippingLineId: new FormControl(null, []),
      chaId: new FormControl(null, []),
      consigneeName: new FormControl("", []),
      consigneeAdd: new FormControl("", []),
      countryId: new FormControl("", []),
      portofDestId: new FormControl(null, []),
      commodityId: new FormControl(null, []),
      packUQCCode: new FormControl("", []),
      cargoType: new FormControl("", []),
      portOfLoadingId: new FormControl(null, []),
      portOfDischarge: new FormControl(null, []),
      package: new FormControl(null, []),
      weight: new FormControl(null, []),
      fob: new FormControl(null, []),
      packageType: new FormControl("", []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.ccinDate = this.utilService.getNgbDateObject(record.ccinDate)
    record.sbDate = this.utilService.getNgbDateObject(record.sbDate)
    record.sez = !!record.sez;
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode() {
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const value = {...this.form.value};
      try {
        const res: any = await firstValueFrom(this.apiService.get(this.apiUrls.LIST, {SBNo: value.sbNo, SBDate: this.utilService.getDateObject(value.sbDate)}));
        const hasSameSbNo = res.data?.some((entry: any) => entry.ccinId !== value.ccinId);
        if(hasSameSbNo) {
          this.toasterService.showError("CCIN entry with same SB No and SB Date already exists");
          this.isSaving.set(false);
          return;
        }
      } catch (e) {
        //
      }
      const data = await this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next: () => {
          this.toasterService.showSuccess("CCIN entry saved successfully");
          this.table.reload();
          this.makeForm();
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  async makePayload() {
    const value = {...this.form.value};
    const defaultValue = {
      "stateId": 0,
      "cityId": 0,
      "createdBy": 0,
      "updatedBy": 0,
      "invoiceId": 0,
      "remarks": "",
      "isApproved": 0,
      "approvedBy": 0,
      "approvedDate": null,
      "godownId": 0,
      "godownName": "",
      "otHr": 0,
      "isCancelled": 0,
      "eximappID": 0,
      "packUQCDesc": ""
    }
    return {
      ...value, ...defaultValue, sez: value.sez ? 1 : 0,
      ccinDate: this.utilService.getDateObject(value.ccinDate), sbDate: this.utilService.getDateObject(value.sbDate)
    };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
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
