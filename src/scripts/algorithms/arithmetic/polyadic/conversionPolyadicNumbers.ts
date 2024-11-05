import { Algorithm } from '../../algorithm';
import { NumberPolyadic } from './numberPolyadic';

type ConversionModus = 'ShortcutHexToBin' | 'ShortcutBinToHex' | 'PowerToTen' | 'TenToPower' | 'PowerToPower';

export class ConversionPolyadicNumbers {
  private modus: ConversionModus;
  private solution: NumberPolyadic;
  private watcher: Algorithm;
  private sign: '+' | '-';

  constructor(n: NumberPolyadic, power: number) {
    this.sign = '+';
    this.watcher = new Algorithm();

    if ((n.power === 16) && (power === 2)) {
      this.watcher.step('Modus')
        .saveVariable('modus', 'ShortcutHexToBin');
      this.modus = 'ShortcutHexToBin';
      this.solution = this._shortcutHexToBin(n);
    } else if ((n.power === 2) && (power === 16)) {
      this.watcher.step('Modus')
        .saveVariable('modus', 'ShortcutBinToHex');
      this.modus = 'ShortcutBinToHex';
      this.solution = this._shortcutBinToHex(n);
    } else {
      const watcher1 = new Algorithm();
      const watcher2 = new Algorithm();

      if (power === 10) {
        this.modus = 'PowerToTen';
        watcher1.step('Modus')
          .saveVariable('modus', this.modus);
        this.solution = this._convertPowerToTen(n, watcher1);
        this.watcher = watcher1;
      } else if (n.power === 10) {
        this.modus = 'TenToPower';
        watcher2.step('Modus')
          .saveVariable('modus', this.modus);
        this.solution = this._convertTenToPower(n, power, watcher2);
        this.watcher = watcher2;
      } else {
        this.modus = 'PowerToPower';
        const powerToTen = this._convertPowerToTen(n, watcher1);
        watcher1.step('Modus')
          .saveVariable('modus', this.modus);
        this.solution = this._convertTenToPower(powerToTen, power, watcher2);
        // Combine the watchers by copying steps from watcher2 to watcher1
        Object.assign(watcher1.steps, watcher2.steps);
        this.watcher = watcher1;
      }
    }
  }

  private _convertPowerToTen(n: NumberPolyadic, watcher: Algorithm): NumberPolyadic {
    watcher.step('Input')
      .saveVariable('number', n);
    let firstNum = 0;

    // Determine sign
    if (n.arr[0] === '-') {
      this.sign = '-';
      firstNum = 1;
    } else if (n.arr[0] === '+') {
      this.sign = '+';
      firstNum = 1;
    } else {
      this.sign = '+';
    }
    watcher.step('ConstructNumber')
      .saveVariable('sign', this.sign);
    let val = 0;
    let count = 0;

    for (let i = n.comma - 1; i >= firstNum; i -= 1) {
      const act = parseInt(n.arr[i], n.power) * (n.power ** count);
      val += act;
      watcher.step('ConstructNumber')
        .saveVariable(`beforeComma${count}In`, n.arr[i])
        .saveVariable(`beforeComma${count}Res`, act);
      count += 1;
    }
    watcher.step('ConstructNumber')
      .saveVariable('stepsBeforeComma', count);
    count = 1;

    // For after-comma part
    let numerator = 0;
    let denominator = 1;
    
    for (let i = n.comma + 1; i < n.arr.length; i += 1) {
        const digit = parseInt(n.arr[i], n.power);
        numerator = numerator * n.power + digit;
        denominator *= n.power;
    }

    // Combine whole and fractional parts
    const wholeNumber = val.toString();
    const fractionalPart = this._findPeriodic(numerator, denominator);
    
    // Create the complete number string
    let resultString = wholeNumber;
    if (fractionalPart.digits.length > 0) {
        resultString += '.' + fractionalPart.digits.join('');
    }
    
    const result = new NumberPolyadic(10, resultString);
    if (fractionalPart.start !== undefined) {
        result.setPeriodicInfo(
            wholeNumber.length + 1 + fractionalPart.start,
            wholeNumber.length + 1 + fractionalPart.end!
        );
    }

    watcher.step('Result')
        .saveVariable('resultValue', result.toString())
        .saveVariable('resultNumber', result)
        .saveVariable('isPeriodic', result.isPeriodic)
        .saveVariable('periodicStart', result.periodicStart)
        .saveVariable('periodicEnd', result.periodicEnd);
    
    return result;
  }

