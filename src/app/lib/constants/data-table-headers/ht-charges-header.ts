import { IDataTableHeader } from "../../models";

export const HTChargesHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'string',
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
    field: 'eEffectiveDate',
    type: 'date',
  },
  {
    field: 'operationCode',
    label: 'Operation Code',
    type: 'string',
  },
  {
    field: 'commodityType',
    label: 'Commodity Type',
    type: 'string',
  },
  {
    field: 'transportFrom',
    label: 'Transport From',
    type: 'string',
  },
  {
    field: 'containerLoadType',
    label: 'FCL/LCL',
    type: 'string',
  },
  {
    field: 'cwcRate',
    label: 'CWC Rate',
    type: 'string',
  },
  {
    field: 'size',
    label: 'Size',
    type: 'string',
  },
];
