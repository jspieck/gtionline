/* eslint no-useless-escape: 0  no-case-declarations: 0 */
// import * as tool from '../scripts/gti-tools';
import * as description from './DescriptionSolution';
import router from '../router/index';

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
    this.description = new description.DescriptionSolution(this.imp);
    this.generateLatexString();
    this.pdf = this.generatePdf();
  }

  generateLatexString() {
    const latex = this.description.getAdditionTable();
    // const latex = '\\( \\mathcal\{N\} \\rightarrow k + z \\)';
    this.string = latex;
  }

  generatePdf() {
    const html = this.string;
    console.log(this.$router);
    const routeData = router.resolve({ name: 'DescriptionPDF', query: { math: html } });
    window.open(routeData.href, '_blank');
  }
}


// add your content to the document here, as usual
