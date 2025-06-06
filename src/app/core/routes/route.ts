import { Route } from '@angular/router';
import { NavBarComponent } from 'src/app';
import { DEFAULT_ROUTES } from './default.route';
import { PAGE_NOT_FOUND_ROUTES } from './page-not-found.route';
import { GATE_OPERATION_ROUTES } from './gate-operation.route';
import { MASTER_ROUTES } from './master.route';

export const ROUTES: Route[] = [
  ...DEFAULT_ROUTES,
  {
    path: '',
    component: NavBarComponent,
    children: [...GATE_OPERATION_ROUTES, ...MASTER_ROUTES, PAGE_NOT_FOUND_ROUTES[1]],
  },
  PAGE_NOT_FOUND_ROUTES[0],
];
