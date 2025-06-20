import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {CUSTOM_APPRAISEMENT_DATA} from "./custom-appraisement-data";
import {ContainerDetailsComponent} from "./container-details/container-details.component";
import {IssuerDetailsComponent} from "./issuer-details/issuer-details.component";

@Component({
  selector: 'app-custom-appraisement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, NgbDatepickerModule, AutoCompleteComponent, ContainerDetailsComponent, IssuerDetailsComponent],
  templateUrl: './custom-appraisement.component.html',
  styleUrls: ['./custom-appraisement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAppraisementComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.IMPORT.CUSTOM_APPRAISEMENT.MAIN
  readonly apiUrls = API.IMPORT.CUSTOM_APPRAISEMENT;
  readonly deliveryTypes = CUSTOM_APPRAISEMENT_DATA.deliveryTypes;
  readonly doTypes = CUSTOM_APPRAISEMENT_DATA.doTypes;
  readonly appraisementStatuses = CUSTOM_APPRAISEMENT_DATA.appraisementStatuses;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  shippingLineList = signal<any[]>([])
  chaList = signal<any[]>([])
  importerList = signal<any[]>([])
  issuerDetails = signal<any[]>([])
  containerDetails = signal<any[]>([])
  oblList = signal<any[]>([]);
  containerList = signal<any[]>([]);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getOblList()
    this.getContainerList()
    this.getShippingLineList()
    this.getChaList()
    this.getImporterList()
    this.setHeaderCallbacks();
    this.makeForm();
  }

  getOblList() {
    this.apiService.get(this.apiUrls.OBL_LIST).subscribe({
      next: (response: any) => {
        this.oblList.set(response.data)
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

  getChaList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.CHA}).subscribe({
      next: (response: any) => {
        this.chaList.set(response.data)
      }
    })
  }

  getImporterList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.IMPORTER}).subscribe({
      next: (response: any) => {
        this.importerList.set(response.data)
      }
    })
  }

  getIssuerDetails(customAppraisementId: number) {
    this.apiService.get(this.apiUrls.ISSUER_DETAILS, {CustAppId: customAppraisementId}).subscribe({
      next: (response: any) => {
        this.issuerDetails.set(response.data);
      }
    })
  }

  getContainerDetails(customAppraisementId: number) {
    this.apiService.get(this.apiUrls.CONTAINER_DETAILS, {CustAppId: customAppraisementId}).subscribe({
      next: (response: any) => {
        this.containerDetails.set(response.data);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      id: new FormControl(0, []),
      appraisementNo: new FormControl("", []),
      appraisementDate: new FormControl(null, []),
      shippingLineId: new FormControl(null, []),
      chaId: new FormControl(null, []),
      vessel: new FormControl("", []),
      voyage: new FormControl("", []),
      rotation: new FormControl("", []),
      deliveryType: new FormControl(this.deliveryTypes[0].value, []),
      doStatus: new FormControl(this.doTypes[0].value, []),
      appraisementStatus: new FormControl(this.appraisementStatuses[0].value, []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.appraisementDate = this.utilService.getNgbDateObject(record.appraisementDate);
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getIssuerDetails(record.id)
    this.getContainerDetails(record.id)
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
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
          this.toasterService.showSuccess("Custom appraisement saved successfully");
          this.table.reload();
          this.issuerDetails.set([])
          this.containerDetails.set([])
          this.makeForm();
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    return  {...this.form.value, appraisementDate: this.utilService.getDateObject(this.form.value.appraisementDate), appraisementContainerDetailsList: this.containerDetails(), appraisementDoDetailsList: this.issuerDetails()};
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

  changeIssuerDetails(records: any[]) {
    this.issuerDetails.set(records);
  }

  changeContainerDetails(records: any[]) {
    this.containerDetails.set(records);
  }
}
