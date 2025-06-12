import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-options-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options-dropdown.component.html',
  styleUrls: ['./options-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsDropdownComponent{
  @Input() options = signal<any[]>([]);
  @Input() selected: any;
  @Input() getOptionLabel: any;
  @Input() getOptionValue: any;

  @Output() select = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
}
