import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-handling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './handling.component.html',
  styleUrls: ['./handling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandlingComponent {

}
