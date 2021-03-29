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
    style += 'h1 \{ color: black; font-family: arial; font-size: 200%; font-weight: bold;'
      + 'break-after: always; \}';
    style += 'h2 \{ color: black; font-family: arial; font-size: 150%; font-weight: bold; text-align: left \}';
    style += 'h3 \{ color: black; font-family: arial; font-size: 120%;  text-align: left\}';
    // text
    style += 'txt \{ color: black; font-family: arial; font-size: 100%; text-align: left\}';
    style += 'ctr \{ color: black; font-family: arial; font-size: 100%; text-align: center\}';
    // table
    style += 'tab1 \{ width:60%; border-spacing: 5px; padding: 15px; border: 1px solid black;'
      + 'border-collapse: collapse; margin-left:auto; margin-right:auto; text-align: center;\}';

    style += '</style>';
    this.style = style;
  }

  getHeader() {
    let header = '';
    header += `<ctr>${this.imp.$t('approach')}</ctr>`;
    header += `<h1>${this.imp.$t('gti')}</h1>`;
    this.header = header;
  }

  getValues(y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    // values
    let values = '';
    values += `<h2>${this.imp.$t('values')}</h2>`;
    values += '<table style="tab1">';
    // headings
    values += '<tr>';
    values += '<th></th>';
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        values += `<th>${this.imp.$t('firstSummand')}</th>`;
        values += `<th>${this.imp.$t('firstSummand')}</th>`;
        break;

      case 'mul':
        values += `<th>${this.imp.$t('leftValue')}</th>`;
        values += `<th>${this.imp.$t('rightValue')}</th>`;
        break;

      case 'sub':
        values += `<th>${this.imp.$t('minuend')}</th>`;
        values += `<th>${this.imp.$t('subrahend')}</th>`;
        break;

      case 'div':
        values += `<th>${this.imp.$t('leftValue')}</th>`;
        values += `<th>${this.imp.$t('rightValue')}</th>`;
        break;
      default:
    }
    values += '</tr>';
    // content
    values += '<tr>';
    values += `<td>${this.imp.$t('values')}</td>`;
    values += `<td>${y1.valueString}</td>`;
    values += `<td>${y2.valueString}</td>`;
    values += '</tr>';
    values += '<tr>';
    values += `<td>${this.imp.$t('sign')}</td>`;
    values += `<td>${(y1.sign === 0 ? '+' : '-')}</td>`;
    values += `<td>${(y2.sign === 0 ? '+' : '-')}</td>`;
    values += '</tr>';
    values += '<tr>';
    values += `<td>${this.imp.$t('mantissa')}</td>`;
    values += `<td>${mantissaString1}</td>`;
    values += `<td>${mantissaString2}</td>`;
    values += '</tr>';
    values += '<tr>';
    values += `<td>${this.imp.$t('exponent')}</td>`;
    values += `<td>${expString1}</td>`;
    values += `<td>${expString2}</td>`;
    values += '</tr>';
    values += '</table>';
    this.values = values;
  }

  /* eslint-disable no-unused-vars */
  additionString(solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.imp.watcher;
    let latex = '<div style="width:95%; justify-content: center;" id="scoped-content">';
    // style
    latex += this.style;
    // header
    latex += this.header;
    // content
    // values
    latex += this.values;
    // calc
    latex += `<h2>${this.imp.$t('step')} 1 </h2> <br>`;
    latex += '<div>\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)</div>';
    latex += '</div>';
    this.string = latex;
  }
  /* eslint-enable no-unused-vars */

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
    const num1 = this.imp.nums[0];
    const num2 = this.imp.nums[1];
    const solution = tool.getIEEEFromString(this.imp.exponentBits, this.imp.solution);
    const y1 = tool.getIEEEFromString(this.imp.exponentBits, num1);
    const y2 = tool.getIEEEFromString(this.imp.exponentBits, num2);
    this.getStyle();
    this.getHeader();
    this.getValues(y1, y2);
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
