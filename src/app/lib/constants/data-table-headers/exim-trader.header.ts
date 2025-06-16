import { IDataTableHeader } from "../../models";

export const EximTreaderHeaders: IDataTableHeader[] = [
  {
    field: 'slNo',
    label: 'SL No',
    type: 'sl',
    width: '60px',
    valueClass: 'text-center',
    class: 'text-center',
  },
  {
    field: 'operationType',
    label: 'Type',
    type: 'string',
  },
  {
    field: 'partyCode',
    label: 'Party Code',
    type: 'string',
  },
  {
    field: 'eximTraderName',
    label: 'Name',
    type: 'string',
  },
  {
    field: 'emailId',
    label: 'Email Id',
    type: 'string',
  },
  {
    field: 'contactPerson',
    label: 'Contact Person',
    type: 'string',
  },
  {
    field: 'gstNo',
    label: 'GST No',
    type: 'string',
  },
];
