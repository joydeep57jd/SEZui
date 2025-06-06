import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const DEFAULT_ROUTES: Route[] = [
  { path: PATHS.ROOT, pathMatch: 'full', redirectTo: PATHS.GATE_OPERATION.GATE_IN },
];
