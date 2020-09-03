import * as _ from 'lodash';
import { Base } from './base';

export class Main extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `import 'package:flutter/material.dart';
import 'package:stacked_services/stacked_services.dart';
    
import 'core/locator.dart';
import 'views/counter/home_view.dart';
    
void main() async {
  await LocatorInjector.setUpLocator();
  runApp(MyApp());
}
    
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: locator<NavigationService>().navigatorKey,
      home: HomeView(),
    );
  }
}
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}