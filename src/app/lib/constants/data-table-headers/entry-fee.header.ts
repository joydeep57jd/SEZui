import { IDataTableHeader } from "../../models";

export const EntryFeeHeaders: IDataTableHeader[] = [
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
    field: 'effectiveDate',
    label: 'Effective Date',
    type: 'date',
  },
  {
    field: 'sacCode',
    label: 'SAC Code',
    type: 'string',
  },
  {
    field: 'ratePerPacket',
    label: 'Rate Per Packet',
    type: 'price',
  },
  {
    field: 'minimumRate',
    label: 'Minimum Rate',
    type: 'price',
  },
  {
    field: 'maximumRate',
    label: 'Maximum Rate',
    type: 'price',
  },
];
