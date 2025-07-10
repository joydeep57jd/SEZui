export const INVOICE_CSS = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  font-size: 11px;
  line-height: 1.2;
  background: white;
  padding: 30px 0px;
  margin: 0;
}

.invoice-container {
  margin: 30px 15px;
  border: 1px solid #000;
  background: white;
}

.header {

  padding: 10px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.logo-section {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
  background: #ff4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}
.company-info{
  text-align: center;
}
.company-info h2 {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;

}

.company-info p {
  font-size: 10px;
  color: #666;
  margin: 1px 0;
}

.qr-code {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  text-align: center;
}

.invoice-title {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
}

.invoice-details {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #000;
}

.left-details, .right-details {
  padding: 10px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.right-details {
  padding-left: 80px;
}

.detail-row {
  display: flex;
  margin: 2px 0;
}

.detail-label {
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
}

.container-section {

  padding: 10px;
}

.container-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
  margin: 10px 0;
}

.container-table th,
.container-table td {
  border: 1px solid #000;
  padding: 4px;
  text-align: center;
}

.container-table th {
  background: #f8f8f8;
  font-weight: bold;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 1px;
  font-size: 10px;
  padding: 6px;
  border: 1px solid black;
}

.info-grid div div {
  padding-top: 2px;
}

.charges-section {
  /* border-bottom: 1px solid #000; */
  padding: 10px;
}

.charges-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
}

.charges-table th,
.charges-table td {
  border: 1px solid #000;
  padding: 4px;
  text-align: center;
}

.charges-table th {
  background: #f8f8f8;
  font-weight: bold;
}

.charges-table .description {
  text-align: left;
}

.charges-table .amount {
  text-align: right;
}

.totals-section {
  padding: 10px;
  font-size: 11px;
}

.total-row {
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-top: 1px solid black;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}

.total-row.main {
  font-weight: bold;
  font-size: 12px;
  border-top: 1px solid #000;
  padding-top: 5px;
}

.footer-section {
  padding: 10px;
  border-top: 1px solid #000;
}

.footer-left {
  font-size: 10px;
}

.signatures {
  text-align: center;
  font-size: 10px;
}

.signature-line {
  border-bottom: 1px solid #000;
  width: 150px;
  height: 30px;
  margin: 40px auto 5px auto;
}

.page-info {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 8px;
  color: #666;
}
.footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  margin: 20px 10px 5px;
}
@page {
  size: A4;
  margin: 0;
   @top-center {
    font-family: sans-serif;
    font-weight: bold;
    font-size: 2em;
    content: counter(page);
  }
}

body {
  margin: 0;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}
.print-footer {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  font-size: 10px;
  color: #555;
  padding: 0 60px;
  display: flex;
  justify-content: space-between;
}

`;
