import * as _ from 'lodash';
import { Base } from './base';

export class Router extends Base {
  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);
    let initialPath = suffix === undefined ? '../../' : `package:${suffix}`;

    this._dartString = `import 'package:flutter/material.dart';
import '${initialPath}/views/home/home_view.dart';

import 'constants.dart';

class Router {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case homeRoute:
        return MaterialPageRoute(builder: (_) => HomeView());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for \${settings.name}'),
            ),
          ),
        );
    }
  }
}
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}