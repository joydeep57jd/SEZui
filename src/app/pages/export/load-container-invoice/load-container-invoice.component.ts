import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DATA_TABLE_HEADERS} from "../../../lib";
import {debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {INVOICE_CSS} from "../../../lib/constants/invoice-css";
import {LoadContainerInvoiceHelper} from "./load-container-invoice-helper";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {TableComponent} from "../../../components/table/table.component";
import {SelectContainersComponent} from "./select-containers/select-containers.component";

@Component({
  selector: 'app-load-container-invoice',
  standalone: true,
  imports: [CommonModule, AutoCompleteComponent, DataTableComponent, NgbInputDatepicker, ReactiveFormsModule, TableComponent],
  templateUrl: './load-container-invoice.component.html',
  styleUrls: ['./load-container-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadContainerInvoiceComponent extends LoadContainerInvoiceHelper implements OnDestroy {

  readonly headers = DATA_TABLE_HEADERS.EXPORT.LOAD_CONTAINER_INVOICE.MAIN
  readonly yardInvoicePreviewHeaders = DATA_TABLE_HEADERS.EXPORT.LOAD_CONTAINER_INVOICE.LOAD_CONTAINER_INVOICE_PREVIEW
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  selectedContainerSet = signal<Set<string>>(new Set());
  selectedContainerList = signal<any[]>([]);
  chargeDetails = signal<any>({});
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
    this.getContainerRequestList()
    this.getPortList()
    this.getEximTraderList();
    this.getPartyList();
    this.makeForm();
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
  }

  fetchCharges() {
    const body = this.getFetchChargesPayload(this.form.get("partyId")?.value, this.selectedContainerList());
    const invoiceDate = this.form.get("invoiceDate")?.value;
    if(!body) {
      this.chargeDetails.set({});
      this.handlingChargeDetails.set({});
      this.insuranceChargeDetails.set({});
      this.totalCharges.set(this.getTotalCharges(null, null, null))
      return;
    }
    const application = this.containerRequestList().find(containerRequest => containerRequest.loadContReqId === this.form.value?.applicationId);
    const containerObList = body.containerList.split(",").map((containerNo: string) => `${containerNo}#${application?.loadContReqNo ?? ""}`).join(",");
    forkJoin([
      this.apiService.get(this.apiUrls.IMPORT_CHARGES, body),
      this.apiService.get(this.apiUrls.HANDLING_CHARGES, {...body, ContainerOBLList: containerObList}),
      this.apiService.get(this.apiUrls.INSURANCE_CHARGE, {...body, invoiceDate: this.utilService.getDateObject(invoiceDate)}),
    ]).subscribe({
      next: ([importCharges, handlingCharges, insuranceCharges]: any) => {
        this.chargeDetails.set(importCharges.data[0])
        this.handlingChargeDetails.set(handlingCharges.data)
        this.insuranceChargeDetails.set(insuranceCharges.data[0])
        this.totalCharges.set(this.getTotalCharges(importCharges.data[0], handlingCharges.data, insuranceCharges.data[0]))
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      godownInvId: new FormControl(0, []),
      invoiceType: new FormControl(this.invoiceTypes[0].value, []),
      invoiceNo: new FormControl("", []),
      deliveryDate: new FormControl(null, []),
      applicationId: new FormControl(null, []),
      invoiceDate: new FormControl({value: this.utilService.getNgbDateObject(new Date()), disabled: true}, []),
      partyId: new FormControl("", []),
      payeeId: new FormControl("", []),
      gstNo: new FormControl("", []),
      moveToId: new FormControl(null, []),
      placeOfSupply: new FormControl("", []),
      sez: new FormControl("", []),
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
        this.form.get("placeOfSupply")?.setValue(eximTrader?.stateName ?? "");
        this.fetchCharges()
      })
    this.form.get("applicationId")?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(0),
      distinctUntilChanged()
    ).subscribe(applicationId => {
      this.resetValue()
      const application = this.containerRequestList().find(containerRequest => containerRequest.loadContReqId === applicationId);
      this.getContainerList(application.loadContReqNo)
      this.form.get("deliveryDate")?.setValue(this.utilService.getNgbDateObject(application.loadContReqDate));
    });
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
      const data = this.makePayload(this.form.getRawValue(), this.chargeDetails(), this.handlingChargeDetails(), this.insuranceChargeDetails(), this.selectedContainerList(), this.partyList());
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Load container invoice saved successfully");
          this.table.reload();
          this.makeForm();
          this.resetValue()
          this.getContainerRequestList()
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  resetValue() {
    this.chargeDetails.set({})
    this.handlingChargeDetails.set({})
    this.insuranceChargeDetails.set({})
    this.selectedContainerSet().clear();
    this.selectedContainerList.set([]);
    this.containerList.set([])
    this.totalCharges.set({});
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateSelectedContainerList(isFetchChargeRequired = true) {
    const selectedContainerList: any[] = [];
    this.containerList().forEach((container: any) => {
      if(this.selectedContainerSet().has(container.containerNo)) {
        selectedContainerList.push(container);
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
    modalRef.componentInstance.selectedContainerSet.set(this.selectedContainerSet());
    modalRef.componentInstance.selectionChange.subscribe((container: any) => {
      const containerNo = container.containerNo;
      if(this.selectedContainerSet().has(containerNo)) {
        this.selectedContainerSet().delete(containerNo);
      } else {
        this.selectedContainerSet().add(containerNo);
      }
      this.updateSelectedContainerList()
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
}
