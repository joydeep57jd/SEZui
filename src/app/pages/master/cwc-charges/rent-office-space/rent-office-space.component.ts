import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rent-office-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rent-office-space.component.html',
  styleUrls: ['./rent-office-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentOfficeSpaceComponent {

}
