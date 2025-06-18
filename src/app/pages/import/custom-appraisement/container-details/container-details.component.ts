import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges, OnDestroy,
  Output, signal,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, UtilService} from "../../../../services";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {API, DATA_TABLE_HEADERS} from "../../../../lib";
import {TableComponent} from "../../../../components/table/table.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {CONTAINER_DETAILS_DATA} from "./container-details-data";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-container-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, NgbInputDatepicker, AutoCompleteComponent],
  templateUrl: './container-details.component.html',
  styleUrls: ['./container-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerDetailsComponent implements OnChanges, OnDestroy {
  utilService = inject(UtilService);
  apiService = inject(ApiService);

  @Input() records!: any[];
  @Input() isViewMode!: boolean;
  @Input() chaList = signal<any[]>([])
  @Input() importerList = signal<any[]>([])
  @Input() oblList = signal<any[]>([]);
  @Input() containerList = signal<any[]>([]);

  @Output() changeContainerDetails = new EventEmitter<any[]>();

  readonly sizes = CONTAINER_DETAILS_DATA.sizes;
  readonly fclLclList = CONTAINER_DETAILS_DATA.fclLclList;
  readonly containerCBTs = CONTAINER_DETAILS_DATA.containerCBTs;
  readonly rmsList = CONTAINER_DETAILS_DATA.rmsList;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.IMPORT.CUSTOM_APPRAISEMENT.CONTAINER
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
  }

  makeForm(detail?: any) {
    this.form = new FormGroup({
      id: new FormControl(detail?.id ?? 0, []),
      containerCBTNo: new FormControl(detail?.containerCBTNo ?? "", []),
      icdCode: new FormControl(detail?.icdCode ?? "", []),
      size: new FormControl(detail?.size ?? "", []),
      fcL_LCL: new FormControl(detail?.fcL_LCL ?? "", []),
      containerCBTType: new FormControl(detail?.containerCBTType ?? "", []),
      cargoType: new FormControl(detail?.cargoType ?? "", []),
      rms: new FormControl(detail?.rms ?? "", []),
      lineNo: new FormControl(detail?.lineNo ?? "", []),
      oblNoId: new FormControl(detail?.oblNoId ?? "", []),
      oblDate: new FormControl(this.utilService.getNgbDateObject(detail?.oblDate), []),
      boeNo: new FormControl(detail?.boeNo ?? "", []),
      boeDate: new FormControl(this.utilService.getNgbDateObject(detail?.boeDate), []),
      chaId: new FormControl(detail?.chaId ?? "", []),
      importerId: new FormControl(detail?.importerId ?? "", []),
      cargoDescription: new FormControl(detail?.cargoDescription ?? "", []),
      cifValue: new FormControl(detail?.cifValue ?? null, []),
      duty: new FormControl(detail?.duty ?? null, []),
      noOfPackages: new FormControl(detail?.noOfPackages ?? null, []),
      grossWeightKg: new FormControl(detail?.grossWeightKg ?? null, []),
      withoutDOSealNo: new FormControl(detail?.withoutDOSealNo ?? "", []),
      customAppraisementId: new FormControl(detail?.customAppraisementId ?? 0, []),
    });
    this.form.get("containerCBTNo")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.fetchContainerDetails()
      })
    this.form.get("oblNoId")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.fetchOblDetails()
      })
    this.updateFormViewMode()
  }

  fetchContainerDetails() {
    if(!this.form.get("containerCBTNo")?.value) return;
    this.apiService.get(API.GATE_OPERATION.GATE_IN.LIST, {containerNo: this.form.get("containerCBTNo")?.value}).subscribe({
      next: (response: any) => {
          const containerDetails = response.data[0]
          this.form.get("icdCode")?.setValue(containerDetails?.cfsNo ?? "")
          this.form.get("size")?.setValue(containerDetails?.size ?? "")
          this.form.get("containerCBTType")?.setValue(containerDetails?.containerType ?? "")
      }, error: () => {
        this.form.get("icdCode")?.setValue("")
        this.form.get("size")?.setValue("")
        this.form.get("containerCBTType")?.setValue("")
      }
    })
  }

  fetchOblDetails() {
    const oblDetails = this.oblList().find(x=>x.id == this.form.get("oblNoId")?.value)
    this.form.get("oblDate")?.setValue(this.utilService.getNgbDateObject(oblDetails?.obL_HBL_Date))
    this.form.get("cargoDescription")?.setValue(oblDetails?.cargo_Desc)
    this.form.get("noOfPackages")?.setValue(oblDetails?.no_of_PKG)
    this.form.get("grossWeightKg")?.setValue(oblDetails?.gR_WT_Kg)
    this.form.get("cargoType")?.setValue(oblDetails?.cargo_Type)
    this.form.get("fcL_LCL")?.setValue(oblDetails?.movementType)
  }

  makeFormControlsDisabled() {
    ["icdCode", "size", "fcL_LCL", "containerCBTType", "cargoType", "oblDate", "cargoDescription", "noOfPackages", "grossWeightKg"].forEach(control => {
      this.form.get(control)?.disable();
    })
  }

  updateFormViewMode() {
    if (this.isViewMode){
      this.form.disable()
    } else {
      this.form.enable()
    }
    this.setHeaderCallbacks()
    this.makeFormControlsDisabled()
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
    record.oblDate = this.utilService.getNgbDateObject(record.oblDate);
    record.boeDate = this.utilService.getNgbDateObject(record.boeDate);
    this.form.reset();
    this.form.patchValue(record);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if(this.editIndex === null) {
        this.addContainerDetails();
      } else {
        this.updateContainerDetails();
      }
      this.editIndex = null;
      this.makeForm();
    }
  }

  addContainerDetails() {
    this.changeContainerDetails.emit([...this.records, this.makePayload()])
  }

  updateContainerDetails() {
    const records = [...this.records];
    records[this.editIndex!] = this.makePayload();
    this.changeContainerDetails.emit([...records])
  }

  makePayload() {
    const value = this.form.getRawValue();
    return  {...value, oblDate: this.utilService.getDateObject(value.oblDate), boeDate: this.utilService.getDateObject(value.boeDate)};
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers = this.headers.map(header => {
      if(header.field === "edit") {
        if(!header.callback) {
          header.callback = this.edit.bind(this);
        }
        header.class = this.isViewMode ? "d-none" : "";
        header.valueClass = this.isViewMode ? "d-none" : "";
      }
      if(header.field === "view") {
        if(!header.callback) {
          header.callback = this.view.bind(this);
        }
        header.class = this.isViewMode ? "d-none" : "";
        header.valueClass = this.isViewMode ? "d-none" : "";
      }
      return header;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
