import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const MASTER_ROUTES: Route[] = [
  {
    path: PATHS.MASTER.COMMODITY,
    loadComponent: () => import('../..').then((c) => c.CommodityComponent),
    data: { title: "Commodity Master" }
  },
  {
    path: PATHS.MASTER.CWC_CHARGES.ROOT,
    loadComponent: () => import('../..').then((c) => c.CwcChargesComponent),
    data: { title: "CWC Charges" },
    children: [
      {
        path: "", pathMatch: 'full', redirectTo: PATHS.MASTER.CWC_CHARGES.ENTRY_FEES,
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.ENTRY_FEES,
        loadComponent: () => import('../..').then((c) => c.EntryFeesComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.STORAGE_CHARGE,
        loadComponent: () => import('../..').then((c) => c.StorageChargeComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.INSURANCE_CHARGE,
        loadComponent: () => import('../..').then((c) => c.InsuranceChargeComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.RENT_OFFICE_SPACE,
        loadComponent: () => import('../..').then((c) => c.RentOfficeSpaceComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.RENT_TABLE_SPACE,
        loadComponent: () => import('../..').then((c) => c.RentTableSpaceComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.OVER_TIME,
        loadComponent: () => import('../..').then((c) => c.OverTimeComponent),
        data: { title: "CWC Charges" },
      },
      {
        path: PATHS.MASTER.CWC_CHARGES.EXAMINATION,
        loadComponent: () => import('../..').then((c) => c.ExaminationComponent),
        data: { title: "CWC Charges" },
      },
    ]
  },
  {
    path: PATHS.MASTER.EXIM_TRADER,
    loadComponent: () => import('../..').then((c) => c.EximTraderComponent),
    data: { title: "Exim Trader Master" }
  },
  {
    path: PATHS.MASTER.GODOWN,
    loadComponent: () => import('../..').then((c) => c.GodownComponent),
    data: { title: "Godown Master" }
  },
  {
    path: PATHS.MASTER.HT_CHARGES.ROOT,
    loadComponent: () => import('../..').then((c) => c.HtChargesComponent),
    data: { title: "H&T Charges" },
    children: [
      {
        path: "", pathMatch: 'full', redirectTo: PATHS.MASTER.HT_CHARGES.UNLOADING_LOADING,
      },
      {
        path: PATHS.MASTER.HT_CHARGES.UNLOADING_LOADING,
        loadComponent: () => import('../..').then((c) => c.UnloadingLoadingComponent),
        data: { title: "H&T Charges" },
      },
      {
        path: PATHS.MASTER.HT_CHARGES.HANDLING,
        loadComponent: () => import('../..').then((c) => c.HandlingComponent),
        data: { title: "H&T Charges" },
      },
      {
        path: PATHS.MASTER.HT_CHARGES.TRANSPORTATION,
        loadComponent: () => import('../../').then((c) => c.TarnsportationComponent),
        data: { title: "H&T Charges" },
      }
    ]
  },
  {
    path: PATHS.MASTER.OPERATION,
    loadComponent: () => import('../..').then((c) => c.OperationsComponent),
    data: { title: "Operation Master" }
  },
  {
    path: PATHS.MASTER.PORT,
    loadComponent: () => import('../..').then((c) => c.PortComponent),
    data: { title: "Port Master" }
  },
  {
    path: PATHS.MASTER.SAC,
    loadComponent: () => import('../..').then((c) => c.SacComponent),
    data: { title: "GST Against SAC" }
  },
];
