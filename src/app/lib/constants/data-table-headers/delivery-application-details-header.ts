import { IDataTableHeader } from "../../models";

export const DeliveryApplicationDetailsHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'edit',
    label: 'Edit',
    type: 'icon',
    icon: 'fa fa-pencil',
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
    label: 'OBL/HBL-Line No',
    field: 'obl',
    type: 'string',
  },
  {
    label: 'BOE No',
    field: 'boE_NO',
    type: 'string',
  },
  {
    label: 'BOE Date',
    field: 'boE_DATE',
    type: 'date',
  },
  {
    label: 'Weight(Kg)',
    field: 'grossWt',
    type: 'string',
  }
];
