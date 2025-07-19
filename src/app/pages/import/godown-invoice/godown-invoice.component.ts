import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, inject,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DATA_TABLE_HEADERS} from "../../../lib";
import {debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {INVOICE_CSS} from "../../../lib/constants/invoice-css";
import {GodownInvoiceHelper} from "./godown-invoice-helper";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {TableComponent} from "../../../components/table/table.component";
import {SelectOblsComponent} from "./select-obls/select-obls.component";
import {GodownInvoiceVoucherComponent} from "./godown-invoice-voucher/godown-invoice-voucher.component";

@Component({
  selector: 'app-godown-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent, AutoCompleteComponent, NgbInputDatepicker, TableComponent, GodownInvoiceVoucherComponent],
  templateUrl: './godown-invoice.component.html',
  styleUrls: ['./godown-invoice.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GodownInvoiceComponent extends GodownInvoiceHelper implements OnDestroy {
  datePipe = inject(DatePipe);

  readonly headers = DATA_TABLE_HEADERS.IMPORT.GODOWN_INVOICE.MAIN
  readonly godownInvoicePreviewHeaders = DATA_TABLE_HEADERS.IMPORT.GODOWN_INVOICE.GODOWN_INVOICE_PREVIEW
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  selectedOblSet = signal<Set<string>>(new Set());
  selectedOblList = signal<any[]>([]);
  insuredOblSet = signal<Set<string>>(new Set());
  chargeDetails = signal<any>({});
  storageChargeDetails = signal<any>({});
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
    this.getCustomAppraisementList()
    this.getEximTraderList();
    this.getPartyList();
    this.makeForm();
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
  }

  fetchCharges() {
    const partyId = this.form.get("partyId")?.value;
    const body = this.getFetchChargesPayload(partyId, this.selectedOblList());
    const invoiceDate = this.form.get("invoiceDate")?.value;
    if(!body || !invoiceDate) {
      this.chargeDetails.set({});
      this.storageChargeDetails.set({});
      this.insuranceChargeDetails.set({});
      this.totalCharges.set(this.getTotalCharges(null, null, null))
      return;
    }
    const insuranceChargeBody = this.getFetchInsuranceChargesPayload(partyId, this.selectedOblList());
    const apiCalls = [
      this.apiService.post(this.apiUrls.IMPORT_CHARGES, body),
      this.apiService.post(this.apiUrls.STORAGE_CHARGES, {...body, invoiceDate: this.utilService.getDateObject(invoiceDate)}),
    ]
    if(insuranceChargeBody) {
      apiCalls.push(this.apiService.post(this.apiUrls.INSURANCE_CHARGE, {...body, invoiceDate: this.utilService.getDateObject(invoiceDate)}))
    }
    forkJoin(apiCalls).subscribe({
      next: ([importCharges, storageCharges, insuranceCharges]: any) => {
        this.chargeDetails.set(importCharges.data[0])
        this.storageChargeDetails.set(storageCharges.data[0])
        this.insuranceChargeDetails.set(insuranceCharges ? insuranceCharges.data[0] : {})
        this.totalCharges.set(this.getTotalCharges(importCharges.data[0], storageCharges.data[0], insuranceCharges ? insuranceCharges.data[0] : {}))
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
      invoiceDate: new FormControl(this.utilService.getNgbDateObject(new Date()), []),
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
        const application = this.applicationList().find(a => a.deliveryNo === applicationNo);
        this.getOblList(application?.deliveryId)
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
      const data = this.makePayload(this.form.getRawValue(), this.chargeDetails(), this.storageChargeDetails(), this.insuranceChargeDetails(), this.selectedOblList(), this.partyList());
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
    this.chargeDetails.set({})
    this.storageChargeDetails.set({})
    this.insuranceChargeDetails.set({})
    this.selectedOblSet().clear();
    this.selectedOblList.set([]);
    this.insuredOblSet().clear();
    this.oblList.set([])
    this.totalCharges.set({});
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateSelectedOblList(isFetchChargeRequired = true) {
    const selectedOblList: any[] = [];
    this.oblList().forEach((container: any) => {
      if(this.selectedOblSet().has(this.getContainerOblNo(container))) {
        selectedOblList.push({...container, isInsured: this.insuredOblSet().has(this.getContainerOblNo(container))});
      }
    })
    this.selectedOblList.set(selectedOblList);
    if (isFetchChargeRequired) {
      this.fetchCharges()
    }
  }

  openSelectContainersModal() {
    const modalRef = this.modalService.open(SelectOblsComponent, {modalDialogClass: 'list-container-modal', backdrop : 'static', keyboard : false});
    modalRef.componentInstance.records.set(this.oblList());
    modalRef.componentInstance.getContainerOblNo = this.getContainerOblNo;
    modalRef.componentInstance.selectedOblSet.set(this.selectedOblSet());
    modalRef.componentInstance.insuredOblSet.set(this.insuredOblSet());
    modalRef.componentInstance.selectionChange.subscribe((container: any) => {
      const containerOblNo = this.getContainerOblNo(container);
      if(this.selectedOblSet().has(containerOblNo)) {
        this.selectedOblSet().delete(containerOblNo);
      } else {
        this.selectedOblSet().add(containerOblNo);
      }
      this.updateSelectedOblList()
    })
    modalRef.componentInstance.updateInsured.subscribe((container: any) => {
      const containerOblNo = this.getContainerOblNo(container);
      if(this.insuredOblSet().has(containerOblNo)) {
        this.insuredOblSet().delete(containerOblNo);
      } else {
        this.insuredOblSet().add(containerOblNo);
      }
      this.updateSelectedOblList()
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
