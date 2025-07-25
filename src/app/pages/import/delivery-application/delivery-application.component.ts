import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {
  DeliveryApplicationDetailsComponent
} from "./delivery-application-details/delivery-application-details.component";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-delivery-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, DeliveryApplicationDetailsComponent, AutoCompleteComponent],
  templateUrl: './delivery-application.component.html',
  styleUrls: ['./delivery-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryApplicationComponent implements OnDestroy {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.IMPORT.DELIVERY_APPLICATION.MAIN
  readonly apiUrls = API.IMPORT.DELIVERY_APPLICATION;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  chaList = signal<any[]>([])
  importerList = signal<any[]>([])
  destuffingList = signal<any[]>([])
  oblList = signal<any[]>([])
  entryDetails = signal<any[]>([])

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getImporterLineList()
    this.getChaList()
    this.getDestuffingList()
    this.setHeaderCallbacks();
    this.makeForm();
  }

  getImporterLineList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.IMPORTER}).subscribe({
      next: (response: any) => {
        this.importerList.set(response.data)
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

  getOblList(id: number) {
    this.oblList.set([])
    this.apiService.get(this.apiUrls.OBL_LIST, {DestuffingEntryId: id}).subscribe({
      next: (response: any) => {
        this.oblList.set(response.data)
      }
    })
  }

  getDestuffingList() {
    this.apiService.get(this.apiUrls.DESTUFFING_LIST).subscribe({
      next: (response: any) => {
        this.destuffingList.set(response.data)
      }
    })
  }

  getEntryDetails(stuffingId: number) {
    this.apiService.get(this.apiUrls.ENTRY_DETAILS, {DeliveryId: stuffingId}).subscribe({
      next: (response: any) => {
        this.entryDetails.set(response.data);
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      deliveryId: new FormControl(0, []),
      deliveryNo: new FormControl({value: "", disabled: true}, []),
      destuffingId: new FormControl(null, []),
      chaId: new FormControl({value: null, disabled: true}, []),
    })
    this.form.get("destuffingId")?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(0),
      distinctUntilChanged()
    ).subscribe(destuffingId => {
      const destuffing = this.destuffingList().find(destuffing => destuffing.destuffingEntryId === destuffingId)
      this.form.get("chaId")?.setValue(destuffing?.chaId)
      this.getOblList(destuffingId)
    });
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
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getEntryDetails(record.deliveryId)
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
          this.toasterService.showSuccess("Delivery application saved successfully");
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
    const value = {...this.form.getRawValue()};
    return  {
      impDeliveryApplicationHdr: {
        ...value,
      },
      impDeliveryApplicationDtl: this.entryDetails().map((entry: any) => ({
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
