import { IDataTableHeader } from "../../models";

export const CreditNoteHeaders: IDataTableHeader[] = [
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
    field: 'creditNoteNo',
    label: 'Credit Note No',
    type: 'string',
  },
  {
    field: 'creditNoteDate',
    label: 'Credit Note Date',
    type: 'date',
  },
  {
    field: 'invoiceNo',
    label: 'Invoice No',
    type: 'string',
  },
];
