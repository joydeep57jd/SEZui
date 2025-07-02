import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-godown-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './godown-invoice.component.html',
  styleUrls: ['./godown-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GodownInvoiceComponent {

}
