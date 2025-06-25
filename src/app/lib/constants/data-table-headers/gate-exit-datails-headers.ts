import { IDataTableHeader } from "../../models";

export const GateExitDetailsHeaders: IDataTableHeader[] = [
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
    field: 'noOfPackages',
    label: 'No of Packages',
    type: 'string',
  },
  {
    field: 'vehicleNo',
    label: 'Vehicle No',
    type: 'string',
  },
  {
    label: 'Gross Weight',
    field: 'grossWeight',
    type: 'string',
  },
];
