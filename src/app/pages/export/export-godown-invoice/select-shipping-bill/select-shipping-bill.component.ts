import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-shipping-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-shipping-bill.component.html',
  styleUrls: ['./select-shipping-bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectShippingBillComponent {
  modal = inject(NgbActiveModal);

  @Input() records = signal<any[]>([]);
  @Input() selectedShippingBillSet = signal<Set<string>>(new Set())
  @Input() getContainerSBNo!: (record: any) => string;

  @Output() selectionChange = new EventEmitter<any>();
}
