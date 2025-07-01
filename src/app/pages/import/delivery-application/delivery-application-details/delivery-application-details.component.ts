import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-application-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-application-details.component.html',
  styleUrls: ['./delivery-application-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryApplicationDetailsComponent {

}
