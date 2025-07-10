import { IDataTableHeader } from "../../models";

export const GodownInvoiceHeaders: IDataTableHeader[] = [
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
    field: 'invoiceNo',
    label: 'Invoice No',
    type: 'string',
  },
  {
    field: 'paymentMode',
    label: 'Payment Mode',
    type: 'string',
  },
  {
    field: 'payeeName',
    label: 'Payee Name',
    type: 'string',
  },
];
