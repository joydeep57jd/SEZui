import { IDataTableHeader } from "../../models";

export const PortHeaders: IDataTableHeader[] = [
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
    label: 'Port Name',
    type: 'string',
  },
  {
    field: 'portAlias',
    label: 'Port Alias',
    type: 'string',
  },
  {
    field: 'country',
    label: 'Country',
    type: 'string',
  },
  {
    field: 'state',
    label: 'State',
    type: 'string',
  },
];
