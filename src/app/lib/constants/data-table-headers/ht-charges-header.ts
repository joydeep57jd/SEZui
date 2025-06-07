import { IDataTableHeader } from "../../models";

export const HTChargesHeaders: IDataTableHeader[] = [
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
    field: 'operationId',
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
    field: 'rateCWC',
    label: 'CWC Rate',
    type: 'string',
  },
  {
    field: 'size',
    label: 'Size',
    type: 'string',
  },
];
