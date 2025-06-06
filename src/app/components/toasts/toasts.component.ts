import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastService } from 'src/app';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 99',
  },
})
export class ToastsComponent {
  toastService = inject(ToastService);

  removeToast(toast: Toast) {
    this.toastService.remove(toast)
  }
}
