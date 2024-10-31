/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import { NumberPolyadic } from './algorithms/arithmetic/polyadic/numberPolyadic';
import { AdditionPolyadic } from './algorithms/arithmetic/polyadic/addition';
import { SubtractionPolyadic } from './algorithms/arithmetic/polyadic/subtraction';
import { ConversionPolyadicNumbers } from './algorithms/arithmetic/polyadic/conversionPolyadicNumbers';
import { Algorithm } from './algorithms/algorithm';

interface IPolyadicResult {
  bitString: string;
}

type OperatorType = 'add' | 'sub';
type ModusType = 'PowerToTen' | string;

export class PolyadicSolution {
  private result: string;
  private resultObject: IPolyadicResult | string;
  private watcher: Algorithm['watcher'];
  private modus: ModusType;

  constructor() {
    this.result = '';
    this.resultObject = '';
    this.watcher = {} as Algorithm['watcher'];
    this.modus = '';
  }

  public convertFormat(
    num1: number | string,
    format1: number,
    format2: number
  ): void {
    if (num1 === '') return;

    const number = new NumberPolyadic(format1, num1.toString(format1));
    const converter = new ConversionPolyadicNumbers(number, format2);
    
    this.modus = converter.modus;
    this.result = converter.solution.bitString;
    this.watcher = converter.watcher;

    if (Array.isArray(this.watcher)) {
      this.resultObject = this.modus === 'PowerToTen'
        ? this.watcher[0].steps.Result.data.resultNumber
        : this.watcher[1].steps.Result.data.resultNumber;
    } else {
      this.resultObject = this.watcher.steps.Result.data.resultNumber;
    }
  }

  public calcArithmeticSolution(
    num1: number | string,
    num2: number | string,
    format: number,
    operator: OperatorType
  ): void {
    const number1 = new NumberPolyadic(format, num1.toString(format));
    const number2 = new NumberPolyadic(format, num2.toString(format));

    switch (operator) {
      case 'add': {
        const addition = new AdditionPolyadic(number1, number2);
        this.result = addition.result.bitString;
        this.resultObject = addition.result;
        this.watcher = this.deepClone(addition.watcher);
        break;
      }
      case 'sub': {
        const subtraction = new SubtractionPolyadic(number1, number2);
        this.result = subtraction.result.bitString;
        this.resultObject = subtraction.result;
        this.watcher = this.deepClone(subtraction.watcher);
        break;
      }
    }
  }

  public getResult(): string {
    return this.result;
  }

  public getResultObject(): IPolyadicResult | string {
    return this.resultObject;
  }

  public getWatcher(): Algorithm['watcher'] {
    return this.watcher;
  }

  public getModus(): ModusType {
    return this.modus;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
