import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output, signal,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {TableComponent} from "../../../../components/table/table.component";

@Component({
  selector: 'app-delivery-application-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteComponent, NgbInputDatepicker, TableComponent],
  templateUrl: './delivery-application-details.component.html',
  styleUrls: ['./delivery-application-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryApplicationDetailsComponent implements OnChanges {
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() oblList: any[] = [];
  @Input() importerList: any[] = [];
  @Input() isViewMode!: boolean;

  @Output() changeEntryDetails = new EventEmitter<any[]>();

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.IMPORT.DELIVERY_APPLICATION.DETAILS
  editIndex: number | null = null;
  oblMap = signal(new Map());

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
    if(changes['oblList']) {
      const map = new Map();
      this.oblList.forEach(obl => {
        map.set(obl.obL_HBL_No, obl);
      })
      this.oblMap.set(map);
    }
  }

  makeForm() {
    this.form = new FormGroup({
      deliveryDtlId: new FormControl(0, []),
      deliveryId: new FormControl(0, []),
      destuffingEntryDtlId: new FormControl(0, []),
      obl: new FormControl(null, []),
      boE_NO: new FormControl("", []),
      boE_DATE: new FormControl(null, []),
      cargoDescription: new FormControl("", []),
      importerId: new FormControl(null, []),
      noOfPackages: new FormControl(null, []),
      grossWt: new FormControl("", []),
      sqm: new FormControl(null, []),
      cum: new FormControl(null, []),
      cif: new FormControl(null, []),
      duty: new FormControl(null, []),
      delNoOfPackages: new FormControl(null, []),
      delGrossWt: new FormControl("", []),
      delSQM: new FormControl(null, []),
      delCUM: new FormControl(null, []),
      delCIF: new FormControl(null, []),
      delDuty: new FormControl(null, []),
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
    record.boE_DATE = this.utilService.getNgbDateObject(record.boE_DATE);
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
      boE_DATE: this.utilService.getDateObject(value.boE_DATE),
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
        if(!header.valueGetter) {
          header.valueGetter = (record) => this.oblMap().get(record.obl)?.containerCBTNo
        }
      }
      if(header.field === "size") {
        if(!header.valueGetter) {
          header.valueGetter = (record) => this.oblMap().get(record.obl)?.size
        }
      }
      if(header.field === "icd") {
        if(!header.valueGetter) {
          header.valueGetter = (record) => this.oblMap().get(record.obl)?.icdNo
        }
      }
      return header;
    });
  }
}