  private _findPeriodic(numerator: number, denominator: number): { 
    digits: string[], 
    start?: number, 
    end?: number 
  } {
    const digits: string[] = [];
    const remainders = new Map<number, number>();
    let remainder = numerator % denominator;
    let position = 0;
    
    while (remainder !== 0) {
        if (remainders.has(remainder)) {
            return {
                digits,
                start: remainders.get(remainder)!,
                end: position - 1
            };
        }
        
        remainders.set(remainder, position);
        remainder *= 10;
        digits.push(Math.floor(remainder / denominator).toString());
        remainder %= denominator;
        position++;
    }
    
    return { digits };
  }

  private _longDivision(numerator: number, denominator: number, precision: number = 15): string {
    let result = Math.floor(numerator / denominator).toString();
    let remainder = numerator % denominator;
    
    if (remainder === 0) return result;
    
    result += '.';
    const seen = new Map<number, number>();
    let position = result.length;
    
    while (remainder !== 0 && result.length < position + precision) {
        if (seen.has(remainder)) {
            // We found a repeating decimal
            const start = seen.get(remainder)!;
            return result.slice(0, start) + '(' + result.slice(start) + ')';
        }
        
        seen.set(remainder, position);
        remainder *= 10;
        result += Math.floor(remainder / denominator);
        remainder %= denominator;
        position++;
    }
    
    return result;
  }

  private _convertTenToPower(n: NumberPolyadic, power: number, watcher: Algorithm): NumberPolyadic {
    watcher.step('Input')
      .saveVariable('number', n)
      .saveVariable('power', power);
    watcher.step('ConstructNumber')
      .saveVariable('sign', n.sign);
    const nbc = Math.floor(Math.abs(n.value)); // separate |nbc.xxx|

    // Division Algorithm before Comma
    let val = ''; // result string before comma
    let count = 0;
    let act: [number, number] = [nbc, 1]; // [divisor, remain]
    watcher.step('ConstructNumber')
      .saveVariable('beforeCommaVal', nbc);
    while (act[0] > 0) {
      act = this._divisionWithRemain(act[0], power, 10);
      watcher.step('ConstructNumber')
        .saveVariable(`beforeComma${count}Div`, act[0])
        .saveVariable(`beforeComma${count}Remain`, act[1]);
      count += 1;
      if (power === 16) {
        val = act[1].toString(16).toUpperCase() + val;
      } else {
        val = act[1] + val;
      }
    }
    watcher.step('ConstructNumber')
      .saveVariable('stepsBeforeComma', count);
    if (count === 0) {
      val = '0';
    }

    // Multiplication Algorithm after Comma
    let val2 = ''; // result string after comma
    count = 0;
    if (n.value.toString().indexOf('.') >= 0) {
      let numerator = 0;
      let denominator = 1;
      const afterCommaStr = (n.value.toString().split('.'))[1];
      
      for (let i = 0; i < afterCommaStr.length; i++) {
        numerator = numerator * 10 + parseInt(afterCommaStr[i], 10);
        denominator *= 10;
      }

      // Convert decimal fraction to target base
      let fraction = numerator / denominator;
      let result = '';
      const seenStates = new Map<string, number>();
      let position = 0;

      while (fraction !== 0 && position < 15) {  // increased max length for better period detection
        fraction *= power;
        const digit = Math.floor(fraction);
        fraction -= digit;

        // Create a unique state key using both the digit and remaining fraction
        const stateKey = `${digit},${fraction.toFixed(10)}`;
        if (seenStates.has(stateKey)) {
          const start = seenStates.get(stateKey)!;
          const periodicPart = result.slice(start);
          result = result.slice(0, start) + '(' + periodicPart + ')';
          break;
        }
        seenStates.set(stateKey, position);
        
        result += digit.toString(power);
        position++;
      }

      watcher.step('ConstructNumber')
        .saveVariable('afterCommaVal', result);

      // Check for periodicity
      if (result.includes('(')) {
        const periodicStart = result.indexOf('(');
        const periodicEnd = result.indexOf(')') - 1;  // -1 because the end index should be before the ')'
        watcher.step('ConstructNumber')
          .saveVariable('isPeriodic', true)
          .saveVariable('periodicStart', periodicStart)
          .saveVariable('periodicEnd', periodicEnd);
        
        // Set periodic info on the final result
        const finalResult = new NumberPolyadic(power, result.replace(/[()]/g, ''));
        finalResult.setPeriodicInfo(periodicStart, periodicEnd);
      } else {
        watcher.step('ConstructNumber')
          .saveVariable('isPeriodic', false);
      }

      val2 = result.replace(/[()]/g, '');
    }
    console.log('After Comma', val2);

    // Make result
    let resVal: string;
    if (val2 !== '') {
        resVal = `${val}.${val2}`;
    } else {
        resVal = val;
    }

    if (n.sign === '-') {
        resVal = `-${resVal}`;
    }

    // Remove periodic notation before validation
    const validationString = resVal.replace(/[\(\)]/g, '');
    
    // Ensure the result is valid for the target base
    const validDigits = Array.from(validationString).every(char => 
        char === '.' || char === '-' || 
        parseInt(char, power) < power
    );

    if (!validDigits) {
        console.log(validationString);
        throw new Error(`Invalid digits for base ${power}`);
    }

    const result = new NumberPolyadic(power, resVal);
    
    // If the input was periodic, try to find periodicity in the result
    if (n.isPeriodic) {
        const afterDecimal = resVal.split('.')[1];
        if (afterDecimal) {
            const periodicInfo = this._findPeriodic(
                parseInt(afterDecimal, power),
                Math.pow(10, afterDecimal.length)
            );
            if (periodicInfo.start !== undefined) {
                result.setPeriodicInfo(periodicInfo.start, periodicInfo.end);
            }
        }
    }

    watcher.step('Result')
        .saveVariable('resultValue', resVal)
        .saveVariable('resultNumber', result);
    return result;
  }

