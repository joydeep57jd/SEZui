import { GATE_OPERATION_PATHS } from './gate-operation.path';
import { MASTER_PATHS } from './master.path';

export const PATHS = {
  ROOT: "",
  MASTER: { ...MASTER_PATHS },
  GATE_OPERATION: { ...GATE_OPERATION_PATHS },
  UNDER_DEVELOPMENT: "under-development",
  PAGE_NOT_FOUND: '**',
};
