import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-examination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExaminationComponent {

}
