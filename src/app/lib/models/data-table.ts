export interface IDataTableHeader {
  label: string;
  field: string;
  type: IDataTableDataType;
  width?: string;
  class?: string;
  valueClass?: string;
  icon?: string;
  deleteApiUrl?: string;
  isDeleteLabel?: boolean;
  valueGetter?: (record: any) => string;
  callback?: (record: any, index?: number) => void;
  redirectCallback?: (id: string) => string;
}

export type IDataTableDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'price'
  | 'icon'
  | 'sl';

export type SearchCriteria = IPageCriteria & Record<string, string | number>

export interface IPageCriteria {
  page: number;
  size: number;
  search?: string;
  reloadCount?: number;
}
