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
    style += 'th { font-weight: bold; text-size: 12px; font-family: arial;'
      + 'border-bottom: 1px solid gray} ';
    style += 'tr, td { text-size: 12px; font-family: arial} ';
    style += 'td:first-child, th:first-child { text-size: 12px; border-right: 1px solid gray} ';
    // pagebreak
    style += '#page-break { display: block; page-break-before: always; margin-bottom: 1cm;} ';
    // footer
    style += '#foot { position: fixed; left: 0; bottom: 0; width: auto; color: lightgray;'
      + ' text-align: center; margin-bottom: 0.7cm; margin-left: 0.7cm; margin-right: 0.7cm; '
      + 'font-size: 10px; border-top: 1px solid lightgray} ';

    style += '</style>';
    this.style = style;
  }

  getHeader(y2) {
    let header = '';
    header += `<div id="header1">${this.imp.$t('gti')}</div>`;
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        if (y2.sign === 0) {
          header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('addition')} \\( ${this.imp.inputNums['0']} + ${this.imp.inputNums['1']} \\)</ctr>`;
        } else {
          header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('addition')} \\( ${this.imp.inputNums['0']} + ${this.imp.inputNums['1']} \\Rightarrow \\)`;
          const negate = this.imp.inputNums['1'] * -1;
          header += ` ${this.imp.$t('subtraction')} \\( ${this.imp.inputNums['0']} - ${negate} \\)</ctr>`;
        }
        break;
      case 'mul':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('multiplication')} \\( ${this.imp.inputNums['0']} * ${this.imp.inputNums['1']} \\)</ctr>`;
        break;
      case 'sub':
        if (y2.sign === 0) {
          header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('subtraction')} \\( ${this.imp.inputNums['0']} - ${this.imp.inputNums['1']} \\)</ctr>`;
        } else {
          header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('subtraction')} \\( ${this.imp.inputNums['0']} - ${this.imp.inputNums['1']} \\Rightarrow \\)`;
          const negate = this.imp.inputNums['1'] * -1;
          header += ` ${this.imp.$t('addition')} \\( ${this.imp.inputNums['0']} + ${negate} \\)</ctr>`;
        }
        break;
      case 'div':
        header += `<ctr>${this.imp.$t('example')} ${this.imp.$t('approach')}: ${this.imp.$t('division')} \\( ${this.imp.inputNums['0']} : ${this.imp.inputNums['1']} \\)</ctr>`;
        break;
      default:
    }
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
      latex += `<li><div id="header3">${this.imp.$t('diffExponent')} :</div>`;
      latex += [
        `${this.imp.$t('smallerExponent')} `,
        `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) <br>`,
        `${this.imp.$t('resDiffExponent')}: `,
        '\\(',
        this.imp.watcher.steps.CalculateDeltaE.data.deltaE,
        '\\)</li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('adjustSmallerMantissa')} :</div>`;
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
    latex += `<li><div id="header3">${this.imp.$t('addition')} ${this.imp.$t('mantissa')} :</div></li>`;
    latex += '<div id="ctr">\\(';
    latex += this.description.getAdditionTable();
    latex += '\\)</div>';
    latex += `<li><div id="header3">${this.imp.$t('considerRepresentation')} :</div>`;
    latex += [
      `${this.imp.$t('consider1comma')}<br>`,
      `${this.imp.$t('mantissa1float')} \\( `,
      `${this.imp.watcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
      '\\)',
      '</li></ul>',
    ].join('');
    latex += '</div>';

    latex += `<div id="header2">${this.imp.$t('step')} 3 </div>`;
    latex += '<ul>';
    latex += `<li><div id="header3">${this.imp.$t('solution')} :</div>`;
    const decSol = this.imp.ieeeToDec([
      this.imp.watcher.steps.Result.data.result.sign, ' ',
      this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
      this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
    ].join(''));
    latex += [
      `${this.imp.$t('correctSolution')}: \\(`,
      this.imp.watcher.steps.Result.data.result.sign, '\\,',
      this.imp.watcher.steps.Result.data.result.exponentBits.join(''), '\\,',
      this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1), '\\,',
      `\\Rightarrow ${decSol} \\)`,
      '</li>',
    ].join('');
    latex += `<li><div id="header3">${this.imp.$t('composition')} :</div></li>`;
    latex += '</ul>';
    latex += '<table id="tab1">';
    // headings
    latex += '<tr>';
    latex += '<th></th>';
    latex += `<th>${this.imp.$t('values')}</th>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('sign')}</td>`;
    latex += `<td>${this.imp.watcher.steps.Result.data.result.sign}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('exponent')}</td>`;
    latex += `<td>${this.imp.watcher.steps.Result.data.result.exponentBits.join('')}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('mantissa')}</td>`;
    latex += `<td>${this.imp.watcher.steps.Result.data.result.mantissaBits.join('')}</td>`;
    latex += '</tr>';
    latex += '</table>';
    // disclaimer
    latex += this.disclaimer;

    this.string = latex;
  }
  /* eslint-enable no-unused-vars */

  // eslint-disable-next-line no-unused-vars
  subractionString(solution, y1, y2) {
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.imp.watcher.steps.Addition.data.addition;
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
      latex += `<li><div id="header3">${this.imp.$t('diffExponent')} :</div>`;
      latex += [
        `${this.imp.$t('smallerExponent')} `,
        `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) <br>`,
        `${this.imp.$t('resDiffExponent')}: `,
        '\\(',
        watcher.steps.CalculateDeltaE.data.deltaE,
        '\\)</li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('adjustSmallerMantissa')} :</div>`;
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
    latex += `<div id="txt">${this.imp.$t('subtTwosComplement')} `;

    if (watcher.steps.AddMantissa.data.sign1 === 1) {
      latex += [`<div id="header3">${this.imp.$t('considerRepresentation')} \\(`,
        watcher.steps.AddMantissa.data.mantissa1.join(''),
        '\\)</div>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('switchBits')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.mantissa1.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement1.steps.Complement.data.flippedArray.join(''),
        '\\) </li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('add1')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.complement1.steps.Complement.data.flippedArray.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement1.steps.Complement.data.oneAdded.join(''),
        '\\) </li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('normalize')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.complement1.steps.Complement.data.oneAdded.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement1.steps.Complement.data.normalizedArray.join(''),
        '\\) </li>',
      ].join('');
    }
    if (watcher.steps.AddMantissa.data.sign2 === 1) {
      latex += [`<div id="header3">${this.imp.$t('considerRepresentation')} \\(`,
        watcher.steps.AddMantissa.data.mantissa2.join(''),
        '\\)</div>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('switchBits')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.mantissa2.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement2.steps.Complement.data.flippedArray.join(''),
        '\\) </li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('add1')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.complement2.steps.Complement.data.flippedArray.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement2.steps.Complement.data.oneAdded.join(''),
        '\\) </li>',
      ].join('');
      latex += `<li><div id="header3">${this.imp.$t('normalize')} :</div></li>`;
      latex += [
        '\\(',
        watcher.steps.AddMantissa.data.complement2.steps.Complement.data.oneAdded.join(''),
        '\\rightarrow',
        watcher.steps.AddMantissa.data.complement2.steps.Complement.data.normalizedArray.join(''),
        '\\) </li>',
      ].join('');
    }
    latex += '</ul>';

    latex += '</ul>';
    latex += '</div>';

    latex += `<div id="header2">${this.imp.$t('step')} 3 </div>`;
    latex += '<ul>';
    latex += `<li><div id="header3">${this.imp.$t('addition')} ${this.imp.$t('mantissa')} :</div></li>`;
    latex += '<div id="ctr">\\(';
    latex += this.description.getSubtractionTable();
    latex += '\\)</div>';
    latex += `<li><div id="header3">${this.imp.$t('considerRepresentation')} :</div>`;
    latex += [
      `${this.imp.$t('consider1comma')}<br>`,
      `${this.imp.$t('mantissa1float')} \\( `,
      `${watcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
      '\\)',
      '</li></ul>',
    ].join('');
    latex += '</div>';

    if (watcher.steps.AddMantissa.data.sign1 === 1
      && watcher.steps.AddMantissa.data.sign2 === 1) {
      latex += '<div id="page-break"></div>';
    }

    latex += `<div id="header2">${this.imp.$t('step')} 4 </div>`;
    latex += '<ul>';
    latex += `<li><div id="header3">${this.imp.$t('solution')} :</div>`;
    const decSol = this.imp.ieeeToDec([
      watcher.steps.Result.data.result.sign, ' ',
      watcher.steps.Result.data.result.exponentBits.join(''),
      watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
    ].join(''));
    latex += [
      `${this.imp.$t('correctSolution')}: \\(`,
      watcher.steps.Result.data.result.sign, '\\,',
      watcher.steps.Result.data.result.exponentBits.join(''), '\\,',
      watcher.steps.Result.data.result.mantissaBits.join('').substring(1), '\\,',
      `\\Rightarrow ${decSol} \\)`,
      '</li>',
    ].join('');
    latex += `<li><div id="header3">${this.imp.$t('composition')} :</div></li>`;
    latex += '</ul>';
    latex += '<table id="tab1">';
    // headings
    latex += '<tr>';
    latex += '<th></th>';
    latex += `<th>${this.imp.$t('values')}</th>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('sign')}</td>`;
    latex += `<td>${watcher.steps.Result.data.result.sign}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('exponent')}</td>`;
    latex += `<td>${watcher.steps.Result.data.result.exponentBits.join('')}</td>`;
    latex += '</tr>';
    latex += '<tr>';
    latex += `<td>${this.imp.$t('mantissa')}</td>`;
    latex += `<td>${watcher.steps.Result.data.result.mantissaBits.join('')}</td>`;
    latex += '</tr>';
    latex += '</table>';
    // disclaimer
    latex += this.disclaimer;

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
    this.getHeader(y2);
    this.getDisclaimer();
    this.getValues(y1, y2);
    switch (this.imp.selectedFormat[2]) {
      case 'add':
        console.log('add');
        console.log(y1);
        console.log(y2);
        if (y1.sign === 0 && y2.sign === 0) {
          this.additionString(solution, y1, y2);
        } else if (y2.sign === 1) {
          y2.sign = 0;
          y2.arr[0] = 0;
          this.subractionString(solution, y1, y2);
        } else {
          this.subractionString(solution, y1, y2);
        }
        break;

      case 'mul':
        this.multiplicationString(solution, y1, y2);
        break;

      case 'sub':
        console.log('sub');
        console.log(y1);
        console.log(y2);
        if (y2.sign === 0) {
          console.log('shit');
          this.subractionString(solution, y1, y2);
        } else if (y1.sign === 1 && y2.sign === 1) {
          console.log('fuck');
          this.subractionString(solution, y1, y2);
        } else {
          console.log('damn');
          y2.sign = 0;
          y2.arr[0] = 0;
          this.additionString(solution, y1, y2);
        }
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
