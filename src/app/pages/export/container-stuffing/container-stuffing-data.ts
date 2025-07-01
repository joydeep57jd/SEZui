export const CONTAINER_STUFFING_DATA = {
  transportModes: [
    { value: 1, label: "By Train" },
    { value: 2, label: "By Road" },
  ],
  containerCBTSizes: [
    { value: "20", label: "20" },
    { value: "40", label: "40" },
  ],
  fclLclList: [
    { value: 1, label: "FCL" },
    { value: 2, label: "LCL" },
  ],
  origins: [
    { value: 1, label: "FAC" },
    { value: 2, label: "NON FAC" },
  ],
  viaList: [
    { value: 1, label: "ACTL" },
    { value: 2, label: "TKD" },
    { value: 3, label: "ROAD" },
  ],
  equipmentSealTypes: [
    { value: 1, label: "Bottle-Seal" },
    { value: 2, label: "E-Seal" },
    { value: 3, label: "Others" },
  ],
  equipmentStatuses: [
    { value: 1, label: "Intact" },
    { value: 2, label: "Damaged" },
  ],
  equipmentQucList: [
    { value: 1, label: "Package" },
    { value: 2, label: "Kilogram" },
  ]
}
