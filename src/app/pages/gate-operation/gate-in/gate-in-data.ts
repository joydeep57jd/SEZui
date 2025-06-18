export const GATE_IN_DATA = {
  operationsNames: [
    { value: "Import", label: "Import" },
    { value: "Export", label: "Export" },
    { value: "Empty Vehicle", label: "Empty Vehicle" },
  ],

  operationTypes: [
    { value: "Open Yard", label: "Open Yard" },
    { value: "RC-DC", label: "RC-DC" },
    { value: "Precious Cargo", label: "Precious Cargo" },
  ],

  deliveryTypes: [
    { value: "Yard", label: "Yard" },
    { value: "Godown", label: "Godown" },
  ],

  containerTypes: [
    { value: "Container", label: "Container" },
    { value: "CBT", label: "CBT" },
  ],

  sizes: [
    { value: "20", label: "20" },
    { value: "40", label: "40" },
  ],

  materialTypes: [
    { value: "High Value", label: "High Value" },
    { value: "Low Value", label: "Low Value" },
  ],

  icdCodePrefix: {
    Import: "IMP",
    Export: "EXP",
    "Empty Vehicle": "EMV",
  }
}
