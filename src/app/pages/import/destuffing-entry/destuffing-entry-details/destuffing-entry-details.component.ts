import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {TableComponent} from "../../../../components/table/table.component";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";
import {DESTUFFING_ENTRY_DETAILS_DATA} from "./destuffing-entrey-details-data";

@Component({
  selector: 'app-destuffing-entry-details',
  standalone: true,
  imports: [CommonModule, NgbInputDatepicker, ReactiveFormsModule, TableComponent, AutoCompleteComponent],
  templateUrl: './destuffing-entry-details.component.html',
  styleUrls: ['./destuffing-entry-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestuffingEntryDetailsComponent {
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() commodityList: any[] = [];
  @Input() godownList: any[] = [];
  @Input() isViewMode!: boolean;

  @Output() changeEntryDetails = new EventEmitter<any[]>();

  readonly cargoTypes = DESTUFFING_ENTRY_DETAILS_DATA.cargoTypes;
  readonly uoms = DESTUFFING_ENTRY_DETAILS_DATA.uoms;

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.IMPORT.DESTUFFING_ENTRY.DETAILS
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

  makeForm() {
    this.form = new FormGroup({
      destuffingEntryDtlId: new FormControl(0, []),
      destuffingEntryId: new FormControl(0, []),
      oblHblNo: new FormControl("", []),
      oblHblDate: new FormControl(null, []),
      lineNo: new FormControl("", []),
      commodityId: new FormControl(null, []),
      cargoDescription: new FormControl("", []),
      cargoType: new FormControl("", []),
      noOfPackages: new FormControl(null, []),
      receivedPackages: new FormControl(null, []),
      grossWeight: new FormControl(null, []),
      destuffWeight: new FormControl(null, []),
      uom: new FormControl(this.uoms[0].value, []),
      oblWiseDestuffingDate: new FormControl(null, []),
      remarks: new FormControl("", []),
      locationId: new FormControl(null, []),
      area: new FormControl(null, []),
      boeNo: new FormControl("", []),
      boeDate: new FormControl(null, []),
      cifValue: new FormControl(null, []),
      grossDuty: new FormControl(null, []),
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
    record.oblHblDate = this.utilService.getNgbDateObject(record.oblHblDate);
    record.oblWiseDestuffingDate = this.utilService.getNgbDateObject(record.oblWiseDestuffingDate);
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
    const location = this.godownList.find(godown=>godown.godownId == value.locationId)?.locationAlias ?? ""
    return  {
      ...value,
      oblHblDate: this.utilService.getDateObject(value.oblHblDate),
      oblWiseDestuffingDate: this.utilService.getDateObject(value.oblWiseDestuffingDate),
      boeDate: this.utilService.getDateObject(value.boeDate),
      location
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
