import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "../../../components";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";

@Component({
  selector: 'app-port',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortComponent {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.PORT
  readonly apiUrls = API.MASTER.PORT;

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  countryList = signal<any[]>([]);
  stateList = signal<any[]>([]);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getCountryList()
    this.setEditCallback();
    this.makeForm();
    this.onCountryChange();
  }

  onCountryChange() {
    this.form.get("country")?.valueChanges.subscribe(countryId => {
      if(countryId) {
        this.getStateList(countryId);
        this.form.get("state")?.enable()
      } else {
        this.stateList.set([])
        this.form.get("state")?.disable()
      }
      this.form.get("state")?.setValue("")
    })
  }

  getCountryList(){
    this.apiService.get(API.MASTER.COUNTRY).subscribe({
      next: (response: any) => {
        this.countryList.set(response.data)
      },
    })
  }

  getStateList(countryId: number){
    this.apiService.get(API.MASTER.STATE, {id: countryId}).subscribe({
      next: (response: any) => {
        this.stateList.set(response.data)
      },
    })
  }

  makeForm() {
    this.form = new FormGroup({
      portId: new FormControl(0, []),
      portName: new FormControl("", []),
      portAlias: new FormControl("", []),
      pod: new FormControl(false, []),
      country: new FormControl("", []),
      state: new FormControl({value: "", disabled: true}, []),
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
    this.isViewMode = signal(false);
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
          this.toasterService.showSuccess("Port saved successfully");
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

  setEditCallback() {
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
