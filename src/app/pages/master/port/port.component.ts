import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "../../../components";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService, ToastService} from "../../../services";
import {API, DATA_TABLE_HEADERS} from "../../../lib";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-port',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortComponent implements OnDestroy {
  apiService = inject(ApiService);
  toasterService = inject(ToastService);

  readonly headers = DATA_TABLE_HEADERS.MASTER.PORT
  readonly apiUrls = API.MASTER.PORT;

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  isViewMode = signal(false);
  isSaving = signal(false);
  countryList = signal<any[]>([]);
  stateList = signal<any[]>([]);

  @ViewChild(DataTableComponent) table!: DataTableComponent;

  constructor() {
    this.getCountryList()
    this.setHeaderCallbacks();
    this.makeForm();
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
        const selectedState = response.data.find((state: any) => state.id == this.form.get("state")?.value)
        if(!selectedState) {
          this.form.get("state")?.setValue("")
        }
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
    this.form.get("country")?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(countryId => {
        if(countryId) {
          this.getStateList(countryId);
          this.form.get("state")?.enable()
        } else {
          this.stateList.set([])
          this.form.get("state")?.disable()
        }
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
    const value = {...this.form.value, createdBy: 0, updatedBy: 0};
    value.country = +value.country;
    value.state = +value.state;
    return value;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
