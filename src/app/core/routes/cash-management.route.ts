import { Route } from '@angular/router';
import { PATHS } from '../../lib';

export const CASH_MANAGEMENT_ROUTES: Route[] = [
  {
    path: PATHS.CASH_MANAGEMENT.PAYMENT_RECEIPT,
    loadComponent: () => import('../..').then((c) => c.PaymentReceiptComponent),
    data: {title: "Payment Receipt"}
  },
  {
    path: PATHS.CASH_MANAGEMENT.CANCEL_INVOICE,
    loadComponent: () => import('../..').then((c) => c.CancelInvoiceComponent),
    data: {title: "Cancel Invoice"}
  },
  {
    path: PATHS.CASH_MANAGEMENT.REGISTER_OF_OUTWARD_SUPPLY,
    loadComponent: () => import('../..').then((c) => c.RegisterOfOutwardSupplyComponent),
    data: {title: "Register of Outward Supply"}
  },
  {
    path: PATHS.CASH_MANAGEMENT.DAILY_CASH_BOOK,
    loadComponent: () => import('../..').then((c) => c.DailyCashBookComponent),
    data: {title: "Daily Cash Book"}
  },
];
