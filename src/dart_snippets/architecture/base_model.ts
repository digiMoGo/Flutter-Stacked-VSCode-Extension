import * as _ from 'lodash';
import { Base } from './base';

export class BaseModel extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `import 'package:equatable/equatable.dart';

abstract class BaseModel with EquatableMixin {
  Map<String, Object> toMap();
  Map<String, String> get userValues;
  Map<String, String> get userKeys;
    
  @override
  String toString() => toMap().toString();
}
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}