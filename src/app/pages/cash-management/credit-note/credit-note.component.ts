import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {COMMODITY_DATA} from "../../master/commodity/commodity.data";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-credit-note',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule, AutoCompleteComponent, NgbInputDatepicker],
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditNoteComponent implements OnDestroy {
  utilService = inject(UtilService);
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.CASH_MANAGEMENT.CREDIT_NOTE
  readonly apiUrls = API.CASH_MANAGEMENT.CREDIT_NOTE;
  readonly commodityTypes = COMMODITY_DATA.commodityTypes;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  partyList = signal<any[]>([]);
  invoiceList = signal<any[]>([]);
  chargeDetails = signal<any>({})
  total = signal(0)
  roundedTotal = signal(0)
  roundOff = signal(0)

  private readonly destroy$ = new Subject<void>();

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setHeaderCallbacks();
    this.getInvoiceList()
    this.getPartyList()
    this.makeForm();
  }

  getCreditNoteDetails(id: number) {
    this.getCreditNoteDetailGroup().clear()
    this.apiService.get(this.apiUrls.DETAILS, {creditNoteId: id}).subscribe({
      next: (response: any) => {
        const charges: any[] = []
        let total = 0;
        response.data.sort((a: any, b: any) => a.slNo - b.slNo).forEach((detail: any) => {
          this.createCreditNoteDetailGroup({}, detail)
          total += detail.totalAmount;
          charges.push({
            slNo: detail.slNo,
            sacCode: detail.sac,
            taxableAmt: detail.value,
            cgstRate: detail.cgstPercent,
            cgstAmt: detail.cgstAmount,
            sgstRate: detail.sgstPercent,
            sgstAmt: detail.sgstAmount,
            igstRate: detail.igstPercent,
            igstAmt: detail.igstAmount,
            total: detail.totalAmount,
          })
        })
        this.total.set(total)
        this.roundedTotal.set(Math.ceil(total))
        this.roundOff.set(Math.ceil(total) - total)
        this.chargeDetails.set({containerCharges: [{charges}]});
        this.form.disable()
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

  getInvoiceList() {
    this.apiService.get(this.apiUrls.INVOICE_LIST).subscribe({
      next: (response: any) => {
        this.invoiceList.set(response.data)
      }
    })
  }

  getYardInvoiceCharges(invoiceNo: string) {
    this.apiService.get(this.apiUrls.YARD_INVOICE_DETAILS, {invoiceNo: invoiceNo}).subscribe({
      next: (response: any) => {
        this.setInvoiceDetails(response.data)
      }
    })
  }

  getGodownInvoiceCharges(invoiceNo: string) {
    this.apiService.get(this.apiUrls.GODOWN_INVOICE_DETAILS, {invoiceNo: invoiceNo}).subscribe({
      next: (response: any) => {
        this.setInvoiceDetails(response.data)
      }
    })
  }

  setInvoiceDetails(data: any) {
    let total = 0;
    let slNo = 0;
    this.getCreditNoteDetailGroup().clear()
    data.containerCharges.forEach((container: any) => {
      container.charges.forEach((charge: any) => {
        total += charge.total;
        slNo += 1;
        charge.slNo = slNo;
        this.createCreditNoteDetailGroup(charge)
      })
    })
    this.total.set(total)
    this.roundedTotal.set(Math.ceil(total))
    this.roundOff.set(Math.ceil(total) - total)
    this.chargeDetails.set(data)
  }

  getCreditNoteDetailGroup() {
    return this.form.get('creditNoteDetailList') as FormArray;
  }

  createCreditNoteDetailGroup(charge?:any, detail?: any) {
    this.getCreditNoteDetailGroup().push(new FormGroup({
      creditNoteDetailId: new FormControl(detail?.id ?? 0, []),
      creditNoteId: new FormControl(detail?.addId ?? 0, []),
      slNo: new FormControl(detail?.slNo ?? charge.slNo, []),
      sac: new FormControl(detail?.sac ?? charge.sacCode, []),
      value: new FormControl(detail?.value ?? charge.taxableAmt, []),
      cgstPercent: new FormControl(detail?.cgstPercent ?? charge.cgstRate, []),
      cgstAmount: new FormControl(detail?.cgstAmount ?? charge.cgstAmt, []),
      sgstPercent: new FormControl(detail?.sgstPercent ?? charge.sgstRate, []),
      sgstAmount: new FormControl(detail?.sgstAmount ?? charge.sgstAmt, []),
      igstPercent: new FormControl(detail?.igstPercent ?? charge.igstRate, []),
      igstAmount: new FormControl(detail?.igstAmount ?? charge.igstAmt, []),
      totalAmount: new FormControl(detail?.totalAmount ?? charge.total, []),
      roundOff: new FormControl(detail?.roundOff ?? +(Math.ceil(charge.total) - charge.total).toFixed(2), []),
      grandTotal: new FormControl(detail?.grandTotal ?? Math.ceil(charge.total), []),
      particulars: new FormControl(detail?.particulars ?? "", []),
      returnValue: new FormControl(detail?.returnValue ?? null, []),
      isActive: new FormControl(detail?.isActive ?? true, []),
    }))
  }

  makeForm() {
    this.form = new FormGroup({
      creditNoteId: new FormControl(0, []),
      creditNoteNo: new FormControl("", []),
      creditNoteDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
      invoiceNo: new FormControl(this.commodityTypes[0].value, []),
      partyId: new FormControl("", []),
      remarks: new FormControl("", []),
      creditNoteDetailList: new FormArray([])
    })
    this.form.get("invoiceNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe((invoiceNo) => {
        if(!this.isViewMode()) {
          const invoice = this.invoiceList().find(invoice => invoice.invoiceNo === invoiceNo);
          this.chargeDetails.set({})
          if(invoiceNo) {
            if(invoiceNo.startsWith("G")) {
              this.getGodownInvoiceCharges(invoiceNo)
            } else {
              this.getYardInvoiceCharges(invoiceNo)
            }
          }
          this.form.get("partyId")?.setValue(invoice?.partyId);
        }
      })
    this.makeDisableFields()
  }

  makeDisableFields() {
    ["creditNoteNo", "partyId"].forEach(field => {
      this.form.get(field)?.disable();
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    this.total.set(0)
    this.roundedTotal.set(Math.ceil(0))
    this.roundOff.set(0)
    this.chargeDetails.set({});
    record.creditNoteDate = this.utilService.getNgbDateObject(record.creditNoteDate);
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
    this.makeDisableFields()
    this.getCreditNoteDetails(record.creditNoteId);
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
    this.makeDisableFields()
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Credit note saved successfully");
          this.table.reload();
          this.makeForm();
          this.getInvoiceList()
          this.total.set(0)
          this.roundedTotal.set(Math.ceil(0))
          this.roundOff.set(0)
          this.chargeDetails.set({});
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    const value = {...this.form.getRawValue()};
    return {...value, creditNoteDate: this.utilService.getDateObject(value.creditNoteDate), creditNoteDetailList: this.getCreditNoteDetailGroup().getRawValue().map(
        data => ({
          ...data,
          createdDate: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
          createdBy: "",
          updatedDate: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
          updatedBy: "",
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
