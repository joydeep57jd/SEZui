import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilService} from "../../../../services";

@Component({
  selector: 'app-payment-receipt-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-receipt-invoice.component.html',
  styleUrls: ['./payment-receipt-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentReceiptInvoiceComponent {
  utilService = inject(UtilService);

  @Input() pdfData!: any;

}

// {
//   "cashReceiptDtlId": 1,
//   "cashReceipthdrId": 1,
//   "payMode": "Cash",
//   "draweeBank": "fsdf",
//   "instrumentNo": "fsd",
//   "date": "2025-06-27T00:00:00.",
//   "amount": 0.00,
//   "isChqCancelled": "string",
//   "createdBy": null,
//   "createdOn": "2025-06-26T10:07:39.187",
//   "updatedBy": null,
//   "updatedOn": "2025-06-26T10:07:39.187"
// }
// ],

// {
//   "status": true,
//   "data": [
//   {
//     "cashReceiptId": 1,
//     "branchId": 0,
//     "autoCashRcptNo": 0,
//     "receiptNo": "RCP123",
//     "receiptDate": "2025-06-12T00:00:00",
//     "invoiceId": 0,
//     "partyId": 4,
//     "payByPdaId": 0,
//     "payeeName": "TEAM GLOBAL LOGISTICS P LTD",
//     "pdaAdjust": 0,
//     "folioNo": "string",
//     "pdaAdjustedAmount": 0.00,
//     "pdaOpening": 0.00,
//     "pdaClosing": 0.00,
//     "totalPaymentReceipt": 0.00,
//     "tdsAmount": 0.00,
//     "invoiceValue": 0.00,
//     "compYear": "string",
//     "remarks": "",
//     "pdaAccountDetailsID": 0,
//     "fromPDA": "string",
//     "cashReceiptHtml": "string",
//     "isCancelled": 0,
//     "cancelledReason": "string",
//     "cancelledOn": "2025-06-19T09:37:58.363",
//     "cancelledBy": 0,
//     "invoiceDebitNote": "string",
//     "onlineFacAmt": 0.00,
//     "area": "string",
//     "transId": "string",
//     "isSAP": 0,
//     "isSAPRev": 0,
//     "saP_DOC_NUMBER": "string",
//     "createdBy": null,
//     "createdOn": "2025-06-26T10:07:39.17",
//     "updatedBy": null,
//     "updatedOn": "2025-06-26T10:07:39.17"
//   }
// ],
//   "message": null,
//   "totalCount": 1
// }
