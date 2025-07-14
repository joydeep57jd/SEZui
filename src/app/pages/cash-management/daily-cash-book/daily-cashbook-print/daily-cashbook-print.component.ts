import {ChangeDetectionStrategy, Component, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-cashbook-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-cashbook-print.component.html',
  styleUrls: ['./daily-cashbook-print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCashbookPrintComponent implements OnChanges{
  @Input() data:any[] = [];
  @Input() pdfMetaData: any;

  totalData = signal<any>({});

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"]?.currentValue) {
      const data = this.data.reduce((acc, item: any) => {
        acc.total += item.total
        acc.igst += item.igstAmt
        acc.sgst += item.sgstAmt
        acc.cgst += item.cgstAmt
        acc.enT_Taxable += item.enT_Taxable ?? 0
        acc.exM_Taxable += item.exM_Taxable ?? 0
        acc.trP_Taxable += item.trP_Taxable ?? 0
        acc.inS_Taxable += item.inS_Taxable ?? 0
        acc.otH_Taxable += item.otH_Taxable ?? 0
        acc.haN_Taxable += item.haN_Taxable ?? 0
        return acc;
      }, {
        total: 0,
        igst: 0,
        sgst: 0,
        cgst: 0,
        enT_Taxable: 0,
        exM_Taxable: 0,
        trP_Taxable: 0,
        inS_Taxable: 0,
        otH_Taxable: 0,
        haN_Taxable: 0
      })
      this.totalData.set(data);
    }
  }
}
