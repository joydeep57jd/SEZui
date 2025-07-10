import { IDataTableHeader } from "../../models";

export const LoadContainerInvoiceHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  // {
  //   field: 'print',
  //   label: 'Print',
  //   type: 'icon',
  //   icon: 'fa fa-print',
  //   class: 'text-center',
  // },
  // {
  //   field: 'containerNo',
  //   label: 'Container No',
  //   type: 'string',
  // },
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
];
