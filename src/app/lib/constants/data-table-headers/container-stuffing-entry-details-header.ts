import { IDataTableHeader } from "../../models";

export const ContainerStuffingEntryDetailsHeaders: IDataTableHeader[] = [
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
    label: 'Container /CBT No',
    field: 'containerNo',
    type: 'string',
  },
  {
    label: 'Shipping Bill No',
    field: 'shippingBillNo',
    type: 'string',
  },
  {
    label: 'Shipping Bill Date',
    field: 'shippingDate',
    type: 'date',
  },
  {
    label: 'Exporter',
    field: 'exporter',
    type: 'string',
  },
  {
    label: 'Stuffed Qty',
    field: 'stuffQuantity',
    type: 'string',
  },
  {
    label: 'Stuffed Wt',
    field: 'stuffWeight',
    type: 'string',
  },
  {
    label: 'MCINPCIN',
    field: 'mcinpcin',
    type: 'string',
  },
];
