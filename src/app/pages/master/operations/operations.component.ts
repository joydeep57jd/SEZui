import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";
import {AutoCompleteComponent} from "../../../components/auto-complete/auto-complete.component";
import {OPERATION_DATA} from "./operations-data";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, ReactiveFormsModule, AutoCompleteComponent],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.OPERATION
  readonly apiUrls = API.MASTER.OPERATION;
  readonly types = OPERATION_DATA.types

  form!: FormGroup;
  sacList = signal<any[]>([]);
  isViewMode = signal(false);
  isSaving = signal(false);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.setHeaderCallbacks();
    this.makeForm();
    this.getSacList()
  }

  getSacList() {
    this.apiService.get(API.MASTER.SAC.LIST).subscribe({
      next: (response: any) => {
        this.sacList.set(response.data)
      }
    })
  }

  makeForm() {
    this.form = new FormGroup({
      operationId: new FormControl(0, []),
      operationType: new FormControl("", []),
      clauseOrder: new FormControl(null, []),
      sacId: new FormControl("", []),
      operationSDesc: new FormControl("", []),
      operationDesc: new FormControl("", []),
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
    this.isViewMode = signal(isViewMode);
    isViewMode ? this.form.disable() : this.form.enable();
  }

  setEditMode(){
    this.form.enable();
    this.isViewMode.set(false);
  }

  reset() {
    this.form.reset();
    this.makeForm();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving.set(true);
      const data = this.makePayload();
      this.apiService.post(this.apiUrls.SAVE, data).subscribe({
        next:() => {
          this.toasterService.showSuccess("Operation saved successfully");
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
    return {...this.form.value, branchId: 0, operationCode: "", pkgCount: ""};
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
