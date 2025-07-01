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
];
