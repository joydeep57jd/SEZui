export const API = {
  MASTER: {
    HT_CHARGES: {
      UNLOADING_LOADING: {
        LIST: "Sez/GetAllHTCharges",
        SAVE: "Sez/AddEditHTCharges",
      },
      HANDLING: {
        LIST: "Sez/GetAllHandlingCharges",
        SAVE: "Sez/AddEditHandlingCharges",
      },
      TRANSPORTATION: {
        LIST: "Sez/GetTransportationCharges",
        SAVE: "Sez/AddEditTransportationCharges",
      },
    },
    SAC: {
      LIST: "Sez/GetMstSac",
      SAVE: "Sez/AddEditMstSac",
    },
    OPERATION: {
      LIST: "Sez/GetMstOperation",
      SAVE: "Sez/AddEditMstOperation",
    },
    PARTY: {
      LIST: "Sez/GetmstParty",
    },
    EXIM_TRADER: {
      LIST: "Sez/GetMstEximTraderMaster",
    },
    COMMODITY: {
      LIST: "Sez/GetMstCommodity",
      SAVE: "Sez/AddEditMstCommodity",
    },
    GODOWN: {
      LIST: "Sez/GetMstGoDown",
      SAVE: "Sez/AddEditGoDown",
    },
    PORT: {
      LIST: "Sez/GetPort",
      SAVE: "Sez/AddEditPort",
    },
    CWC_CHARGES: {
      ENTRY_FEES: {
        LIST: "Sez/GetMstEntryFee",
        SAVE: "Sez/AddEditMstEntryFee",
      },
      INSURANCE_CHARGE: {
        LIST: "Sez/GetMstInsurance",
        SAVE: "Sez/AddEditMstInsurance",
      },
      OVER_TIME: {
        LIST: "Sez/GetOverTimeCharge",
        SAVE: "Sez/AddEditOverTimeCharge",
      },
      EXAMINATION: {
        LIST: "Sez/GetExaminationCharge",
        SAVE: "Sez/AddEditExaminationCharge",
      },
      RENT_OFFICE_SPACE: {
        LIST: "Sez/GetRequestRentOfficeSpaceCharges",
        SAVE: "Sez/AddEditRequestRentOfficeSpaceCharges",
      },
      RENT_TABLE_SPACE: {
        LIST: "Sez/GetRentTableSpaceCharges",
        SAVE: "Sez/AddEditRentTableSpaceCharges",
      },
      STORAGE_CHARGE: {
        LIST: "Sez/GetStorageChargesGodown",
        SAVE: "Sez/AddEditStorageChargesGodown",
      },
    },
    COUNTRY: "Sez/GetCountry",
    STATE: "Sez/GetState",
    PACK_UQC: "Sez/GetPackUQC",
  },
  GATE_OPERATION: {
    GATE_IN: {
      LIST: "Sez/GetAllEntries",
      SAVE: "Sez/AddEditEntry",
      CONTAINER_LIST: "Sez/GetContainerlistByOBLEntry",
    },
    GATE_PASS: {
      LIST: "Sez/GetPassHeader",
      SAVE: "Sez/CreateGatePass",
      GATE_PASS_DETAILS: "Sez/GetPassDetails",
      OBL_DETAILS: "Sez/GetGatePassDetailsStructured"
    },
    GATE_EXIT: {
      LIST: "Sez/GetExitThroughHeader",
      SAVE: "Sez/CreateExitThroughGate",
      GATE_EXIT_DETAILS: "Sez/GetExitThroughDetails",
    },
  },
  IMPORT: {
    OBL_ENTRY: {
      LIST: "Sez/GetOblEntry",
      SAVE: "Sez/AddOblEntry",
      ADDITIONAL_INFO: "Sez/GetOblEntryAdditionalDetails",
      CONTAINER_LIST: "Sez/GetContainerlistByGetEntry",
    },
    YARD_INVOICE: {
      SAVE: "Sez/AddEditYardInvoice",
      OBL_CONTAINER_LIST: "Sez/GetOBLContainerList",
      IMPORT_CHARGES: "Sez/GetImportCharges",
      TRANSPORTATION_CHARGES: "Sez/GetImportTransportChargesCalc",
      INSURANCE_CHARGE: "Sez/GetImportInsuranceChargesCalc",
      CHARGE_TYPE: "Sez/GetAllChargesTypes",
      LIST: "Sez/GetYardInvoice?IsLoadContainerInvoice=false",
      INVOICE_DETAILS: "Sez/GetImportChargesInvoice",
      APPLICATION_LIST: "Sez/GetCustomAppraisementApplicationHeader"
    },
    GODOWN_INVOICE: {
      SAVE: "Sez/AddGodownInvoice",
      OBL_CONTAINER_LIST: "Sez/GetOBLContainerList",
      IMPORT_CHARGES: "Sez/GetImportCharges",
      STORAGE_CHARGES: "Sez/GetImportStorageChargesCalc",
      INSURANCE_CHARGE: "Sez/GetImportInsuranceChargesCalc",
      CHARGE_TYPE: "Sez/GetAllChargesTypes",
      LIST: "Sez/GetGodownInvoice",
      INVOICE_DETAILS: "Sez/GetGodownChargesInvoice",
    },
    CUSTOM_APPRAISEMENT: {
      LIST: "Sez/GetCustomAppraisementApplicationHeader",
      SAVE: "Sez/AddEditCustomAppraisementApplicationHeader",
      ISSUER_DETAILS: "Sez/GetAppraisementDoDetails",
      CONTAINER_DETAILS: "Sez/GetAppraisementContainerDetails",
      OBL_LIST: "Sez/GetOBLEntriesWithDetails",
      CONTAINER_LIST: "Sez/GetCbtContainerDetailsList",
    },
    DESTUFFING_ENTRY: {
      LIST: "Sez/GetDestuffingEntryHdr",
      SAVE: "Sez/AddEditDestuffingEntry",
      ENTRY_DETAILS: "Sez/GetDestuffingEntryDtl",
      CONTAINER_LIST: "Sez/GetCbtContainerDetailsList",
    },
    DELIVERY_APPLICATION: {
      LIST: "Sez/GetImpDeliveryApplicationHdr",
      SAVE: "Sez/AddEditDeliveryApplication",
      ENTRY_DETAILS: "Sez/GetImpDeliveryApplicationDtl",
      OBL_LIST: "Sez/GetOBLContainerList",
      DESTUFFING_LIST: "Sez/GetDestuffingEntryHdr",
    }
  },
  CASH_MANAGEMENT: {
    PAYMENT_RECEIPT: {
      LIST: "Sez/GetPaymentReceiptHeader",
      SAVE: "Sez/AddEditPaymentReceipt",
      INVOICE_LIST: "Sez/GetPaymentReceiptInvoiceDetails",
      PAYMENT_RECEIPT_DETAILS: "Sez/GetPaymentDetails",
    },
    REGISTER_OF_OUTWARD_SUPPLY: {
      REPORT: "Sez/GetRegisterOfOutwardSupplyReport",
      REPORT_INVOICE: "Sez/GetRegisterOfOutwardSupplyReportInvoice",
      REPORT_CANCEL: "Sez/GetRegisterOfOutwardSupplyReportCancel",
    },
    DAILY_CASH_BOOK: {
      REPORT: "Sez/GetDailyCashBookReport",
    }
  },
  EXPORT: {
    CCIN_ENTRY: {
      LIST: "Sez/GetCCINEntry",
      SAVE: "Sez/AddEditCCINEntry",
    },
    CONTAINER_STUFFING: {
      LIST: "Sez/GetContainerStuffingHdr",
      SAVE: "Sez/AddEditContainerStuffing",
      CONTAINER_STUFFING_DETAILS: "Sez/GetContainerStuffingDtl",
    },
    LOAD_CONTAINER_REQUEST: {
      LIST: "Sez/GetLoadContainerHeader",
      SAVE: "Sez/CreateLoadContainerRequest",
      ENTRY_DETAILS: "Sez/GetLoadContainerDetails",
      CONTAINER_LIST: "Sez/GetGetInContainerList",
      SHIPPING_BILL_LIST: "Sez/GetCCINEntryBySBNo",
    },
    LOAD_CONTAINER_INVOICE: {
      SAVE: "Sez/AddEditYardInvoice",
      IMPORT_CHARGES: "Sez/GetExportEntryFeeChargesResponse",
      HANDLING_CHARGES: "Sez/GetHandlingChargesCalc",
      INSURANCE_CHARGE: "Sez/GetExportInsuranceChargesCalc",
      CHARGE_TYPE: "Sez/GetAllChargesTypes",
      LIST: "Sez/GetYardInvoice?IsLoadContainerInvoice=true",
      INVOICE_DETAILS: "Sez/GetImportChargesInvoice",
      CONTAINER_LIST: "Sez/GetContainerlistForLoadedContainerInvoice",
    }
  },
};
