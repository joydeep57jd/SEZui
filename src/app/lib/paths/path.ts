import { GATE_OPERATION_PATHS } from './gate-operation.path';
import { MASTER_PATHS } from './master.path';
import {IMPORT_PATHS} from "./import.path";

export const PATHS = {
  ROOT: "",
  MASTER: { ...MASTER_PATHS },
  GATE_OPERATION: { ...GATE_OPERATION_PATHS },
  IMPORT: { ...IMPORT_PATHS },
  UNDER_DEVELOPMENT: "under-development",
  PAGE_NOT_FOUND: '**',
};
