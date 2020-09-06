import * as path from 'path';
import * as _ from 'lodash';
import { existsSync } from 'fs';
import { FileSystemManager } from './file_system_manager';
import { YamlHelper } from './yaml_helper';
import { TYPE_OF_ARCHITECTURE, TYPE_OF_VIEWMODEL } from './utils';
import { View } from '../dart_snippets/views/view';
import { Mobile } from '../dart_snippets/views/mobile';
import { Tablet } from '../dart_snippets/views/tablet';
import { Desktop } from '../dart_snippets/views/desktop';
import { ViewModel } from '../dart_snippets/views/view_model';

export class ViewFile {

  constructor(private rootPath: string, private fileName: string, private typeOfArchitecture: TYPE_OF_ARCHITECTURE, private typeOfViewModel: TYPE_OF_VIEWMODEL, private folders?: string[]) {
    console.debug(`ViewFile(rootPath: ${rootPath}, fileName: ${fileName})`);
    let folderCreated = FileSystemManager.createFolder(this.pathValue);
    if (!folderCreated) { return; }
  }

  public createViews() {
    switch (this.typeOfArchitecture) {
      case TYPE_OF_ARCHITECTURE.Responsive:
        this.createResponsiveViews();
        break;
      case TYPE_OF_ARCHITECTURE.Mobile:
        this.createMobileViews();
        break;
      default:
        this.createMobileViews();
        break;
    }
  }

  private createMobileViews() {
    this.createFiles(`${this.snakeCasedFileName}_view.dart`, new View(this.snakeCasedFileName, 'View', TYPE_OF_ARCHITECTURE.Mobile).dartString);
    this.createFiles(`${this.snakeCasedFileName}_view_model.dart`, new ViewModel(this.snakeCasedFileName, 'ViewModel', this.typeOfViewModel, YamlHelper.getProjectName()).dartString);
  }

  private createResponsiveViews() {
    this.createFiles(`${this.snakeCasedFileName}_view.dart`, new View(this.snakeCasedFileName, 'View', TYPE_OF_ARCHITECTURE.Responsive).dartString);
    this.createFiles(`${this.snakeCasedFileName}_mobile.dart`, new Mobile(this.snakeCasedFileName, 'Mobile').dartString);
    this.createFiles(`${this.snakeCasedFileName}_desktop.dart`, new Desktop(this.snakeCasedFileName, 'Desktop').dartString);
    this.createFiles(`${this.snakeCasedFileName}_tablet.dart`, new Tablet(this.snakeCasedFileName, 'Tablet').dartString);
    this.createFiles(`${this.snakeCasedFileName}_view_model.dart`, new ViewModel(this.snakeCasedFileName, 'ViewModel', this.typeOfViewModel, YamlHelper.getProjectName()).dartString);
  }

  private get snakeCasedFileName(): string {
    let snakeCasedFileName = _.snakeCase(this.fileName);
    console.debug(`get snakeCasedFileName: ${snakeCasedFileName}`);
    return snakeCasedFileName;
  }

  private get pathValue(): string {
    if (this.folders === undefined) {
      return path.join(
        this.rootPath,
        'lib',
        'views',
        this.snakeCasedFileName
      );
    }
    return path.join(this.rootPath, 'lib', 'views', ...this.folders, this.snakeCasedFileName);
  }

  private createFiles(fileName: string, data: string) {
    if (existsSync(path.join(this.pathValue, this.snakeCasedFileName))) {
      console.warn(`${fileName} already exists`);
      return;
    }

    FileSystemManager.createFile(this.pathValue, fileName, data);
  }
}