import {ChangeDetectionStrategy, Component, inject, Input, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";

@Component({
  selector: 'app-load-container-invoice-voucher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-container-invoice-voucher.component.html',
  styleUrls: ['./load-container-invoice-voucher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadContainerInvoiceVoucherComponent {
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

  get noOfDays() {
    if(this.data().header.deliveryDate && this.data().arrivalDate) {
      const deliveryDate = new Date(this.data().header.deliveryDate);
      const arrivalDate = new Date(this.data().arrivalDate);
      deliveryDate.setHours(0, 0, 0, 0);
      arrivalDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(deliveryDate.getTime() - arrivalDate.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays + 1;
    }
    return "";
  }
}
