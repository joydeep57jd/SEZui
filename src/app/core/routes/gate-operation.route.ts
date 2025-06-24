import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const GATE_OPERATION_ROUTES: Route[] = [
  {
    path: PATHS.GATE_OPERATION.GATE_IN,
    loadComponent: () => import('../..').then((c) => c.GateInComponent),
    data: { title: "Gate In" }
  },
  {
    path: PATHS.GATE_OPERATION.GATE_EXIT,
    loadComponent: () => import('../..').then((c) => c.GateExitComponent),
    data: { title: "Exit Through Gate" }
  },
  {
    path: PATHS.GATE_OPERATION.GATE_PASS,
    loadComponent: () => import('../..').then((c) => c.GatePassComponent),
    data: { title: "Gate Pass" }
  },
];
