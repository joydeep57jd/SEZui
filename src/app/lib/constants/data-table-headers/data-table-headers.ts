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

export const DATA_TABLE_HEADERS = {
  GATE_OPERATION: {
    GATE_IN: GateInHeaders
  },
  MASTER: {
    HT_CHARGES: {
      UNLOADING_LOADING: UnloadingLoadingHeaders,
    },
    SAC: SacHeaders,
    OPERATION: OperationHeaders,
    EXIM_TRADER: EximTreaderHeaders,
    COMMODITY: CommodityHeaders,
    GODOWN: GodownHeaders,
    PORT: PortHeaders,
    CWC_CHARGES: {
      ENTRY_FEES: EntryFeeHeaders
    }
  },
  IMPORT: {
    OBL_ENTRY: OblEntryHeaders,
  }
}
