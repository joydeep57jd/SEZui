import { IDataTableHeader } from "../../models";

export const SacHeaders: IDataTableHeader[] = [
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
    field: 'sacCode',
    label: 'SAC Code',
    type: 'string',
  },
  {
    field: 'gst',
    label: 'GST %',
    type: 'number',
  },
  {
    field: 'cess',
    label: 'CESS%',
    type: 'number',
  },
];
