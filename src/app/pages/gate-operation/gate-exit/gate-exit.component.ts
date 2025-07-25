import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {DataTableComponent} from "../../../components";
import {GateExitDetailsComponent} from "./gate-exit-details/gate-exit-details.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {GATE_EXIT_DATA} from "./gate-exit-data";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-gate-exit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTableComponent, GateExitDetailsComponent, NgbInputDatepicker, AutoCompleteComponent],
  templateUrl: './gate-exit.component.html',
  styleUrls: ['./gate-exit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateExitComponent implements OnDestroy, OnDestroy {
  apiService = inject(ApiService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);

  private readonly destroy$ = new Subject<void>();

  readonly apiUrls = API.GATE_OPERATION.GATE_EXIT;
  readonly headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_EXIT.MAIN;
  readonly sizes = GATE_EXIT_DATA.sizes;

  form!: FormGroup;
  chaList = signal<any[]>([]);
  shippingLineList = signal<any[]>([]);
  gatePassList = signal<any[]>([]);
  gateExitDetails = signal<any[]>([]);
  containerList = signal<any[]>([]);
  isSaving = signal(false);
  isViewMode = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;
  @ViewChild(GateExitDetailsComponent) childComp!: GateExitDetailsComponent;

  constructor() {
    this.setHeaderCallbacks()
    this.getChaList();
    this.getShippingLineList();
    this.getGatePassList()
    this.makeForm();
  }

  getChaList() {
    this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.CHA}).subscribe({
      next: (response: any) => {
        this.chaList.set(response.data)
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

  getGatePassList() {
    this.gatePassList.set([])
    this.apiService.get(API.GATE_OPERATION.GATE_PASS.LIST, {ForGateExit: true}).subscribe({
      next: (response: any) => {
        this.gatePassList.set(response.data)
      }
    })
  }

  getGateExitDetails(record: any) {
    this.apiService.get(this.apiUrls.GATE_EXIT_DETAILS, {GateExitHeaderId: record.exitIdHeaderId}).subscribe({
      next: (response: any) => {
        this.gateExitDetails.set(response.data)
      }
    })
  }

  getContainerList(gatePassId: number) {
    this.containerList.set([])
    this.apiService.get(API.GATE_OPERATION.GATE_PASS.GATE_PASS_DETAILS, {gatepassId: gatePassId}).subscribe({
      next: (response: any) => {
        const containerNo = this.form.get("cbtNo")?.value
        this.containerList.set(response.data)
        if(response.data.some((data: any) => data.containerNo === containerNo)) {
          this.form.get("cbtNo")?.patchValue(null)
          setTimeout(() => {
            this.form.get("cbtNo")?.patchValue(containerNo)
          }, 10)
        } else {
          this.form.get("cbtNo")?.patchValue(null)
        }
      }
    })
  }

  resetContainerDetails() {
    if(this.form.get("exitIdHeaderId")?.value) {
      return
    }
    this.containerList.set([])
    this.form.get("size")?.setValue("");
    this.form.get("shippingLine")?.setValue(null);
    this.form.get("chaName")?.setValue(null);
  }

  makeForm(){
    this.form = new FormGroup({
      exitIdHeaderId: new FormControl(0, []),
      gateExitNo: new FormControl("", []),
      gateExitDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      gateExitTime: new FormControl(this.utilService.getCurrentTime(), []),
      gatePassId: new FormControl(null, []),
      gatePassNo: new FormControl("", []),
      gatePassDate: new FormControl(null, []),
      expectedTime: new FormControl(null, []),
      cbtNo: new FormControl("", []),
      size: new FormControl({value: "", disabled: true}, []),
      shippingLine: new FormControl({value: null, disabled: true}, []),
      chaName: new FormControl({value: null, disabled: true}, []),
      cargoDescription: new FormControl({value: "", disabled: true}, []),
    });
    this.form.get("gatePassId")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(gatePassId => {
        this.resetContainerDetails()
        const gatePassHeader = this.gatePassList().find(gatePass => gatePass.gatePassId === gatePassId)
        this.form.get("gatePassNo")?.setValue(gatePassHeader?.gatePassNo)
        this.form.get("gatePassDate")?.setValue(this.utilService.getNgbDateObject(gatePassHeader?.gatePssDate))
        this.form.get("expectedTime")?.setValue(this.utilService.getNgbDateObject(gatePassHeader?.expDate))
        this.form.get("chaName")?.patchValue(gatePassHeader?.chaName)
        this.form.get("shippingLine")?.patchValue(gatePassHeader?.shippingLineName)
        if(gatePassId) {
          this.getContainerList(gatePassId)
        }
      })
      this.form.get("cbtNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(cbtNo => {
        const container = this.containerList().find(c => c.containerNo === cbtNo)
        this.form.get("size")?.patchValue(container?.size ?? "")
        this.form.get("cargoDescription")?.patchValue(container?.cargoDescription ?? "")
      })
    this.disabledFields()
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    const dateTime = this.utilService.getNgbDateObject(record.gateExitDateTime);
    record.gateExitDate = {day: dateTime?.day, month: dateTime?.month, year: dateTime?.year};
    record.gateExitTime = `${dateTime?.hour.toString().padStart(2, "0")}:${dateTime?.minute.toString().padStart(2, "0")}`
    const isGatePassExist = this.gatePassList().some(data => data.gatePassId == record.gatePassId)
    if(!isGatePassExist) {
      this.apiService.get(API.GATE_OPERATION.GATE_PASS.LIST, {id: record.gatePassId}).subscribe({
        next: (response: any) => {
          if(response.data[0]) {
            this.form.get("gatePassId")?.patchValue(null)
            this.gatePassList.update(list=> [...list, response.data[0]]);
            setTimeout(() => {
              this.form.get("gatePassId")?.patchValue(record.gatePassId)

            }, 10)
          }
        }
      })
    }
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getGateExitDetails(record);
    this.disabledFields()
  }

  disabledFields() {
    this.form.get("size")?.disable()
    this.form.get("shippingLine")?.disable()
    this.form.get("chaName")?.disable()
    this.form.get("cargoDescription")?.disable()
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.gateExitDetails.set([])
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Gate exit saved successfully");
          this.table.reload();
          this.getGatePassList();
          this.gateExitDetails.set([])
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
    const [hour, minute] = value.gateExitTime.split(":");
    value.gateExitDateTime = this.utilService.getDateObject(value.gateExitDate, hour, minute);
    value.gatePassDate = this.utilService.getDateObject(value.gatePassDate);
    value.expectedTime = this.utilService.getDateObject(value.expectedTime);
    value.branchId = 0;
    value.msgFlag = 0;
    value.actual_File_Name = "";
    value.ruleCode = 0;
    value.dtMsgStatus = 0;
    value.dtAmendStatus = 0;
    const shippingLineId = this.shippingLineList().find(shippingLine => shippingLine.partyName=== value.shippingLine)?.partyId ?? 0;
    return  {
      ExitThroughGateHeader: value,
      ExitThroughGateDetails: this.gateExitDetails().map(details => ({
        ...details,
        containerNo: details.containerNo,
        size: details.size,
        reefer: 0,
        shippingLine: details.shippingLine,
        chaName: details.chaName,
        cargoDescription: details.cargoDescription,
        shippingLineId,
        cfsCode: "",
        expectedArrivalDateTime: value.expectedTime,
      }))
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

  changeGateExitDetails(records: any[]) {
    this.gateExitDetails.set(records);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
