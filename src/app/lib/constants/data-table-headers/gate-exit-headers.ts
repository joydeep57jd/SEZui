import { IDataTableHeader } from "../../models";

export const GateExitHeaders: IDataTableHeader[] = [
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
    field: 'gateExitNo',
    label: 'Gate Exit No',
    type: 'string',
  },
  {
    field: 'gateExitDateTime',
    label: 'Exit Date & Time',
    type: 'date-time',
  },
  {
    field: 'gatePassNo',
    label: 'Gate Pass No',
    type: 'string',
  }
];
