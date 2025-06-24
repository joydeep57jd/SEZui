import { IDataTableHeader } from "../../models";

export const GatePassHeaders: IDataTableHeader[] = [
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
    field: 'print',
    label: 'Print',
    type: 'icon',
    icon: 'fa fa-print',
    class: 'text-center',
  },
  {
    field: 'gatePassNo',
    label: 'Gate Pass No',
    type: 'string',
  },
  {
    field: 'gatePssDate',
    label: 'Gate Pass Date',
    type: 'date',
  },
  {
    field: 'invoiceNo',
    label: 'Invoice No',
    type: 'string',
  },
  {
    field: 'isCancelled',
    label: 'Is Cancelled',
    type: 'string',
    valueGetter: (row) => row.isCancelled ?? 'No',
    valueClass: 'text-center',
    class: 'text-center',
  },
];
