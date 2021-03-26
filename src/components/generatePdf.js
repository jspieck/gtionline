/* eslint no-useless-escape: 0  no-case-declarations: 0 */
// import * as tool from '../scripts/gti-tools';
import * as description from './DescriptionSolution';
import router from '../router/index';
import * as tool from '@/scripts/gti-tools';

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

  getStyle() {
    let style = '';
    style += '<style type="text/css" scoped>';
    // header
    style += 'h1 \{ color: black; font-family: arial; font-size: 300%; font-weight: bold;'
      + 'break-after: always; \}';
    style += 'h2 \{ color: black; font-family: arial; font-size: 200%; font-weight: bold; text-align: left \}';
    style += 'h3 \{ color: black; font-family: arial; font-size: 120%;  text-align: left\}';
    // content
    style += 'txt \{ color: black; font-family: arial; font-size: 100%; text-align: left\}';
    style += 'ctr \{ color: black; font-family: arial; font-size: 100%; text-align: center\}';
    style += 'tab1 \{ width:60%; border-spacing: 5px; padding: 15px; border: 1px solid black;'
      + 'border-collapse: collapse; margin-left:auto; margin-right:auto;\}';

    style += '</style>';
    this.style = style;
  }

  additionString(solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    // eslint-disable-next-line no-unused-vars
    const watcher = this.imp.watcher;
    let latex = '<div style="width:95%; justify-content: center;" id="scoped-content">';
    // style
    latex += this.style;
    // content
    latex += `<h1>${this.imp.$t('approach')}</h1>`;
    // values
    latex += `<h2>${this.imp.$t('values')}</h2>`;
    latex += '<table style="tab1">';
    // headings
    latex += '<tr>';
    latex += '<th></th>';
    latex += `<th>${this.imp.$t('firstSummand')}</th>`;
    latex += `<th>${this.imp.$t('firstSummand')}</th>`;
    latex += '</tr>';
    // content
    latex += '<tr>';
    latex += `<td>${this.imp.$t('values')}</td>`;
    latex += `<td>${y1.valueString}</td>`;
    latex += `<td>${y2.valueString}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('sign')}</td>`;
    latex += `<td>${(y1.sign === 0 ? '+' : '-')}</td>`;
    latex += `<td>${(y2.sign === 0 ? '+' : '-')}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('mantissa')}</td>`;
    latex += `<td>${mantissaString1}</td>`;
    latex += `<td>${mantissaString2}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('exponent')}</td>`;
    latex += `<td>${expString1}</td>`;
    latex += `<td>${expString2}</td>`;
    latex += '</tr>';

    latex += '</table>';
    // calc
    latex += `<h2>${this.imp.$t('step')} 1 </h2> <br>`;
    latex += '<div style="justify-content: center;">\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)</div>';
    latex += '</div>';
    this.string = latex;
  }

  // eslint-disable-next-line no-unused-vars
  subractionString(solution, y1, y2) {
    let latex = '\\(';
    latex += this.description.getSubtractionTable();
    latex += '\\)';
    this.string = latex;
  }

  // eslint-disable-next-line no-unused-vars
  multiplicationString(solution, y1, y2) {
    let latex = '\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)';
    this.string = latex;
  }

  // eslint-disable-next-line no-unused-vars
  divisionString(solution, y1, y2) {
    let latex = '\\(';
    latex += this.description.getDivisionTable();
    latex += '\\)';
    this.string = latex;
  }

  generateLatexString() {
    this.getStyle();
    const num1 = this.imp.nums[0];
    const num2 = this.imp.nums[1];
    const solution = tool.getIEEEFromString(this.imp.exponentBits, this.imp.solution);
    const y1 = tool.getIEEEFromString(this.imp.exponentBits, num1);
    const y2 = tool.getIEEEFromString(this.imp.exponentBits, num2);
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        this.additionString(solution, y1, y2);
        break;

      case 'mul':
        this.multiplicationString(solution, y1, y2);
        break;

      case 'sub':
        this.subractionString(solution, y1, y2);
        break;

      case 'div':
        this.divisionString(solution, y1, y2);
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
