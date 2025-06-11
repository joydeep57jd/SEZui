import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent} from "../../../components";
import {API, DATA_TABLE_HEADERS} from "../../../lib";

@Component({
  selector: 'app-exim-trader',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './exim-trader.component.html',
  styleUrls: ['./exim-trader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EximTraderComponent {
  readonly url = API.MASTER.EXIM_TRADER.LIST;
  readonly headers = DATA_TABLE_HEADERS.MASTER.EXIM_TRADER
}
