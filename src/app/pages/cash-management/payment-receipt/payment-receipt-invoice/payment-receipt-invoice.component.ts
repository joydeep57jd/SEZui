import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-receipt-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-receipt-invoice.component.html',
  styleUrls: ['./payment-receipt-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentReceiptInvoiceComponent {
}
