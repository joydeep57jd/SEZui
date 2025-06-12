import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-appraisement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-appraisement.component.html',
  styleUrls: ['./custom-appraisement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAppraisementComponent {

}
