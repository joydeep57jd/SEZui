import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yard-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yard-invoice.component.html',
  styleUrls: ['./yard-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YardInvoiceComponent {

}
