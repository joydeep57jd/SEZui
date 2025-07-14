import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-containers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-containers.component.html',
  styleUrls: ['./select-containers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectContainersComponent {
  modal = inject(NgbActiveModal);

  @Input() records = signal<any[]>([]);
  @Input() selectedContainerSet = signal<Set<string>>(new Set())
  @Input() insuredContainerSet = signal<Set<string>>(new Set())

  @Output() selectionChange = new EventEmitter<any>();
  @Output() updateInsured = new EventEmitter<any>();
}
