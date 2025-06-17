import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "../../../components";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-exim-trader',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
  templateUrl: './exim-trader.component.html',
  styleUrls: ['./exim-trader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EximTraderComponent {
  readonly url = API.MASTER.EXIM_TRADER.LIST;
  readonly headers = DATA_TABLE_HEADERS.MASTER.EXIM_TRADER
  readonly operationTypes = ["Importer", "Exporter", "Shipping Line", "CHA", "Forwarder", "Rent", "Bidder"]

  form!: FormGroup;

  constructor() {
    this.setHeaderCallbacks();
    this.makeForm();
  }

  isChecked(label: string) {
    const selectedValue = this.form.get("operationType")?.value?.toLowerCase().replaceAll(" ", "");
    const checkValue = label.toLowerCase().replaceAll(" ", "");
    return selectedValue === checkValue;
  }

  makeForm() {
    this.form = new FormGroup({
      operationType: new FormControl("", []),
      eximTraderName: new FormControl("", []),
      partyCode: new FormControl("", []),
      address: new FormControl("", []),
      countryName: new FormControl("", []),
      stateName: new FormControl("", []),
      cityName: new FormControl("", []),
      pincode: new FormControl("", []),
      phoneNo: new FormControl("", []),
      faxNo: new FormControl("", []),
      contactPerson: new FormControl("", []),
      emailId: new FormControl("", []),
      mobileNo: new FormControl("", []),
      pan: new FormControl("", []),
      aadhaarNo: new FormControl("", []),
      gstNo: new FormControl("", []),
      tan: new FormControl("", []),
    })
    this.form.disable();
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  patchForm(record: any, isViewMode: boolean) {
    this.form.reset();
    this.form.patchValue(record);
    this.form.disable();
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
    });
  }
}