  private _divisionWithRemain(n1: number, n2: number, power: number): [number, number] {
    let i = 0;
    let r = 0;
    while (parseInt((i * n2).toString(10), power) <= n1) {
      r = parseInt((n1 - parseInt((i * n2).toString(10), power)).toString(10), power);
      i += 1;
    }
    return [i - 1, r]; // Divisor, Remain
  }

  private _multiplicationStepFrom10(n1: string | number, n2: number, limit: number): [number, number] {
    const res = parseFloat((parseFloat(n1.toString()) * parseFloat(n2.toString())).toFixed(limit));
    if (res >= 1) {
      return [parseFloat((res - Math.floor(res)).toFixed(limit)), Math.floor(res)];
    }
    return [res, 0]; // Result, Remain
  }

  private _shortcutHexToBin(n: NumberPolyadic): NumberPolyadic {
    this.watcher = this.watcher.step('Input')
      .saveVariable('number', n);

    // Determine sign
    if (n.arr[0] === '-') {
      this.sign = '-';
    } else if (n.arr[0] === '+') {
      this.sign = '+';
    } else {
      this.sign = '+';
    }
    this.watcher = this.watcher.step('ConstructNumber')
      .saveVariable('sign', this.sign);

    // shift out -/+ sign
    const hexArray = [...n.arr];
    if ((n.arr[0] === '-') || (n.arr[0] === '+')) {
      hexArray.shift();
    }

    // conversion cycle
    let resultVal = '';
    let afterComma = false;
    let count = 0;
    hexArray.forEach((act) => {
      if (act === '.') { // handle comma
        resultVal += '.';
        afterComma = true;
        this.watcher = this.watcher.step('ConstructNumber')
          .saveVariable('stepsBeforeComma', count);
        count = 0;
      } else { // conversion
        const binary = parseInt(act, 16)
          .toString(2).padStart(4, '0');
        resultVal += binary;
        if (afterComma) { // after comma
          this.watcher = this.watcher.step('ConstructNumber')
            .saveVariable(`afterComma${count}`, binary);
        } else { // before comma
          this.watcher = this.watcher.step('ConstructNumber')
            .saveVariable(`beforeComma${count}`, binary);
        }
        count += 1;
      }
    });
    if (afterComma) {
      this.watcher = this.watcher.step('ConstructNumber')
        .saveVariable('stepsAfterComma', count);
    } else {
      this.watcher = this.watcher.step('ConstructNumber')
        .saveVariable('stepsBeforeComma', count)
        .saveVariable('stepsAfterComma', 0);
    }

    // make result
    if (this.sign === '-') {
      resultVal = `-${resultVal}`;
    }
    const result = new NumberPolyadic(2, resultVal);
    this.watcher = this.watcher.step('Result')
      .saveVariable('resultValue', resultVal)
      .saveVariable('resultNumber', result);
    return result;
  }

