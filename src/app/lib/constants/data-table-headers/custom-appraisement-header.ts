import { IDataTableHeader } from "../../models";

export const CustomAppraisementHeaders: IDataTableHeader[] = [
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
    field: 'appraisementNo',
    label: 'Appraisement No',
    type: 'string',
  },
  {
    field: 'appraisementDate',
    label: 'Appraisement Date',
    type: 'date',
  },
  {
    field: 'containerCBTNo',
    label: 'Container / CBT No',
    type: 'string',
  }
];
