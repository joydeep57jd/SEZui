import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {LOAD_CONTAINER_REQUEST_DATA} from "./load-container-request-data";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {
  LoadContainerRequestDetailsComponent
} from "./load-container-request-details/load-container-request-details.component";

@Component({
  selector: 'app-load-container-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent, NgbInputDatepicker, AutoCompleteComponent, LoadContainerRequestDetailsComponent],
  templateUrl: './load-container-request.component.html',
  styleUrls: ['./load-container-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadContainerRequestComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.EXPORT.LOAD_CONTAINER_REQUEST.MAIN
  readonly apiUrls = API.EXPORT.LOAD_CONTAINER_REQUEST;
  readonly loadContainerRequestData = LOAD_CONTAINER_REQUEST_DATA;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  chaList = signal<any[]>([])
  portList = signal<any[]>([])
  exporterList = signal<any[]>([])
  shippingLineList = signal<any[]>([])
  commodityList = signal<any[]>([])
  entryDetails = signal<any[]>([])
  containerList = signal<any[]>([]);
  shippingBillList = signal<any[]>([])
  packUqcList = signal<any[]>([]);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPortList()
    this.getExporterList()
    this.getChaList()
    this.getCommodityList()
    this.getShippingLineList()
    this.getShippingBillList()
    this.getContainerList()
    this.setHeaderCallbacks();
    this.getPackUqcList()
    this.makeForm();
  }

  getPackUqcList() {
    this.apiService.get(API.MASTER.PACK_UQC).subscribe({
      next: (response: any) => {
        this.packUqcList.set(response.data)
      }
    })
  }

  getShippingBillList() {
    this.apiService.get(this.apiUrls.SHIPPING_BILL_LIST).subscribe({
      next: (response: any) => {
        this.shippingBillList.set(response.data)
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

  getContainerList() {
    this.apiService.get(this.apiUrls.CONTAINER_LIST).subscribe({
      next: (response: any) => {
        this.containerList.set(response.data)
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

  getExporterList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.EXPORTER}).subscribe({
      next: (response: any) => {
        this.exporterList.set(response.data)
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

  getCommodityList() {
    this.apiService.get(API.MASTER.COMMODITY.LIST).subscribe({
      next: (response: any) => {
        this.commodityList.set(response.data)
      }
    })
  }

  getEntryDetails(loadContReqId: number) {
    this.apiService.get(this.apiUrls.ENTRY_DETAILS, {LoaderHeaderId: loadContReqId}).subscribe({
      next: (response: any) => {
        this.entryDetails.set(response.data);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      loadContReqId: new FormControl(0, []),
      loadContReqNo: new FormControl("", []),
      loadContReqDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      chaId: new FormControl(null, []),
      finalDestinationLocationID: new FormControl("", []),
      remarks: new FormControl("", []),
      movement: new FormControl("", []),
      examType: new FormControl("", []),
      origin: new FormControl("", []),
      via: new FormControl("", []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.loadContReqDate = this.utilService.getNgbDateObject(record.loadContReqDate);
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getEntryDetails(record.loadContReqId)
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
    this.entryDetails.set([])
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Load container request saved successfully");
          this.table.reload();
          this.entryDetails.set([])
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
    return  {
      loadContainerHeader: {
        ...value,
        loadContReqDate: this.utilService.getDateObject(this.form.value.loadContReqDate),
        chaId: value.chaId ?? 0,
        finalDestinationLocationID: value.finalDestinationLocationID ?? 0,
        finalDestinationLocation: this.portList().find(port => port.portId == value.finalDestinationLocationID)?.portName ?? "",
        movement: value.movement ?? "",
        examType: value.examType ?? "",
        branchId: 0,
        createdBy: 0,
        createdOn: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
        updatedBy: 0,
        updatedOn: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
        isApproved: value.isApproved ?? 0,
        sfMsgStatus: value.sfMsgStatus ?? 0,
        origin: value.origin ?? "",
        via: value.via ?? "",
        transactionType: value.transactionType ?? "",
        sfSend: value.sfSend ?? 0,
      },
      loadContainerRequestDetails: this.entryDetails().map((entry: any) => ({
        ...entry,
      })),
    };
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
      if(header.field === "chaId") {
        header.valueGetter = (record) => this.chaList().find(cha => cha.partyId === record.chaId)?.partyName;
      }
    });
  }

  changeEntryDetails(records: any[]) {
    this.entryDetails.set(records);
  }
}
