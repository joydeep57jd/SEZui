import { IDataTableHeader } from "../../models";

export const ExportGodownInvoicePreviewHeaders: IDataTableHeader[] = [
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
    field: 'shippingBillNo',
    label: 'Shipping Bill No',
    type: 'string',
  },
  {
    field: 'stuffQuantity',
    label: 'No Of Packet',
    type: 'number',
  },
  {
    field: 'stuffWeight',
    label: 'Gross Weight',
    type: 'number',
  },
  {
    field: 'insured',
    label: 'Insured',
    type: 'boolean',
  },
];
