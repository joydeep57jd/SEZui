import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-containers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-containers.component.html',
  styleUrls: ['./select-containers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectContainersComponent {
  modal = inject(NgbActiveModal);
}
