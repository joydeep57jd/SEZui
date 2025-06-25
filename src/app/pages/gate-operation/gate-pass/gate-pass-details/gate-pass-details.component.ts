import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {GATE_PASS_DATA} from "../gate-pass-data";
import {TableComponent} from "../../../../components/table/table.component";
import {AutoCompleteComponent} from "../../../../components/auto-complete/auto-complete.component";

@Component({
  selector: 'app-gate-pass-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, AutoCompleteComponent],
  templateUrl: './gate-pass-details.component.html',
  styleUrls: ['./gate-pass-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatePassDetailsComponent {
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() portList!: any[];
  @Input() isViewMode!: boolean;

  @Output() changeGatePassDetails = new EventEmitter<any[]>();

  readonly cargoTypes = GATE_PASS_DATA.cargoTypes;

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.GATE_OPERATION.GATE_PASS.GATE_PASS_DETAILS
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
      gatepassDtlId: new FormControl(detail?.gatepassDtlId ?? 0, []),
      gatepassId: new FormControl(detail?.gatepassId ?? 0, []),
      containerNo: new FormControl(detail?.containerNo ?? "", []),
      size: new FormControl(detail?.size ?? "", []),
      elwbTareWeight: new FormControl(detail?.elwbTareWeight ?? "", []),
      elwbCargoWeight: new FormControl(detail?.elwbCargoWeight ?? "", []),
      cargoDescription: new FormControl(detail?.cargoDescription ?? "", []),
      cargeType: new FormControl(detail?.cargeType ?? "", []),
      vehicleNo: new FormControl(detail?.vehicleNo ?? "", []),
      noOfUnits: new FormControl(detail?.noOfUnits ?? "", []),
      weight: new FormControl(detail?.weight ?? null, []),
      location: new FormControl(detail?.location ?? "", []),
      portOfDispatch: new FormControl(detail?.portOfDispatch ?? "", []),
      isReefer: new FormControl(detail?.isReefer ?? 0, []),
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
    record.doValidDate = this.utilService.getNgbDateObject(record.doValidDate);
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
    this.changeGatePassDetails.emit([...this.records, this.makePayload()])
  }

  updateGatePassDetails() {
    const records = [...this.records];
    records[this.editIndex!] = this.makePayload();
    this.changeGatePassDetails.emit([...records])
  }

  makePayload() {
    const value = this.form.value;
    return  {...value, doValidDate: this.utilService.getDateObject(value.doValidDate)};
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
