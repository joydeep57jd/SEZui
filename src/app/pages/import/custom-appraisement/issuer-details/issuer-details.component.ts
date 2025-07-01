import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../../../components/table/table.component";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ISSUER_DETAILS_DATA} from "./issuer-details-data";
import {UtilService} from "../../../../services";

@Component({
  selector: 'app-issuer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, NgbInputDatepicker],
  templateUrl: './issuer-details.component.html',
  styleUrls: ['./issuer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuerDetailsComponent implements OnChanges{
  utilService = inject(UtilService);

  @Input() records!: any[];
  @Input() isViewMode!: boolean;

  @Output() changeIssuerDetails = new EventEmitter<any[]>();

  readonly validTypes = ISSUER_DETAILS_DATA.validTypes;

  form!: FormGroup;
  headers = DATA_TABLE_HEADERS.IMPORT.CUSTOM_APPRAISEMENT.ISSUER
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
      id: new FormControl(0, []),
      doIssuedBy: new FormControl("", []),
      cargosDeliveredTo: new FormControl("", []),
      validType: new FormControl("", []),
      doValidDate: new FormControl(null, []),
      customAppraisementId: new FormControl(0, []),
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
        this.addIssuerDetails();
      } else {
        this.updateIssuerDetails();
      }
      this.editIndex = null;
      this.makeForm();
    }
  }

  addIssuerDetails() {
    this.changeIssuerDetails.emit([...this.records, this.makePayload()])
  }

  updateIssuerDetails() {
    const records = [...this.records];
    records[this.editIndex!] = this.makePayload();
    this.changeIssuerDetails.emit([...records])
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
