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
    field: 'containerCBTNo',
    label: 'Container / CBT No',
    type: 'string',
  },
  {
    field: 'obL_HBL_No',
    label: 'OBL/HBL No',
    type: 'string',
  },
  {
    field: 'cargoType',
    label: 'Cargo Type',
    type: 'string',
  },
  {
    field: 'noOfPackage',
    label: 'No Of Packet',
    type: 'number',
  },
  {
    field: 'grWt',
    label: 'Gross Weight',
    type: 'number',
  },
];
