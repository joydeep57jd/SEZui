import { IDataTableHeader } from "../../models";

export const GodownInvoicePreviewHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'containerNo',
    label: 'Container / CBT No',
    type: 'string',
  },
  {
    field: 'obl',
    label: 'OBL/HBL No',
    type: 'string',
  },
  {
    field: 'noOfPackages',
    label: 'No Of Packet',
    type: 'number',
  },
  {
    field: 'grossWt',
    label: 'Gross Weight',
    type: 'number',
  },
];
