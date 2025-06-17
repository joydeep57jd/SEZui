import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container-details.component.html',
  styleUrls: ['./container-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerDetailsComponent {

}
