export const DAILY_CASHBOOK_REPORT_CSS = `
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
  margin: 30px 0;
  background: white;
}

.header,
.footer {
  text-align: center;
  margin-bottom: 10px;
}

img {
  position: absolute;
  left: 20px;
  top: 30px;
}

h1,
h2,
h3 {
  margin: 4px 0;
}

.report-metadata {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

table,
th,
td {
  border: 1px solid #000;
}

th,
td {
  padding: 4px 2px;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  font-size: 5.5px;
}

th {
  font-weight: bold;
}

.total-row {
  font-weight: bold;
}

@page {
  size: A4 landscape;
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
