import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-charge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insurance-charge.component.html',
  styleUrls: ['./insurance-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsuranceChargeComponent {

}
