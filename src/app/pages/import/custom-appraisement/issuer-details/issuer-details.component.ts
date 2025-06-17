import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../../../components/table/table.component";
import {DATA_TABLE_HEADERS} from "../../../../lib";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ISSUER_DETAILS_DATA} from "./issuer-details-data";

@Component({
  selector: 'app-issuer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, NgbInputDatepicker],
  templateUrl: './issuer-details.component.html',
  styleUrls: ['./issuer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuerDetailsComponent {
  @Input() records = signal<any[]>([])

  readonly headers = DATA_TABLE_HEADERS.IMPORT.CUSTOM_APPRAISEMENT.ISSUER
  readonly validTypes = ISSUER_DETAILS_DATA.validTypes;

  form!: FormGroup;

  constructor() {
    this.setHeaderCallbacks()
    this.makeForm()
  }

  makeForm() {
    this.form = new FormGroup({
      doIssuedBy: new FormControl("", []),
      cargsDeliveredTo: new FormControl("", []),
      validType: new FormControl("", []),
      doValidDate: new FormControl(null, []),
    });
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "edit") {
        // header.callback = this.edit.bind(this);
      }
      if(header.field === "view") {
        // header.callback = this.view.bind(this);
      }
    });
  }
}
