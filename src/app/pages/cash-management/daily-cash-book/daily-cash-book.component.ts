import {ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ApiService, UtilService} from "../../../services";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {API} from "../../../lib";
import {DailyCashbookPrintComponent} from "./daily-cashbook-print/daily-cashbook-print.component";
import {PrintService} from "../../../services/print.service";
import {DAILY_CASHBOOK_REPORT_CSS} from "../../../lib/constants/daily-cashbook-report-css";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {DAILY_CASHBOOK_DATA} from "./daily-cashbook-data";

@Component({
  selector: 'app-daily-cash-book',
  standalone: true,
  imports: [CommonModule, NgbInputDatepicker, ReactiveFormsModule, DailyCashbookPrintComponent],
  templateUrl: './daily-cash-book.component.html',
  styleUrls: ['./daily-cash-book.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCashBookComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService)
  printService = inject(PrintService);
  datePipe = inject(DatePipe)

  readonly apiUrls = API.CASH_MANAGEMENT.DAILY_CASH_BOOK

  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  form!: FormGroup;
  isPrinting = signal(false);
  pdfData = signal([])
  pdfMetaData = signal({})

  constructor() {
    this.makeForm()
  }

  makeForm() {
    this.form = new FormGroup({
      fromDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
      toDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
    });
  }

  submit(isExcel = false) {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = this.form.value;
      const params = {
        fromDate: this.utilService.getDateObject(value.fromDate),
        toDate: this.utilService.getDateObject(value.toDate),
      }
      this.isPrinting.set(true);
      this.apiService.get(this.apiUrls.REPORT, params).subscribe({
        next: (response: any) => {
          this.isPrinting.set(false);
          const fileName = this.getFileName(params);
          if(isExcel) {
            this.download(response.data, fileName)
          } else {
            this.pdfData.set(response.data);
            this.pdfMetaData.set(params);
            setTimeout(() => {
              this.printService.print(
                this.invoiceSection,
                fileName,
                DAILY_CASHBOOK_REPORT_CSS
              )
            }, 100)
          }
        }, error: () => {
          this.isPrinting.set(false);
        }
      })
    }
  }

  getFileName(params: any) {
    return `DailyCashBookReport_${this.datePipe.transform(params.fromDate, 'dd-MM-yyyy')} - ${this.datePipe.transform(params.toDate, 'dd-MM-yyyy')}`
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  download(reportData: any[], fileName: string){
    const dataLength = reportData?.length ?? 0;
    const wsData = this.makeWorkSheetData(reportData ?? [])
    const heading = { s: { r: 0, c: 0 }, e: { r: 0, c: DAILY_CASHBOOK_DATA.excelHeaders.length - 1 } };
    const sumFormulaENTCharge = `=SUM(I3:I${dataLength + 2})`;
    const sumFormulaEXMCharge = `=SUM(J3:J${dataLength + 2})`;
    const sumFormulaTRPCharge = `=SUM(K3:K${dataLength + 2})`;
    const sumFormulaINSCharge = `=SUM(L3:L${dataLength + 2})`;
    const sumFormulaHANCharge = `=SUM(M3:M${dataLength + 2})`;
    const sumFormulaCgst = `=SUM(P3:P${dataLength + 2})`;
    const sumFormulaSgst = `=SUM(Q3:Q${dataLength + 2})`;
    const sumFormulaIgst = `=SUM(R3:R${dataLength + 2})`;
    const sumFormulaTotal = `=SUM(S3:S${dataLength + 2})`;

    const ws = XLSX.utils.json_to_sheet(wsData)

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push(heading);

    XLSX.utils.sheet_set_array_formula(ws, `I${dataLength + 3}`, sumFormulaENTCharge);
    XLSX.utils.sheet_set_array_formula(ws, `J${dataLength + 3}`, sumFormulaEXMCharge);
    XLSX.utils.sheet_set_array_formula(ws, `K${dataLength + 3}`, sumFormulaTRPCharge);
    XLSX.utils.sheet_set_array_formula(ws, `L${dataLength + 3}`, sumFormulaINSCharge);
    XLSX.utils.sheet_set_array_formula(ws, `M${dataLength + 3}`, sumFormulaHANCharge);
    XLSX.utils.sheet_set_array_formula(ws, `P${dataLength + 3}`, sumFormulaCgst);
    XLSX.utils.sheet_set_array_formula(ws, `Q${dataLength + 3}`, sumFormulaSgst);
    XLSX.utils.sheet_set_array_formula(ws, `R${dataLength + 3}`, sumFormulaIgst);
    XLSX.utils.sheet_set_array_formula(ws, `S${dataLength + 3}`, sumFormulaTotal);

    if(reportData.length) {
      ws['A1'].v = `${reportData[0].companyName}\n${reportData[0].stateName}`
    }

    DAILY_CASHBOOK_DATA.excelHeaders.forEach((header, index) => {
      ws[`${DAILY_CASHBOOK_DATA.shellNames[index]}2`].v = header.label;
    })
    ws[`A${dataLength + 3}`].v = "Total"
    // setTimeout(() => {
      const wb = {
        Sheets: { [`Sheet1`]: ws },
        SheetNames: [`Sheet1`],
      }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blobData = new Blob([excelBuffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      FileSaver.saveAs(blobData, `${fileName}.xlsx`)
    // }, 0)
  }

  makeWorkSheetData(data: any) {
    const headers = DAILY_CASHBOOK_DATA.excelHeaders;
    return [
      headers.reduce((prev: any, cur: any, index: number) => {
        return { ...prev, [cur.label]: '' }
      }, {}),
      ...data?.map((element: any, index: number) => {
        return headers.reduce((prev: any, cur: any) => {
          let value: any = element[cur.key];
          if(cur.type == 'sl') value = index+1;
          if(cur.type == 'date') value = this.datePipe.transform(value, 'dd/MM/yyyy');
          if(cur.valueGetter) value = cur.valueGetter(element);
          return { ...prev, [cur.label]: value }
        }, {})
      }),
      headers.reduce((prev: any, cur: any) => {
        return { ...prev, [cur.label]: '' }
      }, {})
    ]
  }
}
