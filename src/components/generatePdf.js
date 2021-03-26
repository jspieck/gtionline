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

  additionString() {
    let latex = '\\(';
    latex += `${this.imp.$t('approach')}\\newline`;
    latex += this.description.getAdditionTable();
    latex += '\\)';
    this.string = latex;
  }

  subractionString() {
    let latex = '\\(';
    latex += this.description.getSubtractionTable();
    latex += '\\)';
    this.string = latex;
  }

  multiplicationString() {
    let latex = '\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)';
    this.string = latex;
  }

  divisionString() {
    let latex = '\\(';
    latex += this.description.getDivisionTable();
    latex += '\\)';
    this.string = latex;
  }

  generateLatexString() {
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        this.additionString();
        break;

      case 'mul':
        this.multiplicationString();
        break;

      case 'sub':
        this.subractionString();
        break;

      case 'div':
        this.divisionString();
        break;
      default:
    }
  }

  generatePdf() {
    const html = this.string;
    console.log(this.$router);
    const routeData = router.resolve({ name: 'DescriptionPDF', query: { math: html } });
    window.open(routeData.href, '_blank');
  }
}
