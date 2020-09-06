import * as path from 'path';
import * as _ from 'lodash';
import { existsSync } from 'fs';
import { FileSystemManager } from './file_system_manager';
import { TYPE_OF_ARCHITECTURE, TYPE_OF_WIDGET, TYPE_OF_VIEWMODEL } from './utils';
import { Widget } from '../dart_snippets/widgets/widget';
import { Mobile } from '../dart_snippets/widgets/mobile';
import { Desktop } from '../dart_snippets/widgets/desktop';
import { Tablet } from '../dart_snippets/widgets/tablet';
import { ViewModel } from '../dart_snippets/widgets/view_model';
import { YamlHelper } from './yaml_helper';

export class WidgetFile {

  constructor(private rootPath: string, private fileName: string, private typeOfArchitecture: TYPE_OF_ARCHITECTURE, private typeOfWidget: TYPE_OF_WIDGET, private typeOfViewModel?: TYPE_OF_VIEWMODEL) {
    console.debug(`WidgetFile(rootPath: ${rootPath}, fileName: ${fileName})`);
    let folderCreated = FileSystemManager.createFolder(this.pathValue);
    if (!folderCreated) { return; }
  }

  public createWidgets() {
    switch (this.typeOfArchitecture) {
      case TYPE_OF_ARCHITECTURE.Responsive:
        this.createResponsiveWidget();
        break;
      case TYPE_OF_ARCHITECTURE.Mobile:
        this.createMobileWidget();
        break;
      default:
        this.createMobileWidget();
        break;
    }
  }

  private createMobileWidget() {
    this.createFiles(`${this.snakeCasedFileName}_widget.dart`, new Widget(this.snakeCasedFileName, 'Widget', TYPE_OF_ARCHITECTURE.Mobile, this.typeOfWidget).dartString);
    if (this.typeOfWidget === TYPE_OF_WIDGET.Smart && this.typeOfViewModel !== undefined) {
      this.createFiles(`${this.snakeCasedFileName}_view_model.dart`, new ViewModel(this.snakeCasedFileName, 'ViewModel', this.typeOfViewModel, YamlHelper.getProjectName()).dartString);
    }
  }

  private createResponsiveWidget() {
    this.createFiles(`${this.snakeCasedFileName}_widget.dart`, new Widget(this.snakeCasedFileName, 'Widget', TYPE_OF_ARCHITECTURE.Responsive, this.typeOfWidget).dartString);
    this.createFiles(`${this.snakeCasedFileName}_mobile.dart`, new Mobile(this.snakeCasedFileName, 'Mobile').dartString);
    this.createFiles(`${this.snakeCasedFileName}_desktop.dart`, new Desktop(this.snakeCasedFileName, 'Desktop').dartString);
    this.createFiles(`${this.snakeCasedFileName}_tablet.dart`, new Tablet(this.snakeCasedFileName, 'Tablet').dartString);
    if (this.typeOfWidget === TYPE_OF_WIDGET.Smart && this.typeOfViewModel !== undefined) {
      this.createFiles(`${this.snakeCasedFileName}_view_model.dart`, new ViewModel(this.snakeCasedFileName, 'ViewModel', this.typeOfViewModel, YamlHelper.getProjectName()).dartString);
    }
  }

  private get snakeCasedFileName(): string {
    let snakeCasedFileName = _.snakeCase(this.fileName);
    console.debug(`get snakeCasedFileName: ${snakeCasedFileName}`);
    return snakeCasedFileName;
  }

  private get pathValue(): string {
    return this.typeOfWidget === TYPE_OF_WIDGET.Smart ? path.join(this.rootPath, 'lib', 'widgets', 'smart_widgets', this.snakeCasedFileName) : path.join(this.rootPath, 'lib', 'widgets', 'dumb_widgets', this.snakeCasedFileName);
  }

  private createFiles(fileName: string, data: string) {
    if (existsSync(path.join(this.pathValue, this.snakeCasedFileName))) {
      console.warn(`${fileName} already exists`);
      return;
    }

    FileSystemManager.createFile(this.pathValue, fileName, data);
  }
}