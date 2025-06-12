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
    field: 'portName',
    label: 'Container / CBT No',
    type: 'string',
  },
  {
    field: 'portAlias',
    label: 'Container / CBT Size',
    type: 'string',
  },
  {
    field: 'countryName',
    label: 'IGM No',
    type: 'string',
  },
  {
    field: 'stateName',
    label: 'IGM Date',
    type: 'date',
  },
  {
    field: 'stateName',
    label: 'OBL/HBL Date',
    type: 'date',
  },
];
