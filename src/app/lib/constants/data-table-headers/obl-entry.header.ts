import { IDataTableHeader } from "../../models";

export const OblEntryHeaders: IDataTableHeader[] = [
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
    field: 'containerCBTNo',
    label: 'Container / CBT No',
    type: 'string',
  },
  {
    field: 'containerCBTSize',
    label: 'Container / CBT Size',
    type: 'string',
  },
  {
    field: 'igmNo',
    label: 'IGM No',
    type: 'string',
  },
  {
    field: 'igmDate',
    label: 'IGM Date',
    type: 'date',
  },
  {
    field: 'tpDate',
    label: 'TP Date',
    type: 'date',
  },
];
