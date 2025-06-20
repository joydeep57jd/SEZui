import { Route } from '@angular/router';
import { PATHS } from '../../lib';

export const CASH_MANAGEMENT_ROUTES: Route[] = [
  {
    path: PATHS.CASH_MANAGEMENT.PAYMENT_RECEIPT,
    loadComponent: () => import('../..').then((c) => c.PaymentReceiptComponent),
    data: {title: "Payment Receipt"}
  },
];
