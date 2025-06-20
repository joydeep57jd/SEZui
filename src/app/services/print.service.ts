import {ElementRef, Injectable} from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printOrDownload(mode: 'print' | 'pdf', invoiceSection: ElementRef, fileName: string) {
    const clone = invoiceSection.nativeElement.cloneNode(true) as HTMLElement;
    clone.style.display = 'block';

    const container = document.createElement('div');
    container.id = 'print-container';
    container.appendChild(clone);
    document.body.appendChild(container);

    if (mode === 'pdf') {
      html2pdf().from(clone).set({
        filename: `${fileName}.pdf`,
        margin: 0,
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'mm',  orientation: 'portrait' },
      }).save().then(() => document.body.removeChild(container));
    } else {
      const printWindow = window.open('', '_blank', 'width=800,height=600');

      if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              /* Add more custom styles as needed */
            </style>
          </head>
          <body>${clone.innerHTML}</body>
        </html>
      `);
        printWindow.document.close();
        document.body.removeChild(container);
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
          document.body.removeChild(container);
        };
      } else {
        document.body.removeChild(container);
      }
    }
  }

}
