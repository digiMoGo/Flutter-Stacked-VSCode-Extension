import * as vscode from 'vscode';
import _ = require('lodash');

export class Utils {
  public static readonly ARCHITECTURE = 'Architecture';
  public static readonly TYPE_OF_ARCHITECTURE = ['Responsive', 'Mobile'];
  public static readonly TYPE_OF_VIEWMODEL = ['BaseViewModel', 'FutureViewModel', 'StreamViewModel', 'MultipleFutureViewModel', 'MultipleStreamViewModel', 'ReactiveViewModel', 'IndexTrackingViewModel'];
  public static readonly TYPE_OF_WIDGET = ['Smart Widget', 'Dumb Widget'];

  public static isValidClassName(className: string): string | undefined {
    if (className.length === 0) {
      return "File name should have atleast 1 character";
    }
    if (className.toLowerCase() === "view") {
      return "View is not a valid file name";
    }

    if (className.toLowerCase() === "widget") {
      return "Widget is not a valid file name";
    }

    if (
      !className
        .substring(0, 1)
        .match(new RegExp("([a-zA-Z$][w$]*.)*[a-zA-Z_$][w$]*"))
    ) {
      return "Invalid class name format";
    }
    return undefined;
  }

  public static openFile(filePath: string) {
    console.info(`openFile: ${filePath}`);
    let openPath = vscode.Uri.file(filePath);

    vscode.workspace.openTextDocument(openPath).then((document) => {
      vscode.window.showTextDocument(document);
    });
  }

  public static processFileName(fileName: string): string {

    if (fileName.length < 4) {
      return fileName;
    }
    fileName = _.lowerCase(fileName);

    let viewFileName = fileName
      .substring(fileName.length - 4, fileName.length)
      .toLowerCase();

    let widgetFileName = fileName
      .substring(fileName.length - 6, fileName.length)
      .toLowerCase();



    if (viewFileName === "view") {
      let truncatedFileName = fileName.substring(0, fileName.length - 4);
      return truncatedFileName.trim();
    }

    if (widgetFileName === "widget") {
      let truncatedFileName = fileName.substring(0, fileName.length - 6);
      console.debug('Widget testing');
      return truncatedFileName.trim();
    }

    return fileName.trim();
  }

  public static convertResponsiveToEnum(architectureType?: string): TYPE_OF_ARCHITECTURE {
    switch (architectureType) {
      case 'Mobile': return TYPE_OF_ARCHITECTURE.Mobile;
      case 'Responsive': return TYPE_OF_ARCHITECTURE.Responsive;
      default: return TYPE_OF_ARCHITECTURE.Mobile;
    }
  }

  public static convertViewModelToEnum(viewModelType?: string): TYPE_OF_VIEWMODEL | undefined {
    switch (viewModelType) {
      case 'BaseViewModel': return TYPE_OF_VIEWMODEL.BaseViewModel;
      case 'FutureViewModel': return TYPE_OF_VIEWMODEL.FutureViewModel;
      case 'StreamViewModel': return TYPE_OF_VIEWMODEL.StreamViewModel;
      case 'MultipleFutureViewModel': return TYPE_OF_VIEWMODEL.MultipleFutureViewModel;
      case 'MultipleStreamViewModel': return TYPE_OF_VIEWMODEL.MultipleStreamViewModel;
      case 'ReactiveViewModel': return TYPE_OF_VIEWMODEL.ReactiveViewModel;
      case 'IndexTrackingViewModel': return TYPE_OF_VIEWMODEL.IndexTrackingViewModel;
      default: return undefined;
    }
  }

  public static convertWidgetToEnum(widgetTpye?: string): TYPE_OF_WIDGET | undefined {
    switch(widgetTpye) {
      case 'Smart Widget': return TYPE_OF_WIDGET.Smart;
      case 'Dumb Widget': return TYPE_OF_WIDGET.Dumb;
      default: return undefined;
    }
  }
}

export enum TYPE_OF_ARCHITECTURE {
  Mobile,
  Responsive,
}

export enum TYPE_OF_VIEWMODEL {
  BaseViewModel,
  FutureViewModel,
  StreamViewModel,
  MultipleFutureViewModel,
  MultipleStreamViewModel,
  ReactiveViewModel,
  IndexTrackingViewModel,
}

export enum TYPE_OF_WIDGET {
  Smart,
  Dumb
}
