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
    style += '<style scoped>';
    // MathJax
    style += '.MathJax { font-size: 11px !important; } ';
    // header
    style += '#header1 { color: black; font-family: arial; font-size: 28px; font-weight: bold;'
      + 'break-after: always; margin-left: auto; margin-right: auto; margin-bottom: 0.5cm;'
      + 'margin-top: 0.5cm} ';
    style += '#header2 { color: black; font-family: arial; font-size: 16px; font-weight: bold;'
      + 'text-align: left; margin-left: 1cm; margin-right: 1cm; margin-top: 0.5cm} ';
    style += '#header3 { color: black; font-family: arial; font-size: 13px;  text-align: left;'
      + 'margin-left: 0; margin-right: 0; margin-top: 0.5cm; margin-bottom: 0.25cm;'
      + 'font-style: italic} ';
    // text
    style += '#txt { color: black; font-family: arial; font-size: 12px; text-align: left;'
      + 'margin-left: 1cm; margin-right: 1cm} ';
    style += '#ctr { color: black; font-family: arial; font-size: 12px; text-align: center; '
      + 'margin-left: auto; margin-right: auto} ';
    // list
    style += 'ul, ol{ display: block; list-style-type: decimal; list-style-type: disc; '
      + ' margin-top: 1em; margin-bottom: 1em; margin-left: 1cm; margin-right: 1cm;'
      + 'padding-left: 0.3cm;}';
    style += 'li { color: black; font-family: arial; font-size: 12px; text-align: left;} ';
    // table
    style += '#tab1 { width:60%; border-spacing: 5px; padding: 15px;'
      + 'border-collapse: collapse; margin-left:auto; margin-right:auto; text-align: center} ';
    style += 'th { font-weight: bold; text-size: 14px; border-bottom: 1px solid gray} ';
    style += 'tr, td { text-size: 12px;} ';
    style += 'td:first-child, th:first-child { text-size: 12px; border-right: 1px solid gray} ';
    // footer
    style += '#foot { position: fixed; left: 0; bottom: 0; width: auto; color: lightgray;'
      + ' text-align: center; margin-bottom: 0.7cm; margin-left: 0.7cm; margin-right: 0.7cm; '
      + 'font-size: 10px; border-top: 1px solid lightgray} ';

    style += '</style>';
    this.style = style;
  }

  getHeader() {
    let header = '';
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('addition')}</ctr>`;
        break;
      case 'mul':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('multiplication')}</ctr>`;
        break;
      case 'sub':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('subtraction')}</ctr>`;
        break;
      case 'div':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('division')}</ctr>`;
        break;
      default:
    }
    header += `<div id="header1">${this.imp.$t('gti')}</div>`;
    this.header = header;
  }

  getDisclaimer() {
    let disclaimer = '';
    disclaimer += `<div id="foot">${this.imp.$t('disclaimer')}</div>`;
    this.disclaimer = disclaimer;
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
    values += `<div id="header2">${this.imp.$t('values')}</div>`;
    values += '<table id="tab1">';
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
    let latex = '<style scoped>#scoped-content { width:100%; justify-content: center; }</style>';
    latex += '<div id="scoped-content">';
    // style
    latex += this.style;
    // header
    latex += this.header;
    // content
    // values
    latex += this.values;
    // calc
    latex += `<div id="header2">${this.imp.$t('step')} 1 </div> <br>`;
    latex += `<div id="txt">${this.imp.$t('adjunstExponents')} `;
    if (watcher.steps.CalculateDeltaE.data.deltaE === 0) {
      latex += `\\( (${expString1} = ${expString2} \\Rightarrow i.O.) \\)`;
      latex += '</div>';
    } else {
      const left = watcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
      latex += `\\( (${expString1} \\neq ${expString2}) \\)`;
      latex += '</div>';
      latex += '<ul>';
      latex += `<li><div id="header3">${this.imp.$t('diffExponent')}</div>`;
      latex += [
        `${this.imp.$t('smallerExponent')} `,
        `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) <br>`,
        `${this.imp.$t('resDiffExponent')}: `,
        '\\(',
        this.imp.watcher.steps.CalculateDeltaE.data.deltaE,
        '\\)</li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('adjustSmallerMantissa')}</div>`;
      latex += [
        `${this.imp.$t('shiftMantissa')}: \\( `,
        watcher.steps.CalculateDeltaE.data.preShift.join(''),
        `\\overset{\\text{Shift: ${watcher.steps.CalculateDeltaE.data.deltaE} }}{\\rightarrow}`,
        watcher.steps.AddMantissa.data.mantissa2.join(''),
        '\\)',
        '</li></ul>',
      ].join('');
    }

    latex += `<div id="header2">${this.imp.$t('step')} 2 </div>`;
    latex += '<ul>';
    latex += `<li><div id="header3">${this.imp.$t('addition')} ${this.imp.$t('mantissa')}</div></li>`;
    latex += '<div id="ctr">\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)</div>';
    latex += `<li><div id="header3">${this.imp.$t('considerRepresentation')}</div>`;
    latex += [
      `${this.imp.$t('consider1comma')}<br>`,
      `${this.imp.$t('mantissa1float')} \\( `,
      `${this.imp.watcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
      '\\)',
      '</li></ul>',
    ].join('');
    latex += '</div>';
    // disclaimer
    latex += this.disclaimer;

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
    this.getDisclaimer();
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
    const routeData = router.resolve({ name: 'DescriptionPDF', query: { math: html } });
    window.open(routeData.href, '_blank');
  }
}
