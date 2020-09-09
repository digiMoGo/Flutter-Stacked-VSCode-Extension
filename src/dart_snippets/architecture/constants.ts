import * as _ from 'lodash';
import { Base } from './base';

export class Constants extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `const String homeViewRoute = '/';
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}