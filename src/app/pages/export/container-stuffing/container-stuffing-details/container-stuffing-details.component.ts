import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {UtilService} from "../../../../services";
import {TableComponent} from "../../../../components/table/table.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-container-stuffing-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ReactiveFormsModule, NgbInputDatepicker, AutoCompleteComponent],
  templateUrl: './container-stuffing-details.component.html',
  styleUrls: ['./container-stuffing-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerStuffingDetailsComponent implements OnChanges, OnDestroy {
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() shippingBillList: any[] = [];
  @Input() chaList: any[] = [];
  @Input() exporterList: any[] = [];
  @Input() headerFormValue!: any;
  @Input() isViewMode!: boolean;

  @Output() changeEntryDetails = new EventEmitter<any[]>();
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.EXPORT.CONTAINER_STUFFING.DETAILS
  editIndex: number | null = null;

  constructor() {
    this.setHeaderCallbacks()
    this.makeForm()
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['records']) {
      this.makeForm()
    }
    if(changes['isViewMode']) {
      this.updateFormViewMode()
    }
    if(changes['headerFormValue']) {
      this.setHeaderCallbacks()
    }
  }

  makeForm() {
    this.form = new FormGroup({
      stuffingDtlId: new FormControl(0, []),
      stuffingReqId: new FormControl(0, []),
      shippingBillNo: new FormControl("", []),
      shippingDate: new FormControl(null, []),
      chaId: new FormControl(null, []),
      exporter: new FormControl(null, []),
      consignee: new FormControl("", []),
      cargoDescription: new FormControl("", []),
      marksNo: new FormControl("", []),
      fob: new FormControl(null, []),
      stuffQuantity: new FormControl(null, []),
      stuffWeight: new FormControl(null, []),
      insured: new FormControl(false, []),
      mcinpcin: new FormControl("", []),
    });
    this.updateFormViewMode()
    this.form.get("shippingBillNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(shippingBillNo => {
        const ccinEntry = this.shippingBillList.find((ccin: any) => ccin.sbNo === shippingBillNo);
        const exporter = this.exporterList.find(e => e.partyId === ccinEntry?.exporterId);
        this.form.get("consignee")?.setValue(ccinEntry?.consigneeName ?? "");
        this.form.get("exporter")?.setValue(exporter?.partyName ?? null);
        this.form.get("chaId")?.setValue(ccinEntry?.chaId ?? null);
        this.form.get("shippingDate")?.setValue(this.utilService.getNgbDateObject(ccinEntry?.sbDate));
        this.form.get("stuffQuantity")?.setValue(ccinEntry?.package ?? null);
        this.form.get("stuffWeight")?.setValue(ccinEntry?.weight ?? null);
        this.form.get("fob")?.setValue(ccinEntry?.fob ?? null);
      })
    this.disableShippingBillFields()
  }

  disableShippingBillFields(){
    this.form.get("consignee")?.disable();
    this.form.get("exporter")?.disable();
    this.form.get("chaId")?.disable();
    this.form.get("stuffQuantity")?.disable();
    this.form.get("shippingDate")?.disable();
    this.form.get("stuffQuantity")?.disable();
    this.form.get("stuffWeight")?.disable();
    this.form.get("fob")?.disable();
  }

  updateFormViewMode() {
    if (this.isViewMode){
      this.form.disable()
    } else {
      this.form.enable()
    }
    this.setHeaderCallbacks()
    this.disableShippingBillFields()
  }

  edit(record: any, index?: number) {
    this.editIndex = index!
    this.patchForm({...record}, false);
  }

  view(record: any, index?: number) {
    this.editIndex = index!
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    record.shippingDate = this.utilService.getNgbDateObject(record.shippingDate);
    this.form.reset();
    this.form.patchValue(record);
    isViewMode ? this.form.disable() : this.form.enable();
    this.disableShippingBillFields()
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if(this.editIndex === null) {
        this.addIssuerDetails();
      } else {
        this.updateIssuerDetails();
      }
      this.editIndex = null;
      this.makeForm();
    }
  }

  addIssuerDetails() {
    this.changeEntryDetails.emit([...this.records, this.makePayload()])
  }

  updateIssuerDetails() {
    const records = [...this.records];
    records[this.editIndex!] = this.makePayload();
    this.changeEntryDetails.emit([...records])
  }

  makePayload() {
    const value = this.form.getRawValue();
    const cha = this.chaList.find(cha => cha.partyId === value.chaId)?.partyName ?? "";
    return  {
      ...value,
      shippingDate: this.utilService.getDateObject(value.shippingDate),
      cha,
      cfsCode: "",
      stuffingType: ""
    };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers = this.headers.map(header => {
      if(header.field === "edit") {
        header.callback = this.edit.bind(this);
        header.class = this.isViewMode ? "d-none" : "";
        header.valueClass = this.isViewMode ? "d-none" : "";
      }
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
      if(header.field === "containerNo") {
        header.valueGetter = (record) => this.headerFormValue.containerNo;
      }
      return header;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
