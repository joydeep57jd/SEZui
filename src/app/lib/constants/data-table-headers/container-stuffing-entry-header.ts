import { IDataTableHeader } from "../../models";

export const ContainerStuffingEntryHeaders: IDataTableHeader[] = [
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
  // {
  //   field: 'print',
  //   label: 'Print',
  //   type: 'icon',
  //   icon: 'fa fa-print',
  //   class: 'text-center',
  // },
  {
    label: 'Stuffing No',
    field: 'stuffingNo',
    type: 'string',
  },
  {
    label: 'Stuffing Date',
    field: 'stuffingDate',
    type: 'date',
  },
  {
    field: 'containerNo',
    label: 'Container No',
    type: 'string',
  }
];
