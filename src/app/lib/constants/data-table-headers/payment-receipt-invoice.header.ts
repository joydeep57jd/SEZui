import { IDataTableHeader } from "../../models";

export const PaymentReceiptInvoiceHeaders: IDataTableHeader[] = [
  {
    field: 'invoiceNo',
    label: 'Invoice/Debit Note No',
    type: 'string',
  },
  {
    field: 'invoiceDate',
    label: 'Invoice/Debit Note Date',
    type: 'date',
  },
  {
    field: 'total',
    label: 'Invoice Amount',
    type: 'number',
  },
  {
    field: 'added',
    label: 'Round Up',
    type: 'number',
  },
  {
    field: 'roundedTotal',
    label: 'All Total Amount',
    type: 'number',
  },
  {
    field: 'select',
    label: 'Select',
    type: 'select',
    class: 'text-center',
  },
];
