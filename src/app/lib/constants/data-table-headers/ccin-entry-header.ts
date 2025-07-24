import { IDataTableHeader } from "../../models";

export const CcinEntryHeaders: IDataTableHeader[] = [
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
    label: 'CCIN App No',
    field: 'ccinNo',
    type: 'string',
  },
  {
    field: 'ccinDate',
    label: 'CCIN App Date',
    type: 'date',
  },
  {
    field: 'sbNo',
    label: 'SB No',
    type: 'string',
  },
  {
    field: 'sbDate',
    label: 'SB Date',
    type: 'date',
  },
];
