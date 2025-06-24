import { IDataTableHeader } from "../../models";

export const TransportationHeaders: IDataTableHeader[] = [
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
    label: 'Effective Date',
    field: 'effectiveDate',
    type: 'date',
  },
  {
    field: 'sacCode',
    label: 'Sac Code',
    type: 'string',
  },
  {
    field: 'applicableForName',
    label: 'Applicable For',
    type: 'string',
  },
  {
    field: 'value',
    label: 'Value',
    type: 'string',
  },
  {
    field: 'rate',
    label: 'Rate ',
    type: 'price',
  }
];
