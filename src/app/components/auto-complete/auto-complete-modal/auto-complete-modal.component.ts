import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-auto-complete-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auto-complete-modal.component.html',
  styleUrls: ['./auto-complete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteModalComponent {
  modal = inject(NgbActiveModal);

  @Input() options = signal<any[]>([]);
  @Input() selectedOption = signal<any>(null);
  @Input() inputValue = signal<any>(null);
  @Input() title = signal<string>('');
  @Input() getOptionLabel!: (option: any) => string;
  @Input() getOptionValue!: (option: any) => string;


  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();
}
