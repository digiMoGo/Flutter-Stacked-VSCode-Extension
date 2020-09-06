import * as _ from "lodash";
import { Base } from "../architecture/base";
import { TYPE_OF_VIEWMODEL } from "../../utils/utils";

export class ViewModel extends Base {
  private _dartString: string;

  constructor(fileName: string, suffix: string, private typeOfViewModel: TYPE_OF_VIEWMODEL, private projectName?: string) {

    super(fileName, suffix);
    let initialPath = this.projectName === undefined ? '../../' : `package:${this.projectName}/`;
    this._dartString = this.viewModelDartString(typeOfViewModel, initialPath);
  }

  get dartString(): string {
    return this._dartString;
  }

  private viewModelDartString(typeOfViewModel: TYPE_OF_VIEWMODEL, initialPath: string): string {
    switch (typeOfViewModel) {
      case TYPE_OF_VIEWMODEL.BaseViewModel: return this.baseViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.FutureViewModel: return this.futureViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.StreamViewModel: return this.streamViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.MultipleFutureViewModel: return this.multipleFutureViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.MultipleStreamViewModel: return this.multipleStreamViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.ReactiveViewModel: return this.reactiveViewModelDartString(initialPath);
      case TYPE_OF_VIEWMODEL.IndexTrackingViewModel: return this.indexTrackingViewModelDartString(initialPath);
      default: return this.baseViewModelDartString(initialPath);
    }
  }

  private baseViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends BaseViewModel {
  Logger log;

  ${this.className}() {
    this.log = getLogger(this.runtimeType.toString());
  }
}
`;
  }

  private futureViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends FutureViewModel {
  Logger log;
  
  ${this.className}() {
    log = getLogger(this.runtimeType.toString());
  }
    
  @override
  Future futureToRun() {
    // TODO: implement futureToRun
    throw UnimplementedError();
  }
}
`;
  }

  private streamViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends StreamViewModel {
  Logger log;

  ${this.className}() {
    log = getLogger(this.runtimeType.toString());
  }

  @override
  // TODO: implement stream
  Stream get stream => throw UnimplementedError();
}
`;
  }

  private multipleFutureViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends MultipleFutureViewModel {
  Logger log;

  ${this.className}() {
    log = getLogger(this.runtimeType.toString());
  }

  @override
  // TODO: implement futuresMap
  Map<String, Future Function()> get futuresMap => throw UnimplementedError();
}
`;
  }

  private multipleStreamViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends MultipleStreamViewModel {
  Logger log;

  ${this.className}() {
    log = getLogger(this.runtimeType.toString());
  }

  @override
  // TODO: implement streamsMap
  Map<String, StreamData> get streamsMap => throw UnimplementedError();
}
`;
  }

  private reactiveViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import 'package:counter_stacked/core/logger.dart';

class HomeViewModel extends ReactiveViewModel {
  Logger log;

  HomeViewModel() {
    log = getLogger(this.runtimeType.toString());
  }

  @override
  // TODO: implement reactiveServices
  List<ReactiveServiceMixin> get reactiveServices => throw UnimplementedError();
}
`;
  }

  private indexTrackingViewModelDartString(initialPath: string): string {
    return `import 'package:logger/logger.dart';
import 'package:stacked/stacked.dart';
import '${initialPath}core/logger.dart';

class ${this.className} extends IndexTrackingViewModel {
  Logger log;

  ${this.className}() {
    log = getLogger(this.runtimeType.toString());
  }
}
`;
  }
}