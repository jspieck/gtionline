/* eslint no-useless-escape: 0  no-case-declarations: 0 */
// import * as tool from '../scripts/gti-tools';
import * as katex from 'katex';

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
    this.generateLatexString();
    this.pdf = this.generatePdf();
  }

  generateLatexString() {
    this.string = 'c = \\pm\\sqrt{a^2 + b^2}';
  }

  generatePdf() {
    // test latex compiler
    // const latex = 'Hi, this is a line of text.$\\rightarrow \\mathbb\{N\}$';
    let html;
    try {
      html = katex.renderToString(this.string, {
        output: 'html',
        throwOnError: false,
        logging: true, // only in dev status
      });
    } catch (err) { console.log(err); }

    console.log(html);
    // pdf
    const doc = this.doc;
    doc.html(html, {
      callback(idoc) {
        idoc.save('save.pdf');
      },
      html2canvas: {
        foreignObjectRendering: true,
        allowTaint: true,
        svgRendering: true,
      },
      x: 10,
      y: 10,
    })
      .then((n) => { console.log(n); });
  }
}


// add your content to the document here, as usual
