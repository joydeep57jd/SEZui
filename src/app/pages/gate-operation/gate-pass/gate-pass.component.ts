import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject, OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {PrintService} from "../../../services/print.service";
import {API, DATA_TABLE_HEADERS, PARTY_TYPE} from "../../../lib";
import {debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {GatePassDetailsComponent} from "./gate-pass-details/gate-pass-details.component";
import {GatePassPrintComponent} from "./gate-pass-print/gate-pass-print.component";
import {GATE_PASS_CSS} from "../../../lib/constants/gate-pass-css";

@Component({
  selector: 'app-gate-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, NgbInputDatepicker, AutoCompleteComponent, GatePassDetailsComponent, GatePassPrintComponent],
  templateUrl: './gate-pass.component.html',
  styleUrls: ['./gate-pass.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatePassComponent implements OnDestroy {
  apiService = inject(ApiService);
  printService = inject(PrintService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);
  cdr = inject(ChangeDetectorRef)

  private readonly destroy$ = new Subject<void>();

  readonly apiUrls = API.GATE_OPERATION.GATE_PASS;
  readonly headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_PASS.MAIN;

  form!: FormGroup;
  invoiceList = signal<any[]>([]);
  chaList = signal<any[]>([]);
  importerExporterList = signal<any[]>([]);
  shippingLineList = signal<any[]>([]);
  portList = signal<any[]>([]);
  gatePassDetails = signal<any[]>([]);
  isSaving = signal(false);
  isViewMode = signal(false);
  pdfData = signal<any>({});
  containerList = signal<any[]>([]);
  printInProgress: Record<string,boolean> = {};
  actionLoaders: Record<string, Record<string,boolean>> = {}

  @ViewChild(DataTableComponent) table!: DataTableComponent;
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  constructor() {
    this.setHeaderCallbacks()
    this.getInvoiceList()
    this.getChaList();
    this.getImporterExporterList()
    this.getShippingLineList();
    this.getPortList()
    this.makeForm();
  }

  getInvoiceList() {
    this.invoiceList.set([])
    this.apiService.get(this.apiUrls.YARD_INVOICE_LIST).subscribe({
      next: (response: any) => {
        this.invoiceList.set(response.data)
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

  getImporterExporterList() {
    forkJoin([
      this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.IMPORTER}),
      this.apiService.get(API.MASTER.PARTY.LIST, {partyType: PARTY_TYPE.EXPORTER})
    ]).subscribe({
      next: (responses: any) => {
        this.importerExporterList.set([...responses[0].data, ...responses[1].data])
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

  getPortList() {
    this.apiService.get(API.MASTER.PORT.LIST).subscribe({
      next: (response: any) => {
        this.portList.set(response.data)
      }
    })
  }

  getGatePassDetails(record: any) {
    this.apiService.get(this.apiUrls.GATE_PASS_DETAILS, {gatepassId: record.gatePassId}).subscribe({
      next: (response: any) => {
        this.gatePassDetails.set(response.data)
      }
    })
  }

  getOblDetails(invoiceNo: string) {
    this.containerList.set([])
    this.apiService.get(this.apiUrls.OBL_DETAILS, {invoiceNo}).subscribe({
      next: (response: any) => {
        this.form.get("shippingLineName")?.setValue(response.data.shippingLine ?? null);
        this.form.get("impExpName")?.setValue(response.data.importerExporterName ?? null);
        this.form.get("remarks")?.setValue(response.data.remarks ?? null);
        this.containerList.set(response.data.containersDetails)
      }
    })
  }

  makeForm(){
    this.form = new FormGroup({
      gatePassId: new FormControl(0, []),
      gatePassNo: new FormControl("", []),
      gatePssDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      invoiceId: new FormControl(null, []),
      invoiceNo: new FormControl("", []),
      expDate: new FormControl(null, []),
      chaName: new FormControl(null, []),
      impExpName: new FormControl(null, []),
      shippingLineName: new FormControl(null, []),
      departureDate: new FormControl(null, []),
      arrivalDate: new FormControl(null, []),
      remarks: new FormControl("", []),
    });

    this.form.get("invoiceNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe((invoiceNo) => {
        this.containerList.set([])
        const invoice = this.invoiceList().find(invoice => invoice.invoiceNo === invoiceNo);
        this.form.get("invoiceId")?.setValue(invoice.invoiceId ?? '');
        const cha = this.chaList().find(cha => cha.partyId === invoice?.partyId);
        this.form.get("chaName")?.setValue(cha?.partyName ?? null);
        this.form.get("expDate")?.setValue(invoice ? this.utilService.getNgbDateObject(invoice?.invoiceDate) : null);
        this.getOblDetails(invoiceNo);
      })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.gatePssDate = this.utilService.getNgbDateObject(record.gatePssDate);
    record.expDate = this.utilService.getNgbDateObject(record.expDate);
    record.arrivalDate = this.utilService.getNgbDateObject(record.arrivalDate);
    record.departureDate = this.utilService.getNgbDateObject(record.departureDate);

    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.getGatePassDetails(record);
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.gatePassDetails.set([])
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Gate pass saved successfully");
          this.table.reload();
          this.gatePassDetails.set([])
          this.makeForm();
          this.getInvoiceList()
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    const value = {...this.form.getRawValue()};
    value.gatePssDate = this.utilService.getDateObject(value.gatePssDate);
    value.expDate = this.utilService.getDateObject(value.expDate);
    value.arrivalDate = this.utilService.getDateObject(value.arrivalDate);
    value.departureDate = this.utilService.getDateObject(value.departureDate);
    return  {
      gatePass: value,
      gatePassDetails: this.gatePassDetails()
    };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  print(record: any) {
    if(this.printInProgress[record.gatePassId]) return;
    this.printInProgress[record.gatePassId] = true;
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    this.apiService.get(this.apiUrls.GATE_PASS_DETAILS, {gatepassId: record.gatePassId}).subscribe({
      next: (response: any) => {
        this.pdfData.set({
          header: {...record},
          details: response.data
        })
        setTimeout(() => {
          this.printInProgress[record.gatePassId] = false;
          this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
          this.cdr.detectChanges()
          this.printService.print(this.invoiceSection, record.gatePassNo, GATE_PASS_CSS);
        }, 10)
      }, error: () => {
        this.printInProgress[record.gatePassId] = false;
        this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
        this.cdr.detectChanges()
      }
    });
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "edit") {
        header.callback = this.edit.bind(this);
      }
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
      if(header.field === "print") {
        header.callback = this.print.bind(this);
      }
    });
  }

  changeGatePassDetails(records: any[]) {
    this.gatePassDetails.set(records);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
