import { IDataTableHeader } from "../../models";

export const CustomAppraisementContainerHeaders: IDataTableHeader[] = [
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
    label: 'Container CBT No',
    field: 'containerCBTNo',
    type: 'string',
  },
  {
    field: 'cifValue',
    label: 'CIF Value',
    type: 'price',
  },
  {
    field: 'grossWeightKg',
    label: 'Gross Weight (Kg)',
    type: 'number',
  },
];
