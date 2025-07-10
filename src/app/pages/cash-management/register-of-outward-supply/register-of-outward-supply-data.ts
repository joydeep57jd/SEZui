import {API} from "../../../lib";

export const REGISTER_OF_OUTWARD_SUPPLY_DATA = {
  types: [
    { value: API.CASH_MANAGEMENT.REGISTER_OF_OUTWARD_SUPPLY.REPORT_INVOICE, label: "Invoice" },
    // { value: "2", label: "Credit" },
    // { value: "3", label: "Debit" },
    // { value: "4", label: "Unpaid" },
    { value: API.CASH_MANAGEMENT.REGISTER_OF_OUTWARD_SUPPLY.REPORT_CANCEL, label: "Cancel Invoice" },
  ],

  excelHeaders: [
    {label: "Sl. No.", key: "", type: "sl"},
    {label: "GSTIN", key: "gstno"},
    {label: "Place\n" + "(Name of State)", key: "stateName"},
    {label: "Name of Customer to whom Service rendered", key: "customerName"},
    {label: "Period of Invoice", key: "periodOfInvoice"},
    {label: "Nature of Invoice\n" + "(Resv./Initial Fumigatiom/General Basic/Over & Above)", key: "natureOfInvoice"},
    {label: "HSN Code", key: "hsnCode"},
    {label: "Rate per\n" + "Bag/MT/Sqm", key: "ratePerBag"},
    {label: "Invoice No.", key: "invNo"},
    {label: "Date of Invoice", key: "invDate", type: 'date'},
    {label: "Value of Service" + "(Before Tax)", key: "taxableAmt"},
    {label: "IGST %", key: "igstRate"},
    {label: "IGST Amount", key: "igstAmt"},
    {label: "CGST %", key: "cgstRate"},
    {label: "CGST Amount", key: "cgstAmt"},
    {label: "SGST %", key: "sgstRate"},
    {label: "SGST Amount", key: "sgstAmt"},
    {label: "Total Invoice Value\n" + "(18=(11+13 or 11+15+17))", key: "total"},
    {label: "PaymentMode", key: "paymentMode"},
    {label: "Remarks", key: "remarks"},
  ]
};
