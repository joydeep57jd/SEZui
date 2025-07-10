import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ApiService, UtilService} from "../../../services";
import {REGISTER_OF_OUTWARD_SUPPLY_DATA} from "./register-of-outward-supply-data";

@Component({
  selector: 'app-register-of-outward-supply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbInputDatepicker],
  templateUrl: './register-of-outward-supply.component.html',
  styleUrls: ['./register-of-outward-supply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterOfOutwardSupplyComponent {
  apiService = inject(ApiService);
  utilService = inject(UtilService)

  readonly types = REGISTER_OF_OUTWARD_SUPPLY_DATA.types;

  form!: FormGroup;
  isPrinting = signal(false);

  constructor() {
    this.makeForm()
  }

  makeForm() {
    this.form = new FormGroup({
      fromDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
      toDate: new FormControl(this.utilService.getNgbDateObject(new Date()), [Validators.required]),
      invoiceType: new FormControl("", [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = this.form.value;
      const params = {
        fromDate: this.utilService.getDateObject(value.fromDate),
        toDate: this.utilService.getDateObject(value.toDate),
      }
      this.isPrinting.set(true);
      this.apiService.get(value.invoiceType, params).subscribe({
        next: (response: any) => {
          this.isPrinting.set(false);
          // window.open(response.data, '_blank');
          this.download(response.data)
        }, error: () => {
          this.isPrinting.set(false);
        }
      })
    }
  }

  hasError(formControlName: string) {
    const control = this.form.get(formControlName);
    return control?.touched && control.invalid;
  }

  download(reportData: any[]){
    const wsData = this.makeWorkSheetData(reportData ?? [])
    const heading = { s: { r: 0, c: 0 }, e: { r: 0, c: REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders.length - 1 } };
    const slNo = { s: { r: 1, c: 0 }, e: { r: 3, c: 0 } };
    const gst = { s: { r: 1, c: 1 }, e: { r: 3, c: 1 } };
    const place = { s: { r: 1, c: 2 }, e: { r: 3, c: 2 } };
    const customer = { s: { r: 1, c: 3 }, e: { r: 3, c: 3 } };
    const period = { s: { r: 1, c: 4 }, e: { r: 3, c: 4 } };
    const nature = { s: { r: 1, c: 5 }, e: { r: 3, c: 5 } };
    const hsn = { s: { r: 1, c: 6 }, e: { r: 3, c: 6 } };
    const rate = { s: { r: 1, c: 7 }, e: { r: 3, c: 7} };
    const invoice = { s: { r: 1, c: 8 }, e: { r: 1, c: 10} };
    const rateOfTax = { s: { r: 1, c: 11 }, e: { r: 1, c: 16} };
    const invoiceNo = { s: { r: 2, c: 8 }, e: { r: 3, c: 8} };
    const invoiceDate = { s: { r: 2, c: 9 }, e: { r: 3, c: 9} };
    const valueOfService = { s: { r: 2, c: 10 }, e: { r: 3, c: 10} };
    const igst = { s: { r: 2, c: 11 }, e: { r: 2, c: 12} };
    const cgst = { s: { r: 2, c: 13 }, e: { r: 2, c: 14} };
    const sgst = { s: { r: 2, c: 15 }, e: { r: 2, c: 16} };

    const ws = XLSX.utils.json_to_sheet(wsData)

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push(heading);
    ws['!merges'].push(slNo);
    ws['!merges'].push(gst);
    ws['!merges'].push(place);
    ws['!merges'].push(customer);
    ws['!merges'].push(period);
    ws['!merges'].push(nature);
    ws['!merges'].push(hsn);
    ws['!merges'].push(rate);
    ws['!merges'].push(invoice);
    ws['!merges'].push(rateOfTax);
    ws['!merges'].push(invoiceNo);
    ws['!merges'].push(invoiceDate);
    ws['!merges'].push(valueOfService);
    ws['!merges'].push(igst);
    ws['!merges'].push(cgst);
    ws['!merges'].push(sgst);


    ws['A1'].v = 'CENTRAL WAREHOUSING CORPORATION\n' + 'Principal Place of Business\n' + 'CENTRAL WAREHOUSE\n' + '\n' + 'REGISTER OF OUTWARD SUPPLY (TAX INVOICE/BILL OF SUPPLY)';
    ws['A2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[0].label
    ws['B2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[1].label
    ws['C2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[2].label
    ws['D2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[3].label
    ws['E2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[4].label
    ws['F2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[5].label
    ws['G2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[6].label
    ws['H2'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[7].label

    ws['I2'].v = "Invoice Details"
    ws['L2'].v = "Rate of Tax"

    ws['L3'].v = "IGST"
    ws['N3'].v = "CGST"
    ws['P3'].v = "SGST"

    ws['I3'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[8].label
    ws['J3'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[9].label
    ws['K3'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[10].label
    ws['L4'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[11].label
    ws['M4'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[12].label
    ws['N4'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[13].label
    ws['O4'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[14].label
    ws['P4'].v = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[15].label
    ws['Q4'] = {t: 's', v: REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[16].label}
    ws['R4'] = {t: 's', v: REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[17].label}
    ws['S4'] = {t: 's', v: REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[18].label}
    ws['T4'] = {t: 's', v: REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders[19].label}

    const wb = {
      Sheets: { [`Sheet1`]: ws },
      SheetNames: [`Sheet1`],
    }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blobData = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const type = this.types.find(x=>x.value === this.form.value.invoiceType)?.label
    FileSaver.saveAs(blobData, `RegisterOfOutwardSupply_${type}.xlsx`)
  }

  makeWorkSheetData(data: any) {
    const headers = REGISTER_OF_OUTWARD_SUPPLY_DATA.excelHeaders;
    return [
      headers.reduce((prev: any, cur: any, index: number) => {
        return { ...prev, [cur.label]: '' }
      }, {}),
      headers.reduce((prev: any, cur: any) => {
        return { ...prev, [cur.label]: '' }
      }, {}),
      headers.reduce((prev: any, cur: any) => {
        return { ...prev, [cur.label]: '' }
      }, {}),
      ...data?.map((element: any, index: number) => {
        return headers.reduce((prev: any, cur: any) => {
          let value: any = element[cur.key];
          if(cur.type == 'sl') value = index+1;

          return { ...prev, [cur.label]: value }
        }, {})
      }),
      headers.reduce((prev: any, cur: any) => {
        return { ...prev, [cur.label]: '' }
      }, {})
    ]
  }
}
