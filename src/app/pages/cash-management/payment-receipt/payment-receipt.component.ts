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
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {TableComponent} from "../../../components/table/table.component";
import {PAYMENT_RECEIPT_DATA} from "./payment-receipt-data";
import {DataTableComponent} from "../../../components";
import {PrintService} from "../../../services/print.service";
import {PaymentReceiptInvoiceComponent} from "./payment-receipt-invoice/payment-receipt-invoice.component";
import {PAYMENT_RECEIPT_CSS} from "../../../lib/constants/payment-receipt-css";

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, AutoCompleteComponent, TableComponent, DataTableComponent, PaymentReceiptInvoiceComponent],
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentReceiptComponent implements OnDestroy{
  apiService = inject(ApiService);
  datePipe = inject(DatePipe);
  printService = inject(PrintService);
  utilService = inject(UtilService);
  toasterService = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  readonly paymentModes = PAYMENT_RECEIPT_DATA.paymentModes;
  readonly invoiceHeaders = DATA_TABLE_HEADERS.CASH_MANAGEMENT.PAYMENT_RECEIPT_INVOICE
  readonly apiUrls = API.CASH_MANAGEMENT.PAYMENT_RECEIPT;
  readonly headers = DATA_TABLE_HEADERS.CASH_MANAGEMENT.PAYMENT_RECEIPT;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  payeeList = signal<any[]>([]);
  invoiceList = signal<any[]>([]);
  isSaving = signal(false);
  totalPaymentReceipt = signal(0);
  selectedInvoiceIds = signal(new Set<number>());
  pdfData = signal<any>({});
  printInProgress: Record<string,boolean> = {};
  actionLoaders: Record<string, Record<string,boolean>> = {}

  @ViewChild(DataTableComponent) table!: DataTableComponent;
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  constructor() {
    this.setHeaderCallbacks()
    this.setPreviewHeaderCallbacks()
    this.getPartyList();
    this.makeForm();
  }

  getPartyList() {
    this.apiService.get(API.MASTER.PARTY.LIST).subscribe({
      next: (response: any) => {
        this.payeeList.set(response.data)
      }
    })
  }

  fetchInvoiceDetails() {
    const partyId = this.form.get("partyId")?.value;
    if(!partyId) {
      return;
    }
    const payeeName = this.payeeList().find((payee: any) => payee.partyId == partyId)?.partyName;
    this.apiService.get(this.apiUrls.INVOICE_LIST, {PayeeName: payeeName}).subscribe({
      next: (response: any) => {
        const group = response.data.reduce((acc: any, group: any) => {
          if(!acc[group.yardInvId]) {
            acc[group.yardInvId] = []
          }
          acc[group.yardInvId].push(group)
          return acc;
        }, {})

        const invoiceList: any[] = []
        Object.keys(group).forEach(key => {
          const total = +group[key].reduce((acc: any, invoice: any) => acc + invoice.total, 0).toFixed(2)
          const roundedTotal = Math.ceil(total)
          const added = +(roundedTotal  -  total).toFixed(2)
          invoiceList.push({...group[key][0], roundedTotal, added, total})
        })
        this.invoiceList.set(invoiceList)
      }
    })
  }

  makeForm(){
    this.form = new FormGroup({
      cashReceiptId: new FormControl(0, []),
      branchId: new FormControl(0, []),
      receiptNo: new FormControl("", []),
      receiptDate: new FormControl(null, []),
      partyId: new FormControl(null, []),
      tdsAmount: new FormControl(null, []),
      invoiceValue: new FormControl(null, []),
      totalPaymentReceipt: new FormControl(null, []),
      paymentDetails: new FormArray([]),
      remarks: new FormControl("", []),
    });
    this.form.get("partyId")?.valueChanges.
      pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      ).
    subscribe(() => {
      this.fetchInvoiceDetails()
    })
  }

  addPaymentDetails(detail?: any) {
    this.getPaymentDetailsFormGroup().push(this.createPaymentDetailsGroup(detail));
  }

  createPaymentDetailsGroup(detail?: any) {
    return new FormGroup({
      cashReceiptDtlId: new FormControl(detail?.cashReceiptDtlId ?? 0, []),
      cashReceipthdrId: new FormControl(detail?.cashReceipthdrId ?? 0, []),
      draweeBank: new FormControl(detail?.draweeBank ?? "", []),
      payMode: new FormControl(detail?.payMode ?? "", []),
      instrumentNo: new FormControl(detail?.instrumentNo ?? "", []),
      date: new FormControl(this.utilService.getNgbDateObject(detail?.date), []),
      amount: new FormControl(detail?.amount ?? null, []),
      isChqCancelled: new FormControl(detail?.isChqCancelled ?? "", []),
    })
  }

  removePaymentDetails(index: number) {
    const control = this.getPaymentDetailsFormGroup();
    control.removeAt(index);
  }

  resetPaymentDetails(){
    this.getPaymentDetailsFormGroup().clear();
  }

  getPaymentDetailsFormGroup() {
    return this.form.get('paymentDetails') as FormArray;
  }

  getPaymentDetailsFormGroupAsArray() {
    let arr: number[] = [];
    this.getPaymentDetailsFormGroup().controls.forEach((control: any, index: number) => {
      arr.push(index);
    })
    return arr;
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      this.apiService.post(this.apiUrls.SAVE, this.makePayload()).subscribe({
        next:() => {
          this.toasterService.showSuccess("Payment Receipt saved successfully");
          this.table.reload();
          this.makeForm();
          this.isSaving.set(false);
          this.selectedInvoiceIds.set(new Set<number>());
          this.invoiceList.set([]);
          this.totalPaymentReceipt.set(0);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    const partyId = this.form.get("partyId")?.value;
    const payeeName = this.payeeList().find((payee: any) => payee.partyId == partyId)?.partyName;
    return {
      "cashReceiptId": 0,
      "branchId": 0,
      "autoCashRcptNo": 0,
      "receiptNo": "string",
      "invoiceId": 0,
      "partyId": 0,
      "payByPdaId": 0,
      "pdaAdjust": 0,
      "folioNo": "string",
      "pdaAdjustedAmount": 0,
      "pdaOpening": 0,
      "pdaClosing": 0,
      "totalPaymentReceipt": 0,
      "tdsAmount": 0,
      "invoiceValue": 0,
      "compYear": "string",
      "remarks": "string",
      "pdaAccountDetailsID": 0,
      "fromPDA": "string",
      "cashReceiptHtml": "string",
      "isCancelled": 0,
      "cancelledReason": "string",
      "cancelledOn": "2025-06-19T09:37:58.362Z",
      "cancelledBy": 0,
      "invoiceDebitNote": "string",
      "onlineFacAmt": 0,
      "area": "string",
      "transId": "string",
      "isSAP": 0,
      "isSAPRev": 0,
      "saP_DOC_NUMBER": "string",
      ...this.form.value,
      payeeName,
      receiptDate: this.utilService.getDateObject(this.form.value.receiptDate),
      invoiceDetails: this.invoiceList().reduce((acc: any, record: any) => {
        if(this.selectedInvoiceIds().has(record.yardInvId)) {
          acc.push({
              "cashRcptInvDtlsId": 0,
              "cashReceiptId": 0,
              "partyId": record.payeeId,
              "invoiceId": record.yardInvId,
              "invoiceNo": record.invoiceNo,
              "invoiceDate": record.invoiceDate,
              "invoiceAmt": record.roundedTotal,
              "dueAmt": 0,
              "adjustmentAmt": 0
            }
          )
        }
        return acc;
      }, []),
      paymentDetails: this.getPaymentDetailsFormGroup().controls.map((contorl: any) => {
        return {
          ...contorl.value,
          date: this.utilService.getDateObject(contorl.value.date),
          "cashReceiptDtlId": 0,
          "cashReceipthdrId": 0,
          "isChqCancelled": "string",
        }
      })
    }
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateTotalPaymentReceipt() {
    this.totalPaymentReceipt.set(this.getPaymentDetailsFormGroup().controls.reduce((acc: any, control: any) => acc + control.value.amount, 0))
  }

  updateTotalValue() {
    const roundedTotal = this.invoiceList().reduce((acc: number, record: any) => {
      if(this.selectedInvoiceIds().has(record.yardInvId)) {
        acc += record.roundedTotal;
      }
      return acc;
    }, 0)
    console.log(roundedTotal, this.invoiceList(), this.selectedInvoiceIds())
    this.form.get("invoiceValue")?.setValue(roundedTotal)
    this.updateTotalPayableAmount()
  }

  updateTotalPayableAmount() {
    const tdsAmount = this.form.get("tdsAmount")?.value;
    const totalValue = this.form.get("invoiceValue")?.value;
    const totalPayableAmount = +(totalValue + tdsAmount).toFixed(2);
    this.form.get("totalPaymentReceipt")?.setValue(totalPayableAmount)
  }

  print(record: any) {
    if(this.printInProgress[record.cashReceiptId]) return;
    this.printInProgress[record.cashReceiptId] = true;
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    this.apiService.get(this.apiUrls.PAYMENT_RECEIPT_DETAILS, {CashReceiptId: record.cashReceiptId}).subscribe({
      next: (response: any) => {
        this.pdfData.set({
          header: {...record,  invoiceNo: this.invoiceList().find(invoice => invoice.yardInvId === record.invoiceId)?.invoiceNo},
          details: response.data
        })
        setTimeout(() => {
          this.printInProgress[record.cashReceiptId] = false;
          this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
          this.cdr.detectChanges()
          this.printService.print(this.invoiceSection, record.receiptNo, PAYMENT_RECEIPT_CSS);
        }, 10)
      }, error: () => {
        this.printInProgress[record.cashReceiptId] = false;
        this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
        this.cdr.detectChanges()
      }
    });
  }

  select(record: any, index?: number) {
    const currentSet = this.selectedInvoiceIds();
    if(currentSet.has(record.yardInvId)) {
      currentSet.delete(record.yardInvId)
    } else {
      currentSet.add(record.yardInvId)
    }
    this.selectedInvoiceIds.set(currentSet)
    this.updateTotalValue()
  }

  setPreviewHeaderCallbacks() {
    this.invoiceHeaders.forEach(header => {
      if(header.field === "select") {
        header.callback = this.select.bind(this);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
