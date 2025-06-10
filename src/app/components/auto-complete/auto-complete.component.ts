import {ChangeDetectionStrategy, Component, forwardRef, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    }
  ]
})
export class AutoCompleteComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() options: any[] = [];
  @Input() keyName!: string;
  @Input() keyValue!: string;

  inputValue = signal("");
  isDisabled = signal(false);
  showOptions = signal(false);
  filteredOptions = signal<any[]>([]);

  selectedOption = signal<any>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filterOptions();
    }
  }

  onInput(value: string): void {
    this.inputValue.set(value);
    this.filterOptions();
    this.showOptions.set(true);
    this.selectedOption.set(null);
    this.onChange(null);
  }

  getOptionLabel(option: any) {
    return this.keyName ? option[this.keyName] : option;
  }

  getOptionValue(option: any) {
    if(!option) return null;
    return this.keyValue ? option[this.keyValue] : option;
  }

  selectOption(option: any): void {
    this.inputValue.set(this.getOptionLabel(option));
    this.selectedOption.set({...option});
    this.showOptions.set(false);
    this.filteredOptions.set([{...option}]);
    this.onChange(this.getOptionValue(option));
  }

  filterOptions() {
    const filterValue = this.inputValue().toLowerCase();
    this.filteredOptions.set(this.options.filter(option => this.getOptionLabel(option).toLowerCase().includes(filterValue)));
  }

  setShowOptions(value: boolean) {
    this.showOptions.set(value);
    if(!value && !this.selectedOption()) {
      this.inputValue.set('');
      this.filterOptions();
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    const match = this.options.find(option => this.getOptionValue(option) === value);
    this.selectedOption.set({...match} || null);
    this.inputValue.set(match ? this.getOptionLabel(match) : '');
    this.filterOptions();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