  private _shortcutBinToHex(n: NumberPolyadic): NumberPolyadic {
    this.watcher = this.watcher.step('Input')
      .saveVariable('number', n);

    // Determine sign
    if (n.arr[0] === '-') {
      this.sign = '-';
    } else if (n.arr[0] === '+') {
      this.sign = '+';
    } else {
      this.sign = '+';
    }

    // shift out -/+ sign
    let posComma = n.comma;
    let binArray = n.arr.join('');
    if ((n.arr[0] === '-') || (n.arr[0] === '+')) {
      binArray = binArray.slice(1);
      posComma -= 1;
    }

    // Padding if before or after comma some zeros missing
    if (posComma < binArray.length - 1) { // case has comma
      const actLength = binArray.length;
      const lenBeforeComma = posComma;
      const lenAfterComma = actLength - posComma - 1;
      let padStart = '';
      if (lenBeforeComma % 4 !== 0) {
        for (let i = 0; i < 4 - (lenBeforeComma % 4); i += 1) {
          padStart += '0';
        }
      }
      let padEnd = '';
      if (lenAfterComma % 4 !== 0) {
        for (let i = 0; i < 4 - (lenAfterComma % 4); i += 1) {
          padEnd += '0';
        }
      }
      binArray = padStart + binArray + padEnd;
    } else { // has no comma -> only front padding
      let padStart = '';
      if (posComma % 4 !== 0) {
        for (let i = 0; i < 4 - (posComma % 4); i += 1) {
          padStart += '0';
        }
      }
      binArray = padStart + binArray;
    }

    // conversion cycle
    let resultVal = '';
    let afterComma = false;
    let count = 0;
    let act = '';
    let i = 0;
    while (i <= binArray.length) {
      if ((act.length < 4) && (binArray[i] !== '.')) { // set up 4 digits to conversion
        act += binArray[i];
        i += 1;
      } else if ((act.length === 0) && (binArray[i] === '.')) { // handle comma
        resultVal += '.';
        afterComma = true;
        this.watcher = this.watcher.step('ConstructNumber')
          .saveVariable('stepsBeforeComma', count);
        count = 0;
        i += 1;
      } else { // conversion step
        const hex = parseInt(act, 2)
          .toString(16)
          .toUpperCase();
        resultVal += hex;
        if (afterComma) { // after comma
          this.watcher = this.watcher.step('ConstructNumber')
            .saveVariable(`afterComma${count}Bin`, act)
            .saveVariable(`afterComma${count}Hex`, hex);
        } else { // before comma
          this.watcher = this.watcher.step('ConstructNumber')
            .saveVariable(`beforeComma${count}Bin`, act)
            .saveVariable(`beforeComma${count}Hex`, hex);
        }
        act = '';
        count += 1;
      }
    }
    if (afterComma) {
      this.watcher = this.watcher.step('ConstructNumber')
        .saveVariable('stepsAfterComma', count);
    } else {
      this.watcher = this.watcher.step('ConstructNumber')
        .saveVariable('stepsBeforeComma', count)
        .saveVariable('stepsAfterComma', 0);
    }

    // make result
    if (this.sign === '-') {
      resultVal = `-${resultVal}`;
    }
    const result = new NumberPolyadic(16, resultVal);
    this.watcher = this.watcher.step('Result')
      .saveVariable('resultValue', resultVal)
      .saveVariable('resultNumber', result);
    return result;
  }

  getModus(): string {
    return this.modus;
  }

  getResult(): NumberPolyadic {
    return this.solution;
  }

  getWatcher(): Algorithm {
    return this.watcher;
  }
}
