import { IDataTableHeader } from "../../models";

export const StorageChargeHeaders: IDataTableHeader[] = [
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
    field: 'storageForName',
    label: 'Storage For',
    type: 'string',
  },
  {
    field: 'areaTypeName',
    label: 'Area Type',
    type: 'string',
  },
  {
    field: 'basisName',
    label: 'Basis',
    type: 'string',
  },
  {
    field: 'ratePerSqmWeek',
    label: 'Rate Per SQM/Week',
    type: 'price',
  },
  {
    field: 'ratePerSqmMonth',
    label: 'Rate Per SQM/Month',
    type: 'price',
  }
];
