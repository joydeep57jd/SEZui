import {GateInHeaders} from "./gate-in-header";
import {HTChargesHeaders} from "./ht-charges-header";
import {SacHeaders} from "./sac.header";
import {OperationHeaders} from "./operation.header";
import {EximTreaderHeaders} from "./exim-trader.header";
import {CommodityHeaders} from "./commodity.header";
import {GodownHeaders} from "./godown.header";
import {PortHeaders} from "./port.header";

export const DATA_TABLE_HEADERS = {
  GATE_OPERATION: {
    GATE_IN: GateInHeaders
  },
  MASTER: {
    HT_CHARGES: HTChargesHeaders,
    SAC: SacHeaders,
    OPERATION: OperationHeaders,
    EXIM_TRADER: EximTreaderHeaders,
    COMMODITY: CommodityHeaders,
    GODOWN: GodownHeaders,
    PORT: PortHeaders
  }
}
