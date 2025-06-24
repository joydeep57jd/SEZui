import { IDataTableHeader } from "../../models";

export const GatePassDetailsHeaders: IDataTableHeader[] = [
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
    label: 'Container No',
    field: 'containerNo',
    type: 'string',
  },
  {
    field: 'size',
    label: 'Container Size',
    type: 'string',
  },
  {
    field: 'vehicleNo',
    label: 'Vehicle No',
    type: 'string',
  },
];
