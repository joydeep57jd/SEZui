import { IDataTableHeader } from "../../models";

export const CancelledInvoiceHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'view',
    label: 'View',
    type: 'icon',
    icon: 'fa fa-eye',
    class: 'text-center',
  },
  {
    field: 'cancelledDate',
    label: 'Cancel Date',
    type: 'date',
  },
  {
    field: 'invoiceNo',
    label: 'Invoice No',
    type: 'string',
  },
  {
    field: 'invoiceDate',
    label: 'Invoice Date',
    type: 'date',
  },
  {
    field: 'amount',
    label: 'Amount',
    type: 'string',
  },
  {
    field: 'partyName',
    label: 'Party Name',
    type: 'string',
  },
];
