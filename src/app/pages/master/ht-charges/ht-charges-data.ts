export const HT_CHARGES_DATA = {
  operationTypes : [
    { value: 6, label: "Import" },
    { value: 6, label: "Import (RMS)" },
    { value: 6, label: "Export" },
    { value: 6, label: "General" },
  ],
  containerTypes : [
    { value: 1, label: "Empty Container" },
    { value: 2, label: "Loaded Container" },
    { value: 3, label: "Cargo" },
    { value: 4, label: "RMS" },
  ],
  types : [
    { value: 1, label: "General" },
    { value: 2, label: "Heavy/Scrap" },
  ],
  sizes : [
    { value: 20, label: 20 },
    { value: 40, label: 40 },
  ],
  commodityTypes : [
    { value: 1, label: "HAZ" },
    { value: 2, label: "Non HAZ" },
  ],
  containerLoadTypes : [
    { value: "FCL", label: "FCL" },
    { value: "LCL", label: "LCL" },
    { value: "DD", label: "DD" },
  ],
  transportFroms : [
    { value: "LONI", label: "LONI" },
    { value: "TKD", label: "TKD" },
    { value: "Yard", label: "Yard" },
  ],
  eximTypes : [
    { value: "Exim", label: "Exim" },
    { value: "RMS Exim", label: "RMS Exim" },
    { value: "RMS Non Exim", label: "RMS Non Exim" },
  ],
}

