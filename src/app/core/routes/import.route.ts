import { Route } from '@angular/router';
import { PATHS } from 'src/app';

export const IMPORT_ROUTES: Route[] = [
  {
    path: PATHS.IMPORT.CUSTOM_APPRAISEMENT,
    loadComponent: () => import('../..').then((c) => c.CustomAppraisementComponent),
    data: { title: "Custom Appraisement Application" }
  },
  {
    path: PATHS.IMPORT.YARD_INVOICE,
    loadComponent: () => import('../..').then((c) => c.YardInvoiceComponent),
    data: { title: "Yard Invoice (FCL)" }
  },
  {
    path: PATHS.IMPORT.OBL_ENTRY,
    loadComponent: () => import('../..').then((c) => c.OblEntryComponent),
    data: { title: "OBL Entry" }
  },
  {
    path: PATHS.IMPORT.DESTUFFING_ENTRY,
    loadComponent: () => import('../..').then((c) => c.DestuffingEntryComponent),
    data: { title: "Destuffing Entry" }
  },
  {
    path: PATHS.IMPORT.DELIVERY_APPLICATION,
    loadComponent: () => import('../..').then((c) => c.DeliveryApplicationComponent),
    data: { title: "Merge DeliApp PaymentSheet IssueSlip Application" }
  },
  {
    path: PATHS.IMPORT.GODOWN_INVOICE,
    loadComponent: () => import('../..').then((c) => c.GodownInvoiceComponent),
    data: { title: "Payment Sheet / Invoice" }
  },
];
