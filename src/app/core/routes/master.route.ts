import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const MASTER_ROUTES: Route[] = [
  {
    path: PATHS.MASTER.COMMODITY,
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
    data: { title: "Commodity Master" }
  },
  {
    path: PATHS.MASTER.CWC_CHARGES,
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
    data: { title: "CWC Charges" }
  },
  {
    path: PATHS.MASTER.EXIM_TRADER,
    loadComponent: () => import('../..').then((c) => c.EximTraderComponent),
    data: { title: "Exim Trader Master" }
  },
  {
    path: PATHS.MASTER.GODOWN,
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
    data: { title: "Godown Master" }
  },
  {
    path: PATHS.MASTER.HT_CHARGES,
    loadComponent: () => import('../..').then((c) => c.HtChargesComponent),
    data: { title: "H&T Charges" }
  },
  {
    path: PATHS.MASTER.OPERATION,
    loadComponent: () => import('../..').then((c) => c.OperationsComponent),
    data: { title: "Operation Master" }
  },
  {
    path: PATHS.MASTER.PORT,
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
    data: { title: "Port Master" }
  },
  {
    path: PATHS.MASTER.SAC,
    loadComponent: () => import('../..').then((c) => c.SacComponent),
    data: { title: "GST Against SAC" }
  },
];
