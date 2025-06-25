import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GATE_EXIT_DATA} from "../gate-exit-data";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {TableComponent} from "../../../../components/table/table.component";

@Component({
  selector: 'app-gate-exit-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableComponent],
  templateUrl: './gate-exit-details.component.html',
  styleUrls: ['./gate-exit-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateExitDetailsComponent implements OnChanges {
  @Input() records!: any[];
  @Input() isViewMode!: boolean;

  @Output() changeGateExitDetails = new EventEmitter<any[]>();

  readonly cargoTypes = GATE_EXIT_DATA.cargoTypes;

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_EXIT.GATE_EXIT_DETAILS
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
      exitIdDtls: new FormControl(detail?.exitIdDtls ?? 0, []),
      exitIdHeader: new FormControl(detail?.exitIdHeader ?? 0, []),
      cargoType: new FormControl(detail?.cargoType ?? "", []),
      vehicleNo: new FormControl(detail?.vehicleNo ?? "", []),
      noOfPackages: new FormControl(detail?.noOfPackages ?? "", []),
      grossWeight: new FormControl(detail?.grossWeight ?? null, []),
      depositorName: new FormControl(detail?.depositorName ?? "", []),
      remarks: new FormControl(detail?.remarks ?? "", []),
      reefer: new FormControl(detail?.reefer ?? 0, []),
      cfsCode: new FormControl(detail?.cfsCode ?? 0, []),
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
        this.addGatePassDetails();
      } else {
        this.updateGatePassDetails();
      }
      this.editIndex = null;
      this.makeForm();
    }
  }

  addGatePassDetails() {
    this.changeGateExitDetails.emit([...this.records, this.makePayload()])
  }

  updateGatePassDetails() {
    const records = [...this.records];
    records[this.editIndex!] = this.makePayload();
    this.changeGateExitDetails.emit([...records])
  }

  makePayload() {
    return  {...this.form.value};
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
