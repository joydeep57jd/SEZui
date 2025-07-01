export const GATE_PASS_CSS = `
/* Base layout */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  line-height: 1.2;
  background: white;
  padding: 10px;
  margin: 0;
}

.full-table {
  width: 100%;
  font-family: Verdana, Arial, sans-serif;
  font-size: 9pt;
  border-collapse: collapse;
}

.header-table, .title-table, .data-table, .signature-table {
  width: 100%;
  font-family: Verdana, Arial, sans-serif;
  border-collapse: collapse;
}

.signature-table {
  margin-top: 60px;
}

.data-table {
  table-layout: fixed;
  font-size: 8pt;
  border: 1px solid #000;
}

.cell {
  padding: 5px;
  word-wrap: break-word;
  overflow: hidden;
  border-bottom: 1px solid #000;
  text-align: left;
}

.border-right {
  border-right: 1px solid #000;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.bold {
  font-weight: bold;
}

.normal {
  font-weight: normal;
}

.header {
  font-size: 14px;
}

.sub-header {
  font-size: 12px;
}

.small-text {
  font-size: 10px;
}

.logo {
  width: 90px;
  float: right;
}

.signature-section {
  width: 30%;
  border-top: 1px solid #000;
  text-align: center;
  padding-top: 10px;
  vertical-align: top;
}

.gap {
  height: 20px;
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
}
.print-footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  font-size: 10px;
  color: #555;
  padding: 0 60px;
  display: flex;
  justify-content: space-between;
}
`;
