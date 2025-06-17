import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService, UtilService} from "../../../services";
import {API} from "../../../lib";
import {DataTableComponent} from "../../../components";
import {YARD_INVOICE_DATA} from "./yard-invoice-data";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-yard-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbInputDatepicker, AutoCompleteComponent],
  templateUrl: './yard-invoice.component.html',
  styleUrls: ['./yard-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YardInvoiceComponent implements OnDestroy {
  apiService = inject(ApiService);
  utilService = inject(UtilService)
  toasterService = inject(ToastService);

  readonly apiUrls = API.IMPORT.YARD_INVOICE;
  readonly invoiceTypes = YARD_INVOICE_DATA.invoiceTypes;
  readonly destuffingTypes = YARD_INVOICE_DATA.destuffingTypes;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  partyList = signal<any[]>([]);
  eximTraderMap = signal<Map<number, any>>(new Map());
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getPartyList();
    this.getEximTraderList();
    this.makeForm();
  }

  getPartyList() {
    this.apiService.get(API.MASTER.PARTY.LIST).subscribe({
      next: (response: any) => {
        this.partyList.set(response.data)
      }
    })
  }

  getEximTraderList() {
    this.apiService.get(API.MASTER.EXIM_TRADER.LIST).subscribe({
      next: (response: any) => {
        const eximTraderMap = new Map<number, any>();
        response.data.forEach((eximTrader: any) => {
          eximTraderMap.set(eximTrader.traderId, eximTrader);
        })
        this.eximTraderMap.set(eximTraderMap)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      yardInvId: new FormControl(0, []),
      invoiceType: new FormControl(this.invoiceTypes[0].value, []),
      invoiceNo: new FormControl("", []),
      deliveryDate: new FormControl(null, []),
      applicationNo: new FormControl("", []),
      invoiceDate: new FormControl(null, []),
      partyId: new FormControl("", []),
      payeeId: new FormControl("", []),
      gstNo: new FormControl("", []),
      paymentMode: new FormControl("", []),
      destuffingType: new FormControl(this.destuffingTypes[0].value, []),
      placeOfSupply: new FormControl("", []),
      sez: new FormControl("", []),
      otHours: new FormControl("", []),
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
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Yard invoice saved successfully");
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
    const isTaxInvoice = this.form.get("invoiceType")?.value;
    const isFactoryDestuffing = this.form.get("destuffingType")?.value;
    return {
      ...this.form.value,
      taxInvoice: isTaxInvoice,
      billOfSupply: !isTaxInvoice,
      factoryDestuffing: isFactoryDestuffing,
      directDestuffing: !isFactoryDestuffing,
      deliveryDate: this.utilService.getDateObject(this.form.value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(this.form.value.invoiceDate),
    };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
