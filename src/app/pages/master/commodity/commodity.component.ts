import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "../../../components";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {COMMODITY_DATA} from "./commodity.data";

@Component({
  selector: 'app-commodity',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommodityComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.COMMODITY
  readonly apiUrls = API.MASTER.COMMODITY;
  readonly commodityTypes = COMMODITY_DATA.commodityTypes;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setHeaderCallbacks();
    this.makeForm();
  }

  makeForm() {
    this.form = new FormGroup({
      commodityId: new FormControl(0, []),
      commodityName: new FormControl("", []),
      commodityType: new FormControl(this.commodityTypes[0].value, []),
      alias: new FormControl("", []),
      isTaxExempted: new FormControl(false, []),
      isFumigationChemical: new FormControl(false, []),
    })
  }

  edit(record: any) {
    this.patchForm({...record}, false);
  }

  view(record: any) {
    this.patchForm({...record}, true);
  }

  patchForm(record: any, isViewMode: boolean) {
    this.form.reset();
    this.form.patchValue(record);
    this.isViewMode.set(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
    this.isViewMode.set(false);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Commodity saved successfully");
          this.table.reload();
          this.makeForm();
          this.isSaving.set(false);
        }, error: () => {
          this.isSaving.set(false);
        }
      })
    }
  }

  makePayload() {
    return {...this.form.value};
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  setHeaderCallbacks() {
    this.headers.forEach(header => {
      if(header.field === "edit") {
        header.callback = this.edit.bind(this);
      }
      if(header.field === "view") {
        header.callback = this.view.bind(this);
      }
    });
  }
}
