import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {COMMODITY_DATA} from "../../master/commodity/commodity.data";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
        let slNo = 0;
        response.data.sort((a: any, b: any) => a.slNo - b.slNo).forEach((detail: any) => {
          this.createCreditNoteDetailGroup({}, detail)
          total += detail.totalAmount;
          slNo += 1
          charges.push({
            slNo: slNo,
            sacCode: detail.sac,
            taxableAmt: detail.inv_Amount,
            cgstRate: detail.cgstPercent,
            cgstAmt: detail.cgstAmount,
            sgstRate: detail.sgstPercent,
            sgstAmt: detail.sgstAmount,
            igstRate: detail.igstPercent,
            igstAmt: detail.igstAmount,
            total: detail.totalAmount,
          })
        })
        // this.total.set(total)
        // this.roundedTotal.set(Math.ceil(total))
        // this.roundOff.set(Math.ceil(total) - total)
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
    let slNo = 0;
    this.getCreditNoteDetailGroup().clear()
    data.containerCharges.forEach((container: any) => {
      container.charges.forEach((charge: any) => {
        slNo += 1;
        charge.slNo = slNo;
        this.createCreditNoteDetailGroup(charge)
      })
    })
    this.chargeDetails.set(data)
  }

  getCreditNoteDetailGroup() {
    return this.form.get('creditNoteDetailList') as FormArray;
  }

  createCreditNoteDetailGroup(charge?:any, detail?: any) {
    this.getCreditNoteDetailGroup().push(new FormGroup({
      slNo: new FormControl(detail?.slNo ?? charge.slNo, []),
      creditNoteDetailId: new FormControl(detail?.id ?? 0, []),
      creditNoteId: new FormControl(detail?.addId ?? 0, []),
      chargesTypeId: new FormControl(detail?.chargesTypeId ?? 0, []),
      chargeType: new FormControl(detail?.chargeType ?? charge?.chargeCode ?? '', []),
      chargeName: new FormControl(detail?.chargeName ?? charge?.descripton ?? '', []),
      sacCode: new FormControl(detail?.sacCode ?? charge.sacCode, []),
      quantity: new FormControl(detail?.quantity ?? charge.quantity ?? 0, []),
      rate: new FormControl(detail?.rate ?? charge.rate, []),
      inv_Amount: new FormControl(detail?.inv_Amount ?? charge.taxableAmt, []),
      taxable: new FormControl(detail?.taxable ?? null, charge.taxableAmt ? [Validators.required] : []),
      cgstPer: new FormControl(detail?.cgstPer ?? charge.cgstRate, []),
      cgstAmt: new FormControl(detail?.cgstAmt ?? 0, []),
      sgstPer: new FormControl(detail?.sgstPer ?? charge.sgstRate, []),
      sgstAmt: new FormControl(detail?.sgstAmt ?? 0, []),
      igstPer: new FormControl(detail?.igstPer ?? charge.igstRate, []),
      igstAmt: new FormControl(detail?.igstAmt ?? 0, []),
      total: new FormControl(detail?.total ?? 0, []),
      particulars: new FormControl(detail?.particulars ?? charge.descripton, []),
      isActive: new FormControl(detail?.isActive ?? true, []),
    }))
    this.updateCalculation(this.getCreditNoteDetailGroup().length - 1)
  }

  getFormValue(controlName: string, index: number) {
    const form = this.getCreditNoteDetailGroup().at(index) as FormGroup;
    return form.get(controlName)?.value || 0;
  }

  updateCalculation(index: number) {
    const form = this.getCreditNoteDetailGroup().at(index) as FormGroup;
    const value = form.get("taxable")?.value || 0;

    const cgst = form.get("cgstPer")?.value
    const sgst = form.get("sgstPer")?.value
    const igst = form.get("igstPer")?.value

    const cgstAmount = (value * cgst / 100)
    const sgstAmount = (value * sgst / 100)
    const igstAmount = (value * igst / 100)

    const total = +(value + cgstAmount + sgstAmount + igstAmount).toFixed(2);

    form.get("cgstAmt")?.setValue(cgstAmount);
    form.get("sgstAmt")?.setValue(sgstAmount);
    form.get("igstAmt")?.setValue(igstAmount);
    form.get("total")?.setValue(total || null);

    this.updateGrandTotal()
  }

  updateGrandTotal() {
    let totalAmount = 0;
    for(let i = 0; i < this.getCreditNoteDetailGroup().length - 1; i++) {
      const form = this.getCreditNoteDetailGroup().at(i) as FormGroup;
      totalAmount += form.get("total")?.value || 0;
    }
    const grandTotal = Math.ceil(totalAmount);
    const roundOff = +(grandTotal - totalAmount).toFixed(2);
    this.total.set(totalAmount)
    this.roundedTotal.set(grandTotal)
    this.roundOff.set(roundOff)
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
    return {
      ...value,
      taxInvoice: true,
      billOfSupply: true,
      payeeId: 0,
      gstNo: this.chargeDetails()?.partyGST ?? '',
      placeOfSupply: this.chargeDetails()?.placeOfSupply ?? '',
      isYard: true,
      isImport: true,
      isSAP: 0,
      saP_DOC_NUMBER: "",
      createdBy: 0,
      updatedBy: 0,
      createdAt: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
      updatedAt: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date())),
      creditNoteDate: this.utilService.getDateObject(value.creditNoteDate),
      creditNoteDetailList: this.getCreditNoteDetailGroup().getRawValue().filter(x => x.inv_Amount)
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
