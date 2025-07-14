import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  print(invoiceSection: ElementRef, fileName: string, style: string = "") {
    const clone = invoiceSection.nativeElement.cloneNode(true) as HTMLElement;
    clone.style.display = 'block';
    const container = document.createElement('div');
    container.appendChild(clone);
    document.body.appendChild(container);
    const printWindow = window.open('', 'referral', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <style>
                ${style}
            </style>
          </head>
          <body>
            ${clone.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      document.body.removeChild(container);
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close()
      };
    } else {
      document.body.removeChild(container);
    }
  }
}
