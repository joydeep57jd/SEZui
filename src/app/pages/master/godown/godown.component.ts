import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableComponent} from "../../../components";

@Component({
  selector: 'app-godown',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './godown.component.html',
  styleUrls: ['./godown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GodownComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.GODOWN
  readonly apiUrls = API.MASTER.GODOWN;

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
      godownId: new FormControl(0, []),
      godownName: new FormControl("", []),
      locationAlias: new FormControl("", []),
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
          this.toasterService.showSuccess("Godown saved successfully");
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
