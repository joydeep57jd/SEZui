import { PATHS } from "src/app/lib";

export const MENU = [
  {
    label: 'Master',
    children: [
      { label: 'Commodity', path: PATHS.MASTER.COMMODITY },
      { label: 'CWC Charges', path: PATHS.MASTER.CWC_CHARGES.ROOT },
      { label: 'Exim Trader', path: PATHS.MASTER.EXIM_TRADER },
      { label: 'Godown', path: PATHS.MASTER.GODOWN },
      { label: 'H&T Charges', path: PATHS.MASTER.HT_CHARGES.ROOT },
      { label: 'Operation', path: PATHS.MASTER.OPERATION },
      { label: 'Port', path: PATHS.MASTER.PORT },
      { label: 'GST Against SAC', path: PATHS.MASTER.SAC },
    ],
  },
  {
    label: 'Gate Operation',
    children: [
      { label: 'Gate In', path: PATHS.GATE_OPERATION.GATE_IN },
      { label: 'Gate Exit', path: PATHS.GATE_OPERATION.GATE_EXIT },
      { label: 'Gate Pass', path: PATHS.GATE_OPERATION.GATE_PASS },
    ],
  },
  {
    label: 'Export',
    children: [
      { label: 'CCIN Entry', path: PATHS.EXPORT.CCIN_ENTRY, },
      { label: 'Load Container Request', path: PATHS.EXPORT.LOAD_CONTAINER_REQUEST },
      { label: 'Load Container Invoice', path: PATHS.EXPORT.LOAD_CONTAINER_INVOICE },
      // { label: 'Container Movement Invoice', path: PATHS.UNDER_DEVELOPMENT },
      // { label: 'Container Stuffing', path: PATHS.EXPORT.CONTAINER_STUFFING },
    ],
  },
  {
    label: 'Import',
    children: [
      { label: 'OBL Entry', path: PATHS.IMPORT.OBL_ENTRY },
      { label: 'Custom Appraisement', path: PATHS.IMPORT.CUSTOM_APPRAISEMENT, },
      { label: 'Yard Invoice', path: PATHS.IMPORT.YARD_INVOICE },
      // { label: 'Delivery Application', path: PATHS.IMPORT.DELIVERY_APPLICATION },
      // { label: 'Delivery Invoice', path: PATHS.UNDER_DEVELOPMENT },
      // { label: 'Destuffing Entry', path: PATHS.IMPORT.DESTUFFING_ENTRY },
      // { label: 'Godown Invoice', path: PATHS.IMPORT.GODOWN_INVOICE },
    ],
  },
  {
    label: 'Cash Management',
    children: [
      { label: 'Payment Receipt', path: PATHS.CASH_MANAGEMENT.PAYMENT_RECEIPT, },
      { label: 'Register Of Outward Supply', path: PATHS.CASH_MANAGEMENT.REGISTER_OF_OUTWARD_SUPPLY, },
      { label: 'Daily Cash Book', path: PATHS.CASH_MANAGEMENT.DAILY_CASH_BOOK, },
    ],
  },
]
