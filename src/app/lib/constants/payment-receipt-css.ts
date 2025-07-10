export const PAYMENT_RECEIPT_CSS = `
body {
  font-family: Arial, sans-serif;
  font-size: 11px;
  line-height: 1.2;
  background: white;
  padding: 10px;
  margin: 0;
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
  padding:  30px;
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
`
