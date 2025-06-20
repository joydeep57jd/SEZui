import { IDataTableHeader } from "../../models";

export const YardInvoicePreviewHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'icdNo',
    label: 'ICD No',
    type: 'string',
  },
  {
    field: 'containerCBTNo',
    label: 'Container / CBT No',
    type: 'string',
  },
  {
    field: 'size',
    label: 'Size',
    type: 'string',
  },
  {
    field: 'reefer',
    label: 'Reefer',
    type: 'boolean',
  },
  {
    field: 'isInsured',
    label: 'Insured',
    type: 'boolean',
  },
  {
    field: 'cargoType',
    label: 'Cargo Type',
    type: 'string',
  },
  {
    field: 'obL_HBL_No',
    label: 'OBL No',
    type: 'string',
  },
  {
    field: 'noOfPackage',
    label: 'No Of Pkg',
    type: 'number',
  },
  {
    field: 'grWt',
    label: 'Gr Wait',
    type: 'number',
  },
  {
    field: 'doValidateDate',
    label: 'DO Date',
    type: 'date',
  },
];
