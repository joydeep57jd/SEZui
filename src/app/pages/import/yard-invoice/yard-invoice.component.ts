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
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {DataTableComponent} from "../../../components";
import {YARD_INVOICE_DATA} from "./yard-invoice-data";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  Observable, of,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import {SelectContainersComponent} from "./select-containers/select-containers.component";
import {TableComponent} from "../../../components/table/table.component";
import {YardInvoiceHelper} from "./yard-invoice-helper";
import {PrintService} from "../../../services/print.service";
import {YardInvoiceVoucherComponent} from "./yard-invoice-voucher/yard-invoice-voucher.component";
import {INVOICE_CSS} from "../../../lib/constants/invoice-css";

@Component({
  selector: 'app-yard-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbInputDatepicker, AutoCompleteComponent, TableComponent, DataTableComponent, YardInvoiceVoucherComponent],
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
  readonly sezTypes = YARD_INVOICE_DATA.sezTypes;
  readonly yardInvoicePreviewHeaders = DATA_TABLE_HEADERS.IMPORT.YARD_INVOICE.YARD_INVOICE_PREVIEW
  readonly headers = DATA_TABLE_HEADERS.IMPORT.YARD_INVOICE.MAIN

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  selectedContainerSet = signal<Set<string>>(new Set());
  insuredContainerSet = signal<Set<string>>(new Set());
  selectedContainerList = signal<any[]>([]);
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
    this.getCustomAppraisementList()
    this.getPartyList();
    this.getEximTraderList();
    this.makeForm();
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    this.fetChargesCalculation()
  }

  fetChargesCalculation() {
    this.fetchChargesParams$.pipe(
      takeUntil(this.destroy$),
      filter(payload => !!payload),
      debounceTime(0),
      distinctUntilChanged(),
      tap(() => this.isChargesFetching.set(true)),
      switchMap(params => this.getFetchChargesObservable(params)),
    ).subscribe({
      next: (response: any) => {
        switch (this.gateInDetails().operationType) {
          case this.operationTypes[1].value:
            const entryCharge = response[0]?.data[0] ?? {};
            this.chargeDetails.set(entryCharge)
            break;
          case this.operationTypes[2].value:
              const transportCharge = response[0];
              this.transportChargeDetails.set(transportCharge)
            break;
          default:
            break;
        }
        // const entryCharge = response[0]?.data[0] ?? {};
        // this.chargeDetails.set(entryCharge)
        // if(this.fetchChargesParams$.value.transportParams) {
        //   const transportCharge = response[1];
        //   this.transportChargeDetails.set(transportCharge)
        // }
        // if(this.fetchChargesParams$.value.insuredParams) {
        //   const insuranceCharge = response[response.length - 1]?.data[0];
        //   this.insuranceChargeDetails.set(insuranceCharge)
        // }
        this.totalCharges.set(this.getTotalCharges());
        this.isChargesFetching.set(false);
      }, error: () => {
        this.isChargesFetching.set(false);
      }
    })
  }

  getFetchChargesObservable(params: any) {
    const observables: Observable<any>[] = []
    this.chargeDetails.set({})
    this.insuranceChargeDetails.set({})
    this.transportChargeDetails.set({})
    console.log(this.gateInDetails().operationType)
    switch (this.gateInDetails().operationType) {
      case this.operationTypes[1].value:
        observables.push(this.apiService.post(this.apiUrls.IMPORT_CHARGES, params.entryParams))
        break;
      case this.operationTypes[2].value:
        observables.push(this.apiService.get(this.apiUrls.TRANSPORTATION_CHARGES, params.transportParams))
        break;
      default:
        break;
    }
    // observables.push(this.apiService.post(this.apiUrls.IMPORT_CHARGES, params.entryParams))
    // if(params.transportParams) {
    //   observables.push(this.apiService.get(this.apiUrls.TRANSPORTATION_CHARGES, params.transportParams))
    // }
    // if(params.insuredParams) {
    //   observables.push(this.apiService.post(this.apiUrls.INSURANCE_CHARGE, params.insuredParams))
    // }
    return observables.length > 0 ? forkJoin(observables) : of([]);
  }

  get isInsuranceChargeHaveValues() {
    return Object.keys(this.insuranceChargeDetails()).length;
  }

  makeForm() {
    this.form = new FormGroup({
      yardInvId: new FormControl(0, []),
      invoiceType: new FormControl(this.invoiceTypes[0].value, []),
      invoiceNo: new FormControl("", []),
      deliveryDate: new FormControl({value: this.utilService.getNgbDateObject(new Date()), disabled: true}, []),
      applicationId: new FormControl(null, []),
      invoiceDate: new FormControl({value: null, disabled: true}, []),
      partyId: new FormControl("", []),
      payeeId: new FormControl("", []),
      gstNo: new FormControl("", []),
      paymentMode: new FormControl("", []),
      destuffingType: new FormControl(this.destuffingTypes[0].value, []),
      examinationType: new FormControl(this.examinationTypes[0].value, []),
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
        this.form.get("placeOfSupply")?.setValue(eximTrader?.stateName ?? "");
        this.updateFetchChargesParams(this.form.getRawValue(), this.selectedContainerList());
      })

      this.form.get("transportationChargeType")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.updateFetchChargesParams(this.form.getRawValue(), this.selectedContainerList());
      })

    this.form.get("applicationId")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe((applicationId) => {
        const application = this.applicationList().find(application => application.id === applicationId);
        this.form.get("invoiceDate")?.setValue(application ? this.utilService.getNgbDateObject(application?.appraisementDate) : null);
        this.updateFetchChargesParams(this.form.getRawValue(), this.selectedContainerList());
        this.getContainerList(application.appraisementNo);
        this.resetDetails()
      })
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = await this.makePayload(this.form.getRawValue(), this.selectedContainerList(), this.partyList());
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Yard invoice saved successfully");
          this.table.reload();
          this.makeForm();
          this.resetDetails()
          this.getCustomAppraisementList()
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  resetDetails() {
    this.chargeDetails.set({})
    this.transportChargeDetails.set({})
    this.selectedContainerSet().clear();
    this.insuredContainerSet().clear();
    this.selectedContainerList.set([]);
    this.containerList.set([])
    this.totalCharges.set({});
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  updateSelectedContainerList() {
    const selectedContainerList: any[] = [];
    this.containerList().forEach((container: any) => {
      if(this.selectedContainerSet().has(this.getContainerOblNo(container))) {
        selectedContainerList.push({...container, isInsured: this.insuredContainerSet().has(this.getContainerOblNo(container))});
      }
    })
    this.selectedContainerList.set(selectedContainerList);
    this.updateFetchChargesParams(this.form.getRawValue(), selectedContainerList);
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
      this.updateSelectedContainerList()
    })
  }

  print(record: any) {
    if(this.printInProgress[record.yardInvId]) return;
    this.printInProgress[record.yardInvId] = true;
    this.actionLoaders = {...this.actionLoaders, print: this.printInProgress}
    forkJoin([
      this.apiService.get(this.apiUrls.INVOICE_DETAILS, {InvoiceNo: record.invoiceNo}),
      this.apiService.get(API.IMPORT.CUSTOM_APPRAISEMENT.LIST, {id: record.applicationId}),
    ]).subscribe({
      next: (responses: any) => {
        this.pdfData.set({...responses[0].data, header: record, appraisement: responses[1].data[0]});
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
