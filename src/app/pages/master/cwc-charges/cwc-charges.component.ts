import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {PATHS} from "../../../lib";

@Component({
  selector: 'app-cwc-charges',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cwc-charges.component.html',
  styleUrls: ['./cwc-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CwcChargesComponent {
  readonly tabs = [
    {path: PATHS.MASTER.CWC_CHARGES.ENTRY_FEES, label: 'Entry Fees'},
    {path:PATHS.MASTER.CWC_CHARGES.STORAGE_CHARGE, label: "Storage Charge(Godown)"},
    {path:PATHS.MASTER.CWC_CHARGES.INSURANCE_CHARGE, label: "Insurance Charge"},
    {path:PATHS.MASTER.CWC_CHARGES.RENT_OFFICE_SPACE, label: "Rent Office Space"},
    {path:PATHS.MASTER.CWC_CHARGES.RENT_TABLE_SPACE, label: "Rent Table Space"},
    {path:PATHS.MASTER.CWC_CHARGES.OVER_TIME, label: "Over Time"},
    {path:PATHS.MASTER.CWC_CHARGES.EXAMINATION, label: "Examination"},
  ]
}
