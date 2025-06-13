import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {PATHS} from "../../../lib";

@Component({
  selector: 'app-ht-charges',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './ht-charges.component.html',
  styleUrls: ['./ht-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtChargesComponent {
  readonly tabs = [
    {path: PATHS.MASTER.HT_CHARGES.UNLOADING_LOADING, label: 'Unloading/Loading'},
    {path:PATHS.MASTER.HT_CHARGES.HANDLING, label: "Handling"},
    {path:PATHS.MASTER.HT_CHARGES.TRANSPORTATION, label: "Transportation"},
  ]
}
