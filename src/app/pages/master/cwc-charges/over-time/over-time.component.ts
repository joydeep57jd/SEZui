import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-over-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './over-time.component.html',
  styleUrls: ['./over-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverTimeComponent {

}
