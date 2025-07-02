import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {CONTAINER_STUFFING_DATA} from "./container-stuffing-data";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {ContainerStuffingDetailsComponent} from "./container-stuffing-details/container-stuffing-details.component";

@Component({
  selector: 'app-container-stuffing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent, NgbInputDatepicker, AutoCompleteComponent, ContainerStuffingDetailsComponent],
  templateUrl: './container-stuffing.component.html',
  styleUrls: ['./container-stuffing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerStuffingComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.EXPORT.CONTAINER_STUFFING.MAIN
  readonly apiUrls = API.EXPORT.CONTAINER_STUFFING;
  readonly transportModes = CONTAINER_STUFFING_DATA.transportModes;
  readonly containerCBTSizes = CONTAINER_STUFFING_DATA.containerCBTSizes;
  readonly fclLclList = CONTAINER_STUFFING_DATA.fclLclList;
  readonly origins = CONTAINER_STUFFING_DATA.origins;
  readonly viaList = CONTAINER_STUFFING_DATA.viaList;
  readonly equipmentSealTypes = CONTAINER_STUFFING_DATA.equipmentSealTypes;
  readonly equipmentStatuses = CONTAINER_STUFFING_DATA.equipmentStatuses;
  readonly equipmentQucList = CONTAINER_STUFFING_DATA.equipmentQucList;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  exporterList = signal<any[]>([])
  chaList = signal<any[]>([])
  shippingList = signal<any[]>([])
  godownList = signal<any[]>([])
  portList = signal<any[]>([])
  entryDetails = signal<any[]>([])

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPortList()
    this.getExporterList()
    this.getChaList()
    this.getGodownList()
    this.getShippingList()
    this.setHeaderCallbacks();
    this.makeForm();
  }

  getPortList() {
    this.apiService.get(API.MASTER.PORT.LIST).subscribe({
      next: (response: any) => {
        this.portList.set(response.data)
      }
    })
  }

  getShippingList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.SHIPPING_LINE}).subscribe({
      next: (response: any) => {
        this.shippingList.set(response.data)
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

  getGodownList() {
    this.apiService.get(API.MASTER.GODOWN.LIST).subscribe({
      next: (response: any) => {
        this.godownList.set(response.data)
      }
    })
  }

  getEntryDetails(stuffingId: number) {
    this.apiService.get(this.apiUrls.CONTAINER_STUFFING_DETAILS, {StuffingId: stuffingId}).subscribe({
      next: (response: any) => {
        this.entryDetails.set(response.data);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      stuffingReqId: new FormControl(0, []),
      transportMode: new FormControl(this.transportModes[0].value, []),
      stuffingNo: new FormControl("", []),
      stuffingDate: new FormControl(null, []),
      containerNo: new FormControl("", []),
      icdCode: new FormControl("", []),
      containerSize: new FormControl("", []),
      fclLcl: new FormControl(this.fclLclList[0].value, []),
      podId: new FormControl(null, []),
      originId: new FormControl("", []),
      contPOLId: new FormControl(null, []),
      viaId: new FormControl("", []),
      shippingLine: new FormControl(null, []),
      shippingSeal: new FormControl("", []),
      customSeal: new FormControl("", []),
      finalDestinationLocationId: new FormControl(null, []),
      equipmentSealTypeId: new FormControl("", []),
      equipmentStatusId: new FormControl("", []),
      equipmentQUCId: new FormControl("", []),
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
    record.requestDate = this.utilService.getNgbDateObject(record.requestDate);
    record.stuffingDate = this.utilService.getNgbDateObject(record.stuffingDate);
    record.transportMode = record.byTrain ? this.transportModes[0].value : this.transportModes[1].value;
    record.fclLcl = record.fcl ? this.fclLclList[0].value : this.fclLclList[1].value;
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getEntryDetails(record.stuffingReqId)
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
          this.toasterService.showSuccess("Container/CBT stuffing entry saved successfully");
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
    const isTrain = value.transportMode == this.transportModes[0].value;
    const isFcl = value.fclLcl == this.fclLclList[0].value;
    const pod = this.portList().find(port => port.portId === value.podId)?.portName ?? "";
    const origin = this.origins.find(origin => origin.value == value.originId)?.label ?? "";
    const contPOL = this.portList().find(port => port.portId === value.contPOLId)?.portName ?? "";
    const via = this.viaList.find(via => via.value == value.viaId)?.label ?? "";
    const finalDestinationLocation =  this.portList().find(port => port.portId === value.finalDestinationLocationId)?.portName ?? "";
    const equipmentSealType = this.equipmentSealTypes.find(equipmentSealType => equipmentSealType.value == value.equipmentSealTypeId)?.label ?? "";
    const equipmentStatus = this.equipmentStatuses.find(equipmentStatus => equipmentStatus.value == value.equipmentStatusId)?.label ?? "";
    const equipmentQUC = this.equipmentQucList.find(equipmentQuc => equipmentQuc.value == value.equipmentQUCId)?.label ?? "";
    return  {
      containerStuffingHeader: {
        ...value,
        byTrain: isTrain,
        byRoad: !isTrain,
        stuffingDate: this.utilService.getDateObject(this.form.value.stuffingDate),
        fcl: isFcl,
        lcl: !isFcl,
        pod,
        origin,
        contPOL,
        via,
        finalDestinationLocation,
        equipmentSealType,
        equipmentStatus,
        equipmentQUC,
        SEZ: "",
        StuffingReqNo: ""
      },
      containerStuffingDetails: this.entryDetails().map((entry: any) => ({
        ...entry,
        containerNo: value.containerNo,
        size: value.containerSize,
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
    });
  }

  changeEntryDetails(records: any[]) {
    this.entryDetails.set(records);
  }
}
