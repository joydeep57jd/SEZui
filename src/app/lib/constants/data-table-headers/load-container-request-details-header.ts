import { IDataTableHeader } from "../../models";

export const LoadContainerRequestDetailsHeaders: IDataTableHeader[] = [
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
    label: 'Container / CBT No',
    field: 'containerNo',
    type: 'string',
  },
  {
    label: 'Shipping Bill',
    field: 'shippingBillNo',
    type: 'string',
  },
  {
    label: 'Gross Weight (Kg)',
    field: 'grossWt',
    type: 'string',
  }
];
