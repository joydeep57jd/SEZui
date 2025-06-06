import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services';

interface IDeleteData {
  url: string;
  record: any;
  idKey: string;
  name: string;
}

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModalComponent {
  modal = inject(NgbActiveModal);
  private apiService = inject(ApiService);

  @Input() data!: IDeleteData;

  isDeleting = signal<boolean>(false);

  delete() {
    this.isDeleting.set(true);
    this.apiService.delete(`${this.data.url}`).subscribe({
      next: () => {
        this.modal.close(true);
      },
      error: () => {
        this.isDeleting.set(false);
      },
    });
  }
}
