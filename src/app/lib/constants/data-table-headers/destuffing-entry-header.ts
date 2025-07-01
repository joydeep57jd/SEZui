import { IDataTableHeader } from "../../models";

export const DestuffingEntryHeaders: IDataTableHeader[] = [
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
    label: 'Destuffing No',
    field: 'destuffingEntryNo',
    type: 'string',
  },
  {
    label: 'Destuffing Date',
    field: 'destuffingEntryDate',
    type: 'date',
  },
  {
    field: 'containerNo',
    label: 'Container / CBT No',
    type: 'string',
  }
];
