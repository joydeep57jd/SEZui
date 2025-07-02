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
    label: 'Container No',
    field: 'containerNo',
    type: 'string',
  },
  {
    label: 'Size',
    field: 'size',
    type: 'string',
  },
  {
    label: 'ICD Code',
    field: 'icd',
    type: 'string',
  },
  {
    label: 'OBL/HBL-Line No',
    field: 'obl',
    type: 'string',
  },
  {
    label: 'Weight(Kg)',
    field: 'grossWt',
    type: 'string',
  }
];
