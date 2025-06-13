import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storage-charge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storage-charge.component.html',
  styleUrls: ['./storage-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageChargeComponent {

}
