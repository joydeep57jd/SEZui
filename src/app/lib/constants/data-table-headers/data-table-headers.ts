import {GateInHeaders} from "./gate-in-header";
import {UnloadingLoadingHeaders} from "./unloading-loading-header";
import {SacHeaders} from "./sac.header";
import {OperationHeaders} from "./operation.header";
import {EximTreaderHeaders} from "./exim-trader.header";
import {CommodityHeaders} from "./commodity.header";
import {GodownHeaders} from "./godown.header";
import {PortHeaders} from "./port.header";
import {OblEntryHeaders} from "./obl-entry.header";
import {EntryFeeHeaders} from "./entry-fee.header";
import {HandlingHeaders} from "./handling-header";
import {InsuranceChargeHeaders} from "./insurance-charge-header";
import {OverTimeHeaders} from "./over-time-header";
import {ExaminationHeaders} from "./examination-header";
import {CustomAppraisementHeaders} from "./custom-appraisement-header";
import {CustomAppraisementIssuerHeaders} from "./custom-appraisement-issuer-header";
import {CustomAppraisementContainerHeaders} from "./custom-appraisement-container-header";
import {YardInvoicePreviewHeaders} from "./yard-invoice-preview.header";
import {PaymentReceiptInvoiceHeaders} from "./payment-receipt-invoice.header";
import {YardInvoiceHeaders} from "./yard-invoice.header";
import {PaymentReceiptHeaders} from "./payment-receipt.header";
import {RentOfficeSpaceHeaders} from "./rent-office-space-header";
import {RentTableSpaceHeaders} from "./rent-table-space-header";
import {StorageChargeHeaders} from "./storage-charge-header";
import {TransportationHeaders} from "./transportaion-header";
import {GatePassHeaders} from "./gate-pass-headers";
import {GatePassDetailsHeaders} from "./gate-pass-datails-headers";
import {GateExitDetailsHeaders} from "./gate-exit-datails-headers";
import {GateExitHeaders} from "./gate-exit-headers";
import {CcinEntryHeaders} from "./ccin-entry-header";
import {DestuffingEntryHeaders} from "./destuffing-entry-header";
import {DestuffingEntryDetailsHeaders} from "./destuffing-entry-details-header";
import {ContainerStuffingEntryHeaders} from "./container-stuffing-entry-header";
import {ContainerStuffingEntryDetailsHeaders} from "./container-stuffing-entry-details-header";
import {DeliveryApplicationHeaders} from "./delivery-application-header";
import {DeliveryApplicationDetailsHeaders} from "./delivery-application-details-header";
import {LoadContainerRequestHeaders} from "./load-container-request-header";
import {LoadContainerRequestDetailsHeaders} from "./load-container-request-details-header";
import {GodownInvoiceHeaders} from "./godown-invoice.header";
import {GodownInvoicePreviewHeaders} from "./godown-invoice-preview.header";
import {LoadContainerInvoiceHeaders} from "./load-container-invoice.header";
import {LoadContainerInvoicePreviewHeaders} from "./load-container-invoice-preview.header";
import {CancelledInvoiceHeaders} from "./cancelled-invoice.header";
import {ExportGodownInvoiceHeaders} from "./export-godown-invoice.header";
import {ExportGodownInvoicePreviewHeaders} from "./export-godown-invoice-preview.header";
import {CreditNoteHeaders} from "./credit-note.header";

export const DATA_TABLE_HEADERS = {
  GATE_OPERATION: {
    GATE_IN: GateInHeaders,
    GATE_PASS: {
      MAIN: GatePassHeaders,
      GATE_PASS_DETAILS: GatePassDetailsHeaders,
    },
    GATE_EXIT: {
      MAIN: GateExitHeaders,
      GATE_EXIT_DETAILS: GateExitDetailsHeaders,
    }
  },
  MASTER: {
    HT_CHARGES: {
      UNLOADING_LOADING: UnloadingLoadingHeaders,
      HANDLING: HandlingHeaders,
      TRANSPORTATION: TransportationHeaders,
    },
    SAC: SacHeaders,
    OPERATION: OperationHeaders,
    EXIM_TRADER: EximTreaderHeaders,
    COMMODITY: CommodityHeaders,
    GODOWN: GodownHeaders,
    PORT: PortHeaders,
    CWC_CHARGES: {
      ENTRY_FEES: EntryFeeHeaders,
      INSURANCE_CHARGE: InsuranceChargeHeaders,
      OVER_TIME: OverTimeHeaders,
      EXAMINATION: ExaminationHeaders,
      RENT_OFFICE_SPACE: RentOfficeSpaceHeaders,
      RENT_TABLE_SPACE: RentTableSpaceHeaders,
      STORAGE_CHARGE: StorageChargeHeaders,
    }
  },
  IMPORT: {
    OBL_ENTRY: OblEntryHeaders,
    CUSTOM_APPRAISEMENT: {
      MAIN: CustomAppraisementHeaders,
      ISSUER: CustomAppraisementIssuerHeaders,
      CONTAINER: CustomAppraisementContainerHeaders,
    },
    YARD_INVOICE: {
      YARD_INVOICE_PREVIEW: YardInvoicePreviewHeaders,
      MAIN: YardInvoiceHeaders
    },
    DESTUFFING_ENTRY: {
      MAIN: DestuffingEntryHeaders,
      DETAILS: DestuffingEntryDetailsHeaders,
    },
    DELIVERY_APPLICATION: {
      MAIN: DeliveryApplicationHeaders,
      DETAILS: DeliveryApplicationDetailsHeaders,
    },
    GODOWN_INVOICE: {
      MAIN: GodownInvoiceHeaders,
      GODOWN_INVOICE_PREVIEW: GodownInvoicePreviewHeaders,
    }
  },
  CASH_MANAGEMENT: {
    PAYMENT_RECEIPT_INVOICE: PaymentReceiptInvoiceHeaders,
    PAYMENT_RECEIPT: PaymentReceiptHeaders,
    CANCEL_INVOICE: CancelledInvoiceHeaders,
    CREDIT_NOTE: CreditNoteHeaders
  },
  EXPORT: {
    CCIN_ENTRY: CcinEntryHeaders,
    CONTAINER_STUFFING: {
      MAIN: ContainerStuffingEntryHeaders,
      DETAILS: ContainerStuffingEntryDetailsHeaders,
    },
    LOAD_CONTAINER_REQUEST: {
      MAIN: LoadContainerRequestHeaders,
      DETAILS: LoadContainerRequestDetailsHeaders,
    },
    LOAD_CONTAINER_INVOICE: {
      MAIN: LoadContainerInvoiceHeaders,
      LOAD_CONTAINER_INVOICE_PREVIEW: LoadContainerInvoicePreviewHeaders,
    },
    GODOWN_INVOICE: {
      MAIN: ExportGodownInvoiceHeaders,
      GODOWN_INVOICE_PREVIEW: ExportGodownInvoicePreviewHeaders,
    }
  },
}
