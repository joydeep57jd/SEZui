import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarnsportation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarnsportation.component.html',
  styleUrls: ['./tarnsportation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarnsportationComponent {

}
