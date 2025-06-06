import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gate-exit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gate-exit.component.html',
  styleUrls: ['./gate-exit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateExitComponent {

  form!: FormGroup;
  isSaving = signal<boolean>(false);

  constructor() {
    this.makeForm();
  }


  makeForm() {
    this.form = new FormGroup({
      containerNo: new FormControl("", []),
      icdCode: new FormControl("", []),
      rms: new FormControl("", []),
      date: new FormControl("", []),
      description: new FormControl("", []),
      appraisementStatus: new FormControl("", []),
    })
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = this.makePayload()
      console.log(data);
    }
  }


  makePayload() {
    const value = this.form.value;
    return { ...value };
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }
}
