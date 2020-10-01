import * as path from 'path';
import * as _ from "lodash";

import { FileSystemManager } from './file_system_manager';
import { WriteFileOptions } from 'fs';
import { Utils } from './utils';
import { YamlHelper } from './yaml_helper';
import { BaseModel } from '../dart_snippets/architecture/base_model';
import { BaseService } from '../dart_snippets/architecture/base_service';
import { Logger } from '../dart_snippets/architecture/logger';
import { Locator } from '../dart_snippets/architecture/locator';
import { Main } from '../dart_snippets/architecture/main';

export class Architecture {

  constructor(private rootPath: string) { }

  public init(fileName: string) {
    this.initCore();
    this.initTheme();
    this.initViews();
    this.initWidgets();

    YamlHelper.initializeWithDependencies();
    let initialRoute =  _.camelCase(fileName);
    this.createExistingFile(this.rootPath, 'main.dart', new Main('main.dart', initialRoute).dartString);
  }

  private initCore() {
    let corePath = path.join(this.rootPath, 'core');
    this.initBase(corePath);
    this.initCoreFiles(corePath);
    this.initServices(corePath);
    this.initModels(corePath);
  }

  private initBase(corePath: string) {
    let basePath = path.join(corePath, 'base');

    let folderCreated = FileSystemManager.createFolder(basePath);
    if (!folderCreated) { return; }
    this.createFile(basePath, 'base_model.dart', new BaseModel('base_model.dart').dartString);
    this.createFile(basePath, 'base_service.dart', new BaseService('base_service.dart').dartString);
  }

  private initCoreFiles(corePath: string) {
    this.createFile(corePath, 'locator.dart', new Locator('locator.dart').dartString);
    this.createFile(corePath, 'logger.dart', new Logger('logger.dart').dartString);
  }

  private initServices(corePath: string) {
    let servicesPath = path.join(corePath, 'services');

    let folderCreated = FileSystemManager.createFolder(servicesPath);
    if (!folderCreated) { return; }
  }

  private initModels(corePath: string) {
    let modelsPath = path.join(corePath, 'models');
    let folderCreated = FileSystemManager.createFolder(modelsPath);
    console.debug(`FolderCreated: ${folderCreated}`);
  }

  private initTheme() {
    let themePath = path.join(this.rootPath, 'theme');
    let folderCreated = FileSystemManager.createFolder(themePath);
    console.debug(`FolderCreated: ${folderCreated}`);
  }

  private initViews() {
    let viewsPath = path.join(this.rootPath, 'views');
    let folderCreated = FileSystemManager.createFolder(viewsPath);
    console.debug(`FolderCreated: ${folderCreated}`);
  }

  private initWidgets() {
    let widgetsPath = path.join(this.rootPath, 'widgets');
    let widgetsFolderCreated = FileSystemManager.createFolder(widgetsPath);
    let dumbWidgetsPath = path.join(widgetsPath, 'dumb_widgets');
    let dumbWidgetFolderCreated = FileSystemManager.createFolder(dumbWidgetsPath);
    let smartWidgetsPath = path.join(widgetsPath, 'smart_widgets');
    let smartWidgetFolderCreated = FileSystemManager.createFolder(smartWidgetsPath);
    console.debug(`FolderCreated: ${widgetsFolderCreated}`);
    console.debug(`FolderCreated: ${dumbWidgetFolderCreated}`);
    console.debug(`FolderCreated: ${smartWidgetFolderCreated}`);
  }

  private createFile(pathValue: string, fileName: string, data: string, options?: WriteFileOptions) {
    if (FileSystemManager.doesFileExist(pathValue, fileName)) {
      console.error(`${fileName} already exists`);
      return;
    }

    FileSystemManager.createFile(pathValue, fileName, data);
    // Utils.openFile(path.join(pathValue, fileName));
  }

  private createExistingFile(pathValue: string, fileName: string, data: string, options?: WriteFileOptions) {
    FileSystemManager.createFile(pathValue, fileName, data);
    Utils.openFile(path.join(pathValue, fileName));
  }
}