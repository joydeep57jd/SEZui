import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IDataTableHeader } from 'src/app/lib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  @Input() headers!: IDataTableHeader[];
  @Input() records!: any[] | null;
  @Input() isFetching!: boolean;
  @Input() idKey!: string;
  @Input() slNumberStart: number = 0;

  @Output() redirect = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();

  getData(record: any, header: IDataTableHeader, index: number = 0) {
    if (header.valueGetter) {
      return header.valueGetter(record);
    }
    const value = record[header.field];
    switch (header.type) {
      case 'boolean':
        return record[header.field] ? 'Yes' : 'No';
      case 'date':
        return value ? this.datePipe.transform(new Date(value), 'MMMM d, y, h:mm a') : '';
      case 'number':
        return value;
      case 'price':
        return value;
      case 'string':
        return value;
      case 'sl':
        return  this.slNumberStart + index + 1;
      default:
        return '';
    }
  }

  iconClick(record: any, header: IDataTableHeader, index: number) {
    if (header.callback) {
      header.callback(record, index);
    } else if (header.redirectCallback) {
      this.router.navigate([header.redirectCallback(record[this.idKey])]);
    } else if (header.deleteApiUrl) {
      const deleteLabelHeader = this.headers.find((header) => header.isDeleteLabel);
      const name = deleteLabelHeader ? this.getData(record, deleteLabelHeader) : ''
      this.deleteRecord.emit({ record, header, name })
    }
  }
}
