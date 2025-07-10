import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GATE_IN_DATA } from './gate-in-data';
import {DataTableComponent, DATA_TABLE_HEADERS, ApiService, ToastService, API, UtilService} from 'src/app';
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {PARTY_TYPE} from "../../../lib";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-gate-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, AutoCompleteComponent, NgbInputDatepicker],
  templateUrl: './gate-in.component.html',
  styleUrls: ['./gate-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateInComponent implements OnDestroy {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  readonly operationsNames = GATE_IN_DATA.operationsNames
  readonly operationTypes = GATE_IN_DATA.operationTypes;
  readonly deliveryTypes = GATE_IN_DATA.deliveryTypes;
  readonly containerTypes = GATE_IN_DATA.containerTypes;
  readonly sizes = GATE_IN_DATA.sizes;
  readonly materialTypes = GATE_IN_DATA.materialTypes;
  readonly icdCodePrefix = GATE_IN_DATA.icdCodePrefix as any;
  readonly headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_IN
  readonly apiUrls = API.GATE_OPERATION.GATE_IN;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  partyList = signal<any[]>([]);
  shippingLineList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);
  containerCBTList = signal<any[]>([]);
  currentRecord: any = null;

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPartyList();
    this.getShippingLine();
    this.setHeaderCallbacks();
    this.makeForm();
    this.updateCfsNo()
    this.getContainerList()
  }

  getContainerList() {
    this.apiService.get(this.apiUrls.CONTAINER_LIST).subscribe({
      next: (response: any) => {
        this.containerCBTList.set(response.data)
      }
    })
  }

  getPartyList() {
    this.apiService.get(API.MASTER.PARTY.LIST).subscribe({
      next: (response: any) => {
        this.partyList.set(response.data)
      }
    })
  }

  getShippingLine() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.SHIPPING_LINE}).subscribe({
      next: (response: any) => {
        this.shippingLineList.set(response.data)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      entryId: new FormControl(0, []),
      operationName: new FormControl(this.operationsNames[0].value, []),
      referenceNo: new FormControl("", []),
      operationType: new FormControl("", []),
      deliveryType: new FormControl("", []),
      partyId: new FormControl(null, []),
      shippingLine: new FormControl(null, []),
      containerType: new FormControl(this.containerTypes[0].value, []),
      containerNo: new FormControl("", []),
      size: new FormControl("", []),
      materialType: new FormControl("", []),
      vehicleNo: new FormControl("", []),
      driverName: new FormControl("", []),
      driverLicenseNo: new FormControl("", []),
      remarks: new FormControl("", []),
      cfsNo: new FormControl("", []),
      gateinDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      gateinTime: new FormControl(this.utilService.getCurrentTime(), []),
      reefer: new FormControl(false, []),
    })

    this.form.get("operationName")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.updateCfsNo()
      })
  }

  updateCfsNo() {
    const operationType = this.form.get("operationName")?.value;
    this.form.get("cfsNo")?.setValue(this.icdCodePrefix[operationType]+this.utilService.generateUniqueCode());
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    const dateTime = this.utilService.getNgbDateObject(record.gateinDate);
    record.gateinDate = {day: dateTime?.day, month: dateTime?.month, year: dateTime?.year};
    record.gateinTime = `${dateTime?.hour.toString().padStart(2, "0")}:${dateTime?.minute.toString().padStart(2, "0")}`
    this.currentRecord = record;
    this.updateContainerList()
    setTimeout(() => {
      this.form.reset();
      this.form.patchValue(record);
      setTimeout(() => {
        this.form.get("cfsNo")?.setValue(record.cfsNo);
      }, 2)
      this.isViewMode.set(isViewMode);
      isViewMode ? this.form.disable() : this.form.enable();
    }, 10)
  }

  setEditMode() {
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
    this.currentRecord = null;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next: () => {
          this.toasterService.showSuccess("Entry saved successfully");
          this.table.reload();
          this.makeForm();
          this.updateCfsNo()
          this.isSaving.set(false);
          this.currentRecord = null;
          this.getContainerList()
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    const value = {...this.form.value};
    const [hour, minute] = value.gateinTime.split(":");
    value.gateinDate = this.utilService.getDateObject(value.gateinDate, hour, minute);
    return value;
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

  addContainerOption(option: any) {
    this.containerCBTList.update(data => [...data, option]);
  }

  updateContainerList() {
    const list = [...this.containerCBTList()]
    if(this.currentRecord && !list.find(container => container.containerNo === this.currentRecord.containerNo)) {
      list.push({containerNo: this.currentRecord.containerNo})
    }
    this.containerCBTList.set(list)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
