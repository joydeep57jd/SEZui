import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exim-trader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exim-trader.component.html',
  styleUrls: ['./exim-trader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EximTraderComponent {

}
