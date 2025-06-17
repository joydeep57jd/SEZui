import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AutoCompleteModalComponent} from "./auto-complete-modal/auto-complete-modal.component";

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
  private modalService = inject(NgbModal);

  @Input() placeholder = '';
  @Input() label = '';
  @Input() options: any[] = [];
  @Input() keyName!: string;
  @Input() keyValue!: string;
  @Input() class = "";
  @Input() title = ""

  private modalRef!: NgbModalRef | null;

  inputValue = signal("");
  isDisabled = signal(false);
  filteredOptions = signal<any[]>([]);
  selectedOption = signal<any>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filterOptions();
    }
  }

  getOptionLabel = (option: any) => {
    return this.keyName ? option[this.keyName] : option;
  }

  getOptionValue(option: any) {
    if(!option) return null;
    return this.keyValue ? option[this.keyValue] : option;
  }

  openOptionsModal() {
    this.modalRef = this.modalService.open(AutoCompleteModalComponent, {modalDialogClass: 'auto-complete-modal', backdrop : 'static', keyboard : false});
    this.modalRef.componentInstance.getOptionLabel = this.getOptionLabel.bind(this);
    this.modalRef.componentInstance.getOptionValue = this.getOptionValue.bind(this);
    this.modalRef.componentInstance.title.set(this.title);
    this.modalRef.componentInstance.options.set(this.filteredOptions());
    this.modalRef.componentInstance.selectedOption.set(this.selectedOption());
    this.modalRef.componentInstance.inputValue.set(this.inputValue());
    this.modalRef.componentInstance.search.subscribe((result: any) => {
      this.onSearch(result ?? '');
    })
    this.modalRef.componentInstance.select.subscribe((result: any) => {
      this.onSelectOption(result ?? null);
    })
    this.modalRef.closed.subscribe(() => {
      this.modalRef = null;
      this.inputValue.set("");
      this.filterOptions();
    })
  }

  onSearch(value: string): void {
    this.inputValue.set(value);
    this.filterOptions();
    this.selectedOption.set(null);
    this.onChange(null);
  }

  onSelectOption(option: any): void {
    this.inputValue.set("");
    this.selectedOption.set({...option});
    this.filterOptions();
    this.onChange(this.getOptionValue(option));
  }

  filterOptions() {
    const filterValue = this.inputValue().toLowerCase();
    this.filteredOptions.set(this.options.filter(option => this.getOptionLabel(option).toLowerCase().includes(filterValue)));
    if (this.modalRef) {
      this.modalRef!.componentInstance.options.set(this.filteredOptions());
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
