export const API = {
  MASTER: {
    HT_CHARGES: {
      UNLOADING_LOADING: {
        LIST: "Sez/GetAllHTCharges",
        SAVE: "Sez/AddEditHTCharges",
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
  },
};
