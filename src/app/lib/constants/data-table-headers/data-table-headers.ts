import {GateInHeaders} from "./gate-in-header";
import {HTChargesHeaders} from "./ht-charges-header";
import {SacHeaders} from "./sac.header";
import {OperationHeaders} from "./operation.header";

export const DATA_TABLE_HEADERS = {
  GATE_OPERATION: {
    GATE_IN: GateInHeaders
  },
  MASTER: {
    HT_CHARGES: HTChargesHeaders,
    SAC: SacHeaders,
    OPERATION: OperationHeaders
  }
}
