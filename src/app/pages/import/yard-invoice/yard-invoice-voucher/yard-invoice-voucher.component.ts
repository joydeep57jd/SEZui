import {ChangeDetectionStrategy, Component, inject, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilService} from "../../../../services";

@Component({
  selector: 'app-yard-invoice-voucher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yard-invoice-voucher.component.html',
  styleUrls: ['./yard-invoice-voucher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YardInvoiceVoucherComponent {
  @Input()  data = signal<any>({});

  utilService = inject(UtilService);

  formatCurrency(value: number) {
    return this.utilService.formatCurrency(value);
  }

  get total() {
    return this.data().charges?.reduce((acc: number, charge: any)=> acc + (charge.taxableAmt + charge.cgstAmt + charge.sgstAmt + charge.igstAmt), 0 )
  }

  get roundOff() {
    const total = this.total;
    return (Math.ceil(total) - total).toFixed(2);
  }

  get totalWithRoundOff() {
    const total = this.total;
    return Math.ceil(total);
  }

  get totalRoundOffInWords() {
    return this.utilService.convertAmountToWords(this.totalWithRoundOff)
  }
}
