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
  },
  GATE_OPERATION: {
    GATE_IN: {
      LIST: "Sez/GetAllEntries",
      SAVE: "Sez/AddEditEntry",
    },
    GATE_PASS: {
      LIST: "Sez/GetPassHeader",
      SAVE: "Sez/CreateGatePass",
      GATE_PASS_DETAILS: "Sez/GetPassDetails",
    }
  },
  IMPORT: {
    OBL_ENTRY: {
      LIST: "Sez/GetOblEntry",
      SAVE: "Sez/AddOblEntry",
      ADDITIONAL_INFO: "Sez/GetOblEntryAdditionalDetails",
      CONTAINER_LIST: "Sez/GetCbtContainerDetailsList",
    },
    YARD_INVOICE: {
      SAVE: "Sez/AddEditYardInvoice",
      OBL_CONTAINER_LIST: "Sez/GetOBLContainerList",
      CHARGE_DETAILS: "Sez/GetImportCharges",
      CHARGE_TYPE: "Sez/GetAllChargesTypes",
      LIST: "Sez/GetYardInvoice",
      INVOICE_DETAILS: "Sez/GetImportChargesInvoice",
    },
    CUSTOM_APPRAISEMENT: {
      LIST: "Sez/GetCustomAppraisementApplicationHeader",
      SAVE: "Sez/AddEditCustomAppraisementApplicationHeader",
      ISSUER_DETAILS: "Sez/GetAppraisementDoDetails",
      CONTAINER_DETAILS: "Sez/GetAppraisementContainerDetails",
      OBL_LIST: "Sez/GetOBLEntriesWithDetails",
      CONTAINER_LIST: "Sez/GetCbtContainerDetailsList",
    },
  },
  CASH_MANAGEMENT: {
    PAYMENT_RECEIPT: {
      LIST: "Sez/GetPaymentReceiptHeader",
      SAVE: "Sez/AddEditPaymentReceipt",
      INVOICE_LIST: "Sez/GetPaymentReceiptInvoiceDetails",
    },
  },
};
