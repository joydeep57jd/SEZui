import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DestuffingEntryDetailsComponent} from "./destuffing-entry-details/destuffing-entry-details.component";

@Component({
  selector: 'app-destuffing-entry',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, DestuffingEntryDetailsComponent, NgbInputDatepicker, ReactiveFormsModule],
  templateUrl: './destuffing-entry.component.html',
  styleUrls: ['./destuffing-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestuffingEntryComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.IMPORT.DESTUFFING_ENTRY.MAIN
  readonly apiUrls = API.IMPORT.DESTUFFING_ENTRY;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  shippingLineList = signal<any[]>([])
  chaList = signal<any[]>([])
  containerList = signal<any[]>([]);
  godownList = signal<any[]>([])
  commodityList = signal<any[]>([])
  entryDetails = signal<any[]>([])

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getContainerList()
    this.getShippingLineList()
    this.getChaList()
    this.getGodownList()
    this.getCommodityList()
    this.setHeaderCallbacks();
    this.makeForm();
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

  getGodownList() {
    this.apiService.get(API.MASTER.GODOWN.LIST).subscribe({
      next: (response: any) => {
        this.godownList.set(response.data)
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

  getEntryDetails(destuffingEntryId: number) {
    this.apiService.get(this.apiUrls.ENTRY_DETAILS, {DestuffingEntryId: destuffingEntryId}).subscribe({
      next: (response: any) => {
        this.entryDetails.set(response.data);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      destuffingEntryId: new FormControl(0, []),
      containerNo: new FormControl(null, []),
      startDate: new FormControl(null, []),
      destuffingEntryNo: new FormControl("", []),
      destuffingEntryDate: new FormControl(null, []),
      shippingLineId: new FormControl(null, []),
      chaId: new FormControl(null, []),
      rotation: new FormControl("", []),
      cargoDelivery: new FormControl(false, []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.startDate = this.utilService.getNgbDateObject(record.startDate);
    record.destuffingEntryDate = this.utilService.getNgbDateObject(record.destuffingEntryDate);
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getEntryDetails(record.destuffingEntryId)
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
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
          this.toasterService.showSuccess("Destuffing entry saved successfully");
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
    return  {
      destuffingEntryHdr: {
      ...this.form.value,
      startDate: this.utilService.getDateObject(this.form.value.startDate),
      destuffingEntryDate: this.utilService.getDateObject(this.form.value.destuffingEntryDate),
      },
      destuffingEntryDtl: this.entryDetails(),
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
