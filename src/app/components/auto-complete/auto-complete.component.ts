import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component, ComponentRef, createComponent,
  forwardRef, Inject, Injector,
  Input,
  OnChanges, OnDestroy, Renderer2,
  signal,
  SimpleChanges,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OptionsDropdownComponent} from "./options-dropdown/options-dropdown.component";

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
export class AutoCompleteComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() options: any[] = [];
  @Input() keyName!: string;
  @Input() keyValue!: string;
  @Input() class = "";

  @ViewChild('ref', { read: ViewContainerRef }) vcr!: ViewContainerRef;
  private dropdownRef!: ComponentRef<OptionsDropdownComponent> | null;


  inputValue = signal("");
  isDisabled = signal(false);
  showOptions = signal(false);
  filteredOptions = signal<any[]>([]);
  selectedOption = signal<any>(null);

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filterOptions();
    }
  }

  onInput(value: string): void {
    this.inputValue.set(value);
    this.filterOptions();
    this.setShowOptions(true);
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
    this.setShowOptions(false);
    this.filteredOptions.set([{...option}]);
    this.onChange(this.getOptionValue(option));
  }

  filterOptions() {
    const filterValue = this.inputValue().toLowerCase();
    this.filteredOptions.set(this.options.filter(option => this.getOptionLabel(option).toLowerCase().includes(filterValue)));
    if (this.dropdownRef) {
      this.dropdownRef!.instance.options.set(this.filteredOptions());
      this.dropdownRef.changeDetectorRef.detectChanges();
    }
  }

  setShowOptions(value: boolean) {
    this.showOptions.set(value);
    if (value) {
      this.appendOptionsToBody()
    } else {
      this.removeOptionsFromBody();
    }
    if(!value && !this.selectedOption()) {
      this.inputValue.set('');
      this.filterOptions();
    }
  }

  removeOptionsFromBody() {
    if (this.dropdownRef) {
      this.appRef.detachView(this.dropdownRef.hostView);
      this.dropdownRef.destroy();
      this.dropdownRef = null;
    }
  }

  appendOptionsToBody() {
    if (this.dropdownRef) return;

    const dropdownRef = createComponent(OptionsDropdownComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    dropdownRef.instance.options.set(this.filteredOptions())
    dropdownRef.instance.selected = this.selectedOption();
    dropdownRef.instance.getOptionLabel = this.getOptionLabel.bind(this);
    dropdownRef.instance.getOptionValue = this.getOptionValue.bind(this);

    dropdownRef.instance.select.subscribe(option => {
      this.selectOption(option);
    });

    dropdownRef.instance.close.subscribe(() => {
      this.setShowOptions(false);
    });

    this.dropdownRef = dropdownRef;

    this.appRef.attachView(dropdownRef.hostView);

    const domElem = (dropdownRef.hostView as any).rootNodes[0] as HTMLElement;

    const inputRect = (this.vcr.element.nativeElement as HTMLElement).getBoundingClientRect();
    this.renderer.setStyle(domElem, 'position', 'absolute');
    this.renderer.setStyle(domElem, 'top', `${inputRect.bottom + window.scrollY}px`);
    this.renderer.setStyle(domElem, 'left', `${inputRect.left + window.scrollX}px`);
    this.renderer.setStyle(domElem, 'z-index', '1000');
    this.renderer.setStyle(domElem, 'width', `${inputRect.width}px`);

    this.renderer.appendChild(this.document.body, domElem);
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

  ngOnDestroy() {
    this.removeOptionsFromBody();
  }
}
