import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rent-table-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rent-table-space.component.html',
  styleUrls: ['./rent-table-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentTableSpaceComponent {

}
