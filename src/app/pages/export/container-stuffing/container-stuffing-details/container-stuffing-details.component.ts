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
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {UtilService} from "../../../../services";
import {TableComponent} from "../../../../components/table/table.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";

@Component({
  selector: 'app-container-stuffing-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ReactiveFormsModule, NgbInputDatepicker, AutoCompleteComponent],
  templateUrl: './container-stuffing-details.component.html',
  styleUrls: ['./container-stuffing-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerStuffingDetailsComponent implements OnChanges{
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() chaList: any[] = [];
  @Input() exporterList: any[] = [];
  @Input() headerFormValue!: any;
  @Input() isViewMode!: boolean;

  @Output() changeEntryDetails = new EventEmitter<any[]>();

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
    record.shippingDate = this.utilService.getNgbDateObject(record.shippingDate);
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
      if(header.field === "containerNo") {
        if(!header.callback) {
          header.valueGetter = (record) => this.headerFormValue.containerNo;
        }
      }
      return header;
    });
  }
}
