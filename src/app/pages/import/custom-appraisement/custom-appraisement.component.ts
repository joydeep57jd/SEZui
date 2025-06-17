import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {ApiService, ToastService} from "../../../services";
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
  utilService = inject(ApiService);
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

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getShippingLineList()
    this.getChaList()
    this.setHeaderCallbacks();
    this.makeForm();
  }

  getShippingLineList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.SHIPPING_LINE}).subscribe({
      next: (response: any) => {
        this.shippingLineList.set(response.data)
      }
    })
  }

  getChaList() {
    this.apiService.get(API.MASTER.PORT.LIST, {partyType: PARTY_TYPE.CHA}).subscribe({
      next: (response: any) => {
        this.chaList.set(response.data)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      appraisementNo: new FormControl("", []),
      appraisementDate: new FormControl(null, []),
      shippingLineId: new FormControl(null, []),
      chaId: new FormControl(null, []),
      vessel: new FormControl("", []),
      voyage: new FormControl("", []),
      rotation: new FormControl("", []),
      deliveryType: new FormControl(this.deliveryTypes[0].value, []),
      doType: new FormControl(this.doTypes[0].value, []),
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
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode = signal(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
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
    return  {...this.form.value};;
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
}
