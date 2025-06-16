import { IDataTableHeader } from "../../models";

export const ExaminationHeaders: IDataTableHeader[] = [
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
    field: 'examinationFor',
    label: 'Examination For',
    type: 'string',
  },
  {
    field: 'examinationPercent',
    label: 'Examination Percentage',
    type: 'number',
  },
  {
    field: 'ratePerPacket',
    label: 'Rate per Packet',
    type: 'price',
  },
  {
    field: 'minimumCharges',
    label: 'Minimum Charges',
    type: 'price',
  }
];
