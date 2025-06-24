import { IDataTableHeader } from "../../models";

export const CustomAppraisementIssuerHeaders: IDataTableHeader[] = [
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
    label: 'Issued By',
    field: 'doIssuedBy',
    type: 'string',
  },
  {
    field: 'doValidDate',
    label: 'Do Valid Date',
    type: 'date',
  },
];
