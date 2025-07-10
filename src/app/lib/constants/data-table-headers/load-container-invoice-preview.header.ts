import { IDataTableHeader } from "../../models";

export const LoadContainerInvoicePreviewHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  // {
  //   field: 'icdNo',
  //   label: 'ICD No',
  //   type: 'string',
  // },
  {
    field: 'containerNo',
    label: 'Container / CBT No',
    type: 'string',
  },
  // {
  //   field: 'size',
  //   label: 'Size',
  //   type: 'string',
  // },
  // {
  //   field: 'doValidateDate',
  //   label: 'DO Date',
  //   type: 'date',
  // },
];
