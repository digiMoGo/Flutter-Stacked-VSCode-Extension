import * as _ from 'lodash';
import { Base } from '../architecture/base';
import { TYPE_OF_ARCHITECTURE, TYPE_OF_WIDGET } from '../../utils/utils';

export class Widget extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix: string, typeOfArchitecture: TYPE_OF_ARCHITECTURE, typeOfWidget: TYPE_OF_WIDGET) {
    super(fileName, suffix);

    let classPrefixList: string[] = this.className.split('Widget');
    let classPrefix: string | undefined;
    if (!_.isEmpty(classPrefixList)) { classPrefix = _.first(classPrefixList); }

    if (typeOfArchitecture === TYPE_OF_ARCHITECTURE.Responsive && typeOfWidget === TYPE_OF_WIDGET.Smart) {
      this._dartString = this.responsiveAndSmartWidgetDartString(fileName, classPrefix);
    } else if (typeOfArchitecture === TYPE_OF_ARCHITECTURE.Responsive && typeOfWidget === TYPE_OF_WIDGET.Dumb) {
      this._dartString = this.responsiveAndDumbWidgetDartString(fileName, classPrefix);
    } else if (typeOfArchitecture === TYPE_OF_ARCHITECTURE.Mobile && typeOfWidget === TYPE_OF_WIDGET.Smart) {
      this._dartString = this.mobileAndSmartWidgetDartString(fileName, classPrefix);
    } else if (typeOfArchitecture === TYPE_OF_ARCHITECTURE.Mobile && typeOfWidget === TYPE_OF_WIDGET.Dumb) {
      this._dartString = this.mobileAndDumbWidgetDartString();
    } else {
      this._dartString = this.mobileAndDumbWidgetDartString();
    }
  }

  get dartString(): string {
    return this._dartString;
  }

  private mobileAndDumbWidgetDartString() {
    return `import 'package:flutter/material.dart';

class ${this.className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('${this.className}'),
    );
  }
}
`;
  }

  private mobileAndSmartWidgetDartString(fileName: string, classPrefix?: string): string {
    return `import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import '${fileName}_view_model.dart';

class ${this.className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelBuilder<${classPrefix}ViewModel>.reactive(
      builder: (BuildContext context, ${classPrefix}ViewModel viewModel, Widget _) {
        return Center(
          child: Text('${classPrefix} View'),
        );
      },
      viewModelBuilder: () => ${classPrefix}ViewModel(),
    );
  }
}
`;
  }

  private responsiveAndDumbWidgetDartString(fileName: string, classPrefix?: string) {
    return `library ${fileName}_widget;

import 'package:responsive_builder/responsive_builder.dart';
import 'package:flutter/material.dart';

part '${fileName}_mobile.dart';
part '${fileName}_tablet.dart';
part '${fileName}_desktop.dart';

class ${this.className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ScreenTypeLayout(
      mobile: _${classPrefix}Mobile(),
      desktop: _${classPrefix}Desktop(),
      tablet: _${classPrefix}Tablet(),
    );
  }
}
`;
  }

  private responsiveAndSmartWidgetDartString(fileName: string, classPrefix?: string): string {
    return `library ${fileName}_widget;

import 'package:responsive_builder/responsive_builder.dart';
import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import '${fileName}_view_model.dart';

part '${fileName}_mobile.dart';
part '${fileName}_tablet.dart';
part '${fileName}_desktop.dart';

class ${this.className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelBuilder<${classPrefix}ViewModel>.reactive(
      builder: (BuildContext context, ${classPrefix}ViewModel viewModel, Widget _) {
        return ScreenTypeLayout(
          mobile: _${classPrefix}Mobile(),
          desktop: _${classPrefix}Desktop(),
          tablet: _${classPrefix}Tablet(),
        );
      },
      viewModelBuilder: () => ${classPrefix}ViewModel(),
    );
  }
}
`;
  }

}