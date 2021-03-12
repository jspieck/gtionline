/* eslint no-useless-escape: 0  no-case-declarations: 0 */
// import * as tool from '../scripts/gti-tools';
const { jsPDF } = require('jspdf');

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class PdfDescription {
  constructor(imp) {
    classCallCheck(this, PdfDescription);
    this.imp = imp;
    // eslint-disable-next-line new-cap
    this.doc = new jsPDF();

    this.pdf = this.generatePdf();
  }

  generatePdf() {
    // get a blob when you're done
    const doc = this.doc;
    doc.text(`${this.imp.$t('values')}`, 10, 10);
    doc.save('a4.pdf');
  }
}


// add your content to the document here, as usual
