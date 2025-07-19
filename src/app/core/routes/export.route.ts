import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const EXPORT_ROUTES: Route[] = [
  {
    path: PATHS.EXPORT.CCIN_ENTRY,
    loadComponent: () => import('../..').then((c) => c.CcinEntryComponent),
    data: { title: "CCIN Entry" }
  },
  {
    path: PATHS.EXPORT.CONTAINER_STUFFING,
    loadComponent: () => import('../..').then((c) => c.ContainerStuffingComponent),
    data: { title: "Container/CBT Stuffing" }
  },
  {
    path: PATHS.EXPORT.LOAD_CONTAINER_REQUEST,
    loadComponent: () => import('../..').then((c) => c.LoadContainerRequestComponent),
    data: { title: "Loaded Container / CBT Request" }
  },
  {
    path: PATHS.EXPORT.LOAD_CONTAINER_INVOICE,
    loadComponent: () => import('../..').then((c) => c.LoadContainerInvoiceComponent),
    data: { title: "Payment Sheet / Invoice"}
  },
  {
    path: PATHS.EXPORT.GODOWN_INVOICE,
    loadComponent: () => import('../..').then((c) => c.ExportGodownInvoiceComponent),
    data: { title: "Payment Sheet / Invoice"}
  },
];
