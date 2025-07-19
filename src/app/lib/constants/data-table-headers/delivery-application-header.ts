import { IDataTableHeader } from "../../models";

export const DeliveryApplicationHeaders: IDataTableHeader[] = [
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
  // {
  //   field: 'print',
  //   label: 'Print',
  //   type: 'icon',
  //   icon: 'fa fa-print',
  //   class: 'text-center',
  // },
  {
    label: 'Delivery Application No',
    field: 'deliveryNo',
    type: 'string',
  },
  {
    label: 'CHA',
    field: 'chaId',
    type: 'string',
  }
];
