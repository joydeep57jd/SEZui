import { IDataTableHeader } from "../../models";

export const DestuffingEntryDetailsHeaders: IDataTableHeader[] = [
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
    label: 'OBL/HBL No',
    field: 'oblHblNo',
    type: 'string',
  },
  {
    label: 'OBL/HBL Date',
    field: 'oblHblDate',
    type: 'date',
  },
  {
    field: 'lineNo',
    label: 'Line No',
    type: 'string',
  },
];
