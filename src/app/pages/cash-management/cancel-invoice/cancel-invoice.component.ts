import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService, UtilService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {DataTableComponent} from "../../../components";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {CANCEL_INVOICE_DATA} from "./cancel-invoice-data";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-cancel-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteComponent, NgbInputDatepicker, DataTableComponent],
  templateUrl: './cancel-invoice.component.html',
  styleUrls: ['./cancel-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelInvoiceComponent implements OnDestroy {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);
  utilService = inject(UtilService);

  readonly headers = DATA_TABLE_HEADERS.CASH_MANAGEMENT.CANCEL_INVOICE
  readonly apiUrls = API.CASH_MANAGEMENT.CANCEL_INVOICE;
  readonly cancelReasons = CANCEL_INVOICE_DATA.cancelReasons;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  invoiceList = signal<any[]>([]);
  partyList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setHeaderCallbacks();
    this.getInvoiceList();
    this.getPartyList();
    this.makeForm();
  }

  getInvoiceList() {
    this.apiService.get(this.apiUrls.INVOICE_LIST).subscribe({
      next: (response: any) => {
        this.invoiceList.set(response.data)
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

  makeForm() {
    this.form = new FormGroup({
      invId: new FormControl(0, []),
      invoiceDate: new FormControl({value: "", disabled: true}, []),
      invoiceNo: new FormControl({value: "", disabled: true}, []),
      partyId: new FormControl({value: null, disabled: true}, []),
      amount: new FormControl({value: null, disabled: true}, []),
      cancelReason: new FormControl("", []),
      remarks: new FormControl("", []),
    })
    this.form.get("invId")?.valueChanges.
    pipe(
      takeUntil(this.destroy$),
      debounceTime(0),
      distinctUntilChanged()
    ).
    subscribe((invId) => {
      const invoice = this.invoiceList().find(invoice => invoice.yardInvId === invId);
      this.form.get("invoiceDate")?.setValue(this.utilService.getNgbDateObject(invoice.invoiceDate));
      this.form.get("partyId")?.setValue(invoice.partyId);
      this.form.get("invoiceNo")?.setValue(invoice.invoiceNo);
      this.apiService.get(this.apiUrls.INVOICE_DETAILS, {invoiceNo: invoice.invoiceNo}).subscribe({
        next: (response: any) => {
          const total = response.data.charges?.reduce((acc: number, charge: any)=> acc + (charge.total ?? 0), 0 )
          this.form.get("amount")?.setValue(Math.ceil(total || null))
        }
      })
    })
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
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
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Invoice cancelled saved successfully");
          this.getInvoiceList()
          this.table.reload();
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
    return {...value, amount: `${value.amount}`, cancelledDate: this.utilService.getDateObject(this.utilService.getNgbDateObject(new Date()))};
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
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
