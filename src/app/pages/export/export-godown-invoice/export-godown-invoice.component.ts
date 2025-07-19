import {ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DATA_TABLE_HEADERS} from "../../../lib";
import {debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {INVOICE_CSS} from "../../../lib/constants/invoice-css";
import {ExportGodownInvoiceHelper} from "./export-godown-invoice-helper";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {TableComponent} from "../../../components/table/table.component";
import {SelectShippingBillComponent} from "./select-shipping-bill/select-shipping-bill.component";
import {
  ExportGodownInvoiceVoucherComponent
} from "./export-godown-invoice-voucher/export-godown-invoice-voucher.component";

@Component({
  selector: 'app-export-godown-invoice',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, NgbInputDatepicker, ReactiveFormsModule, TableComponent, ExportGodownInvoiceVoucherComponent],
  templateUrl: './export-godown-invoice.component.html',
  styleUrls: ['./export-godown-invoice.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportGodownInvoiceComponent extends ExportGodownInvoiceHelper implements OnDestroy {
  datePipe = inject(DatePipe);

  readonly headers = DATA_TABLE_HEADERS.EXPORT.GODOWN_INVOICE.MAIN
  readonly godownInvoicePreviewHeaders = DATA_TABLE_HEADERS.EXPORT.GODOWN_INVOICE.GODOWN_INVOICE_PREVIEW
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  selectedShippingBillSet = signal<Set<string>>(new Set());
  selectedShippingBillList = signal<any[]>([]);
  entryChargeDetails = signal<any>({});
  handlingChargeDetails = signal<any>({});
  insuranceChargeDetails = signal<any>({});
  totalCharges = signal<any>({});
  pdfData = signal<any>({});
  isViewMode = signal(false);
  isSaving = signal(false);
  printInProgress: Record<string,boolean> = {};
  actionLoaders: Record<string, Record<string,boolean>> = {}

  @ViewChild(DataTableComponent) table!: DataTableComponent;
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  constructor() {
    super()
    this.setHeaderCallbacks()
    this.getChargeTypeList()
    this.getContainerStuffingList()
    this.getEximTraderList();
    this.getPartyList();
    this.makeForm();
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
  }

  fetchCharges() {
    const partyId = this.form.get("partyId")?.value;
    const entryChargesBody = this.getEntryChargesPayload(partyId, this.selectedShippingBillList());
    const handlingChargesBody = this.getHandlingChargesPayload(partyId, this.selectedShippingBillList());
    const invoiceDate = this.form.get("invoiceDate")?.value;
    if(!entryChargesBody || !invoiceDate) {
      this.entryChargeDetails.set({});
      this.handlingChargeDetails.set({});
      this.insuranceChargeDetails.set({});
      this.totalCharges.set(this.getTotalCharges(null, null, null))
      return;
    }
    const insuranceChargeBody = this.getFetchInsuranceChargesPayload(partyId, this.selectedShippingBillList());
    const apiCalls = [
      this.apiService.get(this.apiUrls.ENTRY_CHARGES, entryChargesBody),
      this.apiService.get(this.apiUrls.HANDLING_CHARGES, handlingChargesBody),
    ]
    if(insuranceChargeBody) {
      apiCalls.push(this.apiService.get(this.apiUrls.INSURANCE_CHARGE, {...entryChargesBody, invoiceDate: this.utilService.getDateObject(invoiceDate)}))
    }
    forkJoin(apiCalls).subscribe({
      next: ([importCharges, handlingCharges, insuranceCharges]: any) => {
        this.entryChargeDetails.set(importCharges.data[0])
        this.handlingChargeDetails.set(handlingCharges.data ?? {})
        this.insuranceChargeDetails.set(insuranceCharges ? insuranceCharges.data[0] : {})
        this.totalCharges.set(this.getTotalCharges(importCharges.data[0], handlingCharges.data ?? {}, insuranceCharges ? insuranceCharges.data[0] : {}))
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      godownInvId: new FormControl(0, []),
      invoiceType: new FormControl(this.invoiceTypes[0].value, []),
      invoiceNo: new FormControl({value: "", disabled: true}, []),
      deliveryDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      applicationNo: new FormControl("", []),
      invoiceDate: new FormControl({value: null, disabled: true}, []),
      partyId: new FormControl("", []),
      payeeId: new FormControl("", []),
      gstNo: new FormControl("", []),
      otHours: new FormControl("", []),
      paymentMode: new FormControl("", []),
      remarks: new FormControl("", []),
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
    this.form.get("invoiceDate")?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(0),
      distinctUntilChanged()
    ).subscribe(() => {
      this.fetchCharges()
    });
    this.form.get("applicationNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe((applicationNo) => {
        const application = this.applicationList().find(a => a.stuffingReqNo === applicationNo);
        this.form.get("invoiceDate")?.setValue(this.utilService.getNgbDateObject(application?.stuffingDate));
        this.getShippingList(application?.stuffingReqId)
        this.resetDetails()
      })
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload(this.form.getRawValue(), this.entryChargeDetails(), this.handlingChargeDetails(), this.insuranceChargeDetails(), this.selectedShippingBillList(), this.partyList());
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Godown invoice saved successfully");
          this.table.reload();
          this.makeForm();
          this.resetDetails()
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  resetDetails() {
    this.entryChargeDetails.set({})
    this.handlingChargeDetails.set({})
    this.insuranceChargeDetails.set({})
    this.selectedShippingBillSet().clear();
    this.selectedShippingBillList.set([]);
    this.shippingBillList.set([])
    this.totalCharges.set({});
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateSelectedShippingBillList(isFetchChargeRequired = true) {
    const selectedShippingBillList: any[] = [];
    this.shippingBillList().forEach((container: any) => {
      if(this.selectedShippingBillSet().has(this.getContainerSBNo(container))) {
        selectedShippingBillList.push({...container});
      }
    })
    this.selectedShippingBillList.set(selectedShippingBillList);
    if (isFetchChargeRequired) {
      this.fetchCharges()
    }
  }

  openSelectContainersModal() {
    const modalRef = this.modalService.open(SelectShippingBillComponent, {modalDialogClass: 'list-container-modal', backdrop : 'static', keyboard : false});
    modalRef.componentInstance.records.set(this.shippingBillList());
    modalRef.componentInstance.getContainerSBNo = this.getContainerSBNo;
    modalRef.componentInstance.selectedShippingBillSet.set(this.selectedShippingBillSet());
    modalRef.componentInstance.selectionChange.subscribe((container: any) => {
      const containerOblNo = this.getContainerSBNo(container);
      if(this.selectedShippingBillSet().has(containerOblNo)) {
        this.selectedShippingBillSet().delete(containerOblNo);
      } else {
        this.selectedShippingBillSet().add(containerOblNo);
      }
      this.updateSelectedShippingBillList()
    })
  }

  print(record: any) {
    if(this.printInProgress[record.godownInvId]) return;
    this.printInProgress[record.godownInvId] = true;
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    this.apiService.get(this.apiUrls.INVOICE_DETAILS, {InvoiceNo: record.invoiceNo}).subscribe({
      next: (response: any) => {
        this.pdfData.set({...response.data, header: record});
        setTimeout(() => {
          this.printInProgress[record.godownInvId] = false;
          this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
          this.cdr.detectChanges()
          this.printService.print(this.invoiceSection, record.invoiceNo, INVOICE_CSS);
        }, 10)
      }, error: () => {
        this.printInProgress[record.godownInvId] = false;
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
