import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-obls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-obls.component.html',
  styleUrls: ['./select-obls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOblsComponent {
  modal = inject(NgbActiveModal);

  @Input() records = signal<any[]>([]);
  @Input() selectedOblSet = signal<Set<string>>(new Set())
  @Input() insuredOblSet = signal<Set<string>>(new Set())
  @Input() getContainerOblNo!: (record: any) => string;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() updateInsured = new EventEmitter<any>();
}
