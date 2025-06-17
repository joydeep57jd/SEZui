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
        LIST: "Sez/GetAllTransportationCharges",
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
    },
    COUNTRY: "Sez/GetCountry",
    STATE: "Sez/GetState",
  },
  GATE_OPERATION: {
    GATE_IN: {
      LIST: "Sez/GetAllEntries",
      SAVE: "Sez/AddEditEntry",
    },
  },
  IMPORT: {
    OBL_ENTRY: {
      LIST: "Sez/GetOblEntry",
      SAVE: "Sez/AddOblEntry",
      ADDITIONAL_INFO: "Sez/GetOblEntryAdditionalDetails",
    },
    YARD_INVOICE: {
      SAVE: "Sez/AddEditYardInvoice",
    },
    CUSTOM_APPRAISEMENT: {
      LIST: "Sez/GetCustomAppraisement",
      SAVE: "Sez/AddEditCustomAppraisement",
    },
  },
};
