import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-obls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-obls.component.html',
  styleUrls: ['./select-obls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOblsComponent {

}
