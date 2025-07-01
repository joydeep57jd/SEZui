import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ToastService} from "../../../services";
import {DATA_TABLE_HEADERS} from "../../../lib";
import {DataTableComponent} from "../../../components";
import {YARD_INVOICE_DATA} from "./yard-invoice-data";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {SelectContainersComponent} from "./select-containers/select-containers.component";
import {TableComponent} from "../../../components/table/table.component";
import {YardInvoiceHelper} from "./yard-invoice-helper";
import {PrintService} from "../../../services/print.service";
import {
  PaymentReceiptInvoiceComponent
} from "../../cash-management/payment-receipt/payment-receipt-invoice/payment-receipt-invoice.component";
import {YardInvoiceVoucherComponent} from "./yard-invoice-voucher/yard-invoice-voucher.component";
import {INVOICE_CSS} from "../../../lib/constants/invoice-css";

@Component({
  selector: 'app-yard-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbInputDatepicker, AutoCompleteComponent, TableComponent, DataTableComponent, PaymentReceiptInvoiceComponent, YardInvoiceVoucherComponent],
  templateUrl: './yard-invoice.component.html',
  styleUrls: ['./yard-invoice.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YardInvoiceComponent extends YardInvoiceHelper implements OnDestroy {
  toasterService = inject(ToastService);
  datePipe = inject(DatePipe);
  modalService = inject(NgbModal);
  printService = inject(PrintService);
  cdr = inject(ChangeDetectorRef);

  readonly invoiceTypes = YARD_INVOICE_DATA.invoiceTypes;
  readonly destuffingTypes = YARD_INVOICE_DATA.destuffingTypes;
  readonly examinationTypes = YARD_INVOICE_DATA.examinationTypes;
  readonly yardInvoicePreviewHeaders = DATA_TABLE_HEADERS.IMPORT.YARD_INVOICE.YARD_INVOICE_PREVIEW
  readonly headers = DATA_TABLE_HEADERS.IMPORT.YARD_INVOICE.MAIN

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  selectedContainerSet = signal<Set<string>>(new Set());
  insuredContainerSet = signal<Set<string>>(new Set());
  selectedContainerList = signal<any[]>([]);
  chargeDetails = signal<any>({});
  transportChargeDetails = signal<any>({});
  totalCharges = signal<any>({});
  pdfData = signal<any>({});
  isViewMode = signal(false);
  isSaving = signal(false);
  printInProgress: Record<string,boolean> = {};
  actionLoaders: Record<string, Record<string,boolean>> = {}

  @ViewChild(DataTableComponent) table!: DataTableComponent;
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  constructor() {
    super();
    this.setHeaderCallbacks()
    this.getChargeTypeList()
    this.getContainerList()
    this.getPartyList();
    this.getEximTraderList();
    this.makeForm();
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
  }

  fetchCharges() {
    const body = this.getFetchChargesPayload(this.form.get("partyId")?.value, this.selectedContainerList());
    this.fetchTransportCharges();
    if(!body) {
      this.chargeDetails.set({});
      this.totalCharges.set(this.getTotalCharges({}, this.transportChargeDetails()))
      return;
    }
    this.apiService.post(this.apiUrls.CHARGE_DETAILS, body).subscribe({
      next: (response: any) => {
        this.chargeDetails.set(response.data[0])
        this.totalCharges.set(this.getTotalCharges(response.data[0], this.transportChargeDetails()))
      }
    })
  }

  fetchTransportCharges() {
    const value = this.form.get("transportationChargeType")?.value;
    const params = this.getFetchChargesPayload(this.form.get("partyId")?.value, this.selectedContainerList());
    if(!value || !params) {
      this.transportChargeDetails.set({})
      this.totalCharges.set(this.getTotalCharges(this.chargeDetails(), {}));
      return;
    }
    this.apiService.get(this.apiUrls.TRANSPORTATION_CHARGES, params).subscribe({
      next: (response: any) => {
        this.transportChargeDetails.set(response)
        this.totalCharges.set(this.getTotalCharges(this.chargeDetails(), response));
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      yardInvId: new FormControl(0, []),
      invoiceType: new FormControl(this.invoiceTypes[0].value, []),
      invoiceNo: new FormControl("", []),
      deliveryDate: new FormControl(null, []),
      applicationId: new FormControl(null, []),
      invoiceDate: new FormControl(null, []),
      partyId: new FormControl("", []),
      payeeId: new FormControl("", []),
      gstNo: new FormControl("", []),
      paymentMode: new FormControl("", []),
      destuffingType: new FormControl(this.destuffingTypes[0].value, []),
      examinationType: new FormControl("", []),
      placeOfSupply: new FormControl("", []),
      sezId: new FormControl("", []),
      otHours: new FormControl("", []),
      container: new FormControl("", []),
      remarks: new FormControl("", []),
      transportationChargeType: new FormControl("", []),
    })
    this.form.get("partyId")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(partyId => {
        const eximTrader = this.eximTraderMap().get(partyId);
        this.form.get("payeeId")?.setValue(partyId);
        this.form.get("gstNo")?.setValue(eximTrader?.gstNo ?? "");
        this.fetchCharges()
      })
      this.form.get("transportationChargeType")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.fetchTransportCharges();
      })
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload(this.form.value, this.chargeDetails(), this.transportChargeDetails(), this.selectedContainerList(), this.partyList());
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Yard invoice saved successfully");
          this.table.reload();
          this.makeForm();
          this.chargeDetails.set({})
          this.selectedContainerSet().clear();
          this.insuredContainerSet().clear();
          this.selectedContainerList.set([]);
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateSelectedContainerList(isFetchChargeRequired = true) {
    const selectedContainerList: any[] = [];
    this.containerList().forEach((container: any) => {
      if(this.selectedContainerSet().has(this.getContainerOblNo(container))) {
        selectedContainerList.push({...container, isInsured: this.insuredContainerSet().has(this.getContainerOblNo(container))});
      }
    })
    this.selectedContainerList.set(selectedContainerList);
    if (isFetchChargeRequired) {
      this.fetchCharges()
    }
  }

  openSelectContainersModal() {
    const modalRef = this.modalService.open(SelectContainersComponent, {modalDialogClass: 'list-container-modal', backdrop : 'static', keyboard : false});
    modalRef.componentInstance.records.set(this.containerList());
    modalRef.componentInstance.getContainerOblNo = this.getContainerOblNo;
    modalRef.componentInstance.selectedContainerSet.set(this.selectedContainerSet());
    modalRef.componentInstance.insuredContainerSet.set(this.insuredContainerSet());
    modalRef.componentInstance.selectionChange.subscribe((container: any) => {
      const containerOblNo = this.getContainerOblNo(container);
      if(this.selectedContainerSet().has(containerOblNo)) {
        this.selectedContainerSet().delete(containerOblNo);
      } else {
        this.selectedContainerSet().add(containerOblNo);
      }
      this.updateSelectedContainerList()
    })
    modalRef.componentInstance.updateInsured.subscribe((container: any) => {
      const containerOblNo = this.getContainerOblNo(container);
      if(this.insuredContainerSet().has(containerOblNo)) {
        this.insuredContainerSet().delete(containerOblNo);
      } else {
        this.insuredContainerSet().add(containerOblNo);
      }
      this.updateSelectedContainerList(false)
    })
  }

  print(record: any) {
    if(this.printInProgress[record.yardInvId]) return;
    this.printInProgress[record.yardInvId] = true;
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    this.apiService.get(this.apiUrls.INVOICE_DETAILS, {InvoiceNo: record.invoiceNo}).subscribe({
      next: (response: any) => {
        this.pdfData.set(response.data);
        setTimeout(() => {
          this.printInProgress[record.yardInvId] = false;
          this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
          this.cdr.detectChanges()
          this.printService.print(this.invoiceSection, record.invoiceNo, INVOICE_CSS);
        }, 10)
      }, error: () => {
        this.printInProgress[record.yardInvId] = false;
        this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
        this.cdr.detectChanges()
      }
    });
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "print") {
        header.callback = this.print.bind(this);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get timeStamp() {
    return  this.datePipe.transform(new Date(), 'MMMM d, y hh:mm:ss a');
  }
}
