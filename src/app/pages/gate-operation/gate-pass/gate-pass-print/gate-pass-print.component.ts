import {ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-gate-pass-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gate-pass-print.component.html',
  styleUrls: ['./gate-pass-print.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatePassPrintComponent implements OnChanges {
  datePipe = inject(DatePipe);

  @Input() pdfData!:any;

  data: any[] = []

  ngOnChanges(changes: SimpleChanges) {
    if(this.pdfData?.header) {
      this.prepareData();
    }
  }

  get boeNo() {
    return this.pdfData?.header?.boeNo
  }

  get vehicleNo() {
    return this.pdfData?.details && this.pdfData?.details[0]?.vehicleNo
  }

  get containerDetails() {
    return this.pdfData?.details && `${this.pdfData?.details[0]?.containerNo}-${this.pdfData?.details[0]?.size}`;
  }

  get customerSealNo() {
    return this.pdfData?.details && this.pdfData?.details[0]?.customerSealNo
  }

  get validityDate() {
    return this.pdfData?.header?.expDate ? this.datePipe.transform(new Date(this.pdfData?.header?.expDate), 'dd/MM/yy') : ''
  }

  prepareData() {
    const data = []
    data.push({ labelLeft: 'Gate Pass No.', valueLeft: this.pdfData.header.gatePassNo, labelRight: 'Gate Pass Date', valueRight: this.datePipe.transform(new Date(this.pdfData.header.gatePssDate), 'dd/MM/yy') });
    data.push({ labelLeft: 'Vehicle No.', valueLeft: this.vehicleNo, labelRight: 'Container No. & size', valueRight: this.containerDetails });
    data.push({ labelLeft: 'Importer/Exporter', valueLeft: this.pdfData.header.impExpName, labelRight: 'CHA Name', valueRight: this.pdfData.header.chaName });
    data.push({ labelLeft: 'Shipping Line', valueLeft: this.pdfData.header.shippingLineName, labelRight: 'BOE No./S.B. No./WR No.', valueRight: this.boeNo });
    data.push({ labelLeft: 'Customs Seal No', valueLeft: this.customerSealNo, labelRight: 'Invoice No', valueRight: this.pdfData.header.invoiceNo });
    data.push({ labelLeft: 'Gate Pass Time', valueLeft: this.datePipe.transform(new Date(this.pdfData.header.createdOn), 'hh:mm'), labelRight: 'Gate Pass Validity Date Time', valueRight: this.validityDate });
    data.push({ labelLeft: 'Remarks', valueLeft: this.pdfData.header.remarks, labelRight: '', valueRight: '', leftColSpan: 12, rightColSpan: 0 });
    this.data = data
  }

}
