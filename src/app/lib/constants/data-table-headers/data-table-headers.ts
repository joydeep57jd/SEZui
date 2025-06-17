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

export const DATA_TABLE_HEADERS = {
  GATE_OPERATION: {
    GATE_IN: GateInHeaders
  },
  MASTER: {
    HT_CHARGES: {
      UNLOADING_LOADING: UnloadingLoadingHeaders,
      HANDLING: HandlingHeaders,
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
    }
  },
  IMPORT: {
    OBL_ENTRY: OblEntryHeaders,
    CUSTOM_APPRAISEMENT: {
      MAIN: CustomAppraisementHeaders,
      ISSUER: CustomAppraisementIssuerHeaders
    },
  }
}
