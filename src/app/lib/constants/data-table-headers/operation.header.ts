import { IDataTableHeader } from "../../models";

export const OperationHeaders: IDataTableHeader[] = [
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
    field: 'operationType',
    label: 'Type',
    type: 'string',
  },
  {
    field: 'clauseOrder',
    label: 'Clause',
    type: 'string',
  },
  {
    field: 'operationSDesc',
    label: 'Short Description',
    type: 'string',
  },
  {
    field: 'operationDesc',
    label: 'Description',
    type: 'string',
  },
];
