import { IDataTableHeader } from "../../models";

export const PaymentReceiptHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'print',
    label: 'Print',
    type: 'icon',
    icon: 'fa fa-print',
    class: 'text-center',
  },
  {
    field: 'receiptNo',
    label: 'Receipt No',
    type: 'string',
  },
  {
    field: 'payeeName',
    label: 'Payee Name',
    type: 'string',
  },
  {
    field: 'totalPaymentReceipt',
    label: 'Total Payment Receipt',
    type: 'number',
  },
];
