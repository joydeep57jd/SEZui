import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {TableComponent} from "../../../../components/table/table.component";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {LOAD_CONTAINER_REQUEST_DATA} from "../load-container-request-data";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-load-container-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableComponent, AutoCompleteComponent, NgbInputDatepicker],
  templateUrl: './load-container-request-details.component.html',
  styleUrls: ['./load-container-request-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadContainerRequestDetailsComponent implements OnChanges {
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() exporterList: any[] = [];
  @Input() shippingLineList: any[] = [];
  @Input() commodityList: any[] = [];
  @Input() isViewMode!: boolean;

  @Output() changeEntryDetails = new EventEmitter<any[]>();

  readonly loadContainerRequestData = LOAD_CONTAINER_REQUEST_DATA;

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.EXPORT.LOAD_CONTAINER_REQUEST.DETAILS
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
      loadContReqDetlId: new FormControl(0, []),
      loadContReqId: new FormControl(0, []),
      exporterId: new FormControl(null, []),
      shippingLineId: new FormControl(null, []),
      containerNo: new FormControl("", []),
      size: new FormControl("", []),
      isInsured: new FormControl(false, []),
      shippingBillNo: new FormControl("", []),
      shippingBillDate: new FormControl(null, []),
      sez: new FormControl(false, []),
      commodityId: new FormControl(null, []),
      cargoType: new FormControl("", []),
      contLoadType: new FormControl("", []),
      customSeal: new FormControl("", []),
      packageType: new FormControl("", []),
      equipmentSealType: new FormControl("", []),
      equipmentStatus: new FormControl("", []),
      equipmentQUC: new FormControl("", []),
      packUQCCode: new FormControl("", []),
      cargoDescription: new FormControl("", []),
      noOfUnits: new FormControl(null, []),
      grossWt: new FormControl(null, []),
      fobValue: new FormControl(null, []),
    });
    this.updateFormViewMode()
  }

  updateFormViewMode() {
    if (this.isViewMode){
      this.form.disable()
    } else {
      this.form.enable()
    }
    this.setHeaderCallbacks()
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
    record.shippingBillDate = this.utilService.getNgbDateObject(record.shippingBillDate);
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
    const value = this.form.value;
    return  {
      ...value,
      shippingBillDate: this.utilService.getDateObject(value.shippingBillDate),
      isInsured: value.isInsured ? 1 : 0,
      sez: value.sez ? 1 : 0,
    };
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
      }
      return header;
    });
  }
}
