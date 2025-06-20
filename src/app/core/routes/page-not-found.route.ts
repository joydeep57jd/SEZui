import { Route } from '@angular/router';
import { PATHS } from '../../lib';

export const PAGE_NOT_FOUND_ROUTES: Route[] = [
  {
    path: PATHS.PAGE_NOT_FOUND,
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
  },
  {
    path: PATHS.UNDER_DEVELOPMENT,
    data: { title: "Page is under development" },
    loadComponent: () => import('../..').then((c) => c.PageNotFoundComponent),
  }
];
