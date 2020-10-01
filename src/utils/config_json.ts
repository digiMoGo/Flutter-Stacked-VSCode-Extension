import * as path from 'path';
import * as _ from "lodash";
import { FileSystemManager } from "./file_system_manager";
import { VsCodeActions } from "./vs_code_actions";

export class ConfigJSON {

  constructor() { }

  public static createJSONFile() {
    const root_path = VsCodeActions.rootPath;
    const file_data = FileSystemManager.readFileAsString(root_path, 'stackedConfig.json');
    if (file_data === undefined) {
      FileSystemManager.createFile(root_path, 'stackedConfig.json', JSON.stringify({}, null, 4));
      return;
    }
    let data = file_data.trim();
    if (data === "") {
      FileSystemManager.createFile(root_path, 'stackedConfig.json', JSON.stringify({}, null, 4));
      return;
    }
    let json: Config = JSON.parse(data);
    console.log(json);
    FileSystemManager.createFile(root_path, 'stackedConfig.json', JSON.stringify(json, null, 4));
  }

  public static readTypeOfArchitecture(): string | undefined {
    const root_path = VsCodeActions.rootPath;
    const file_data = FileSystemManager.readFileAsString(root_path, 'stackedConfig.json');

    let json: Config = {};

    if (file_data === undefined) {
      console.debug('stackedConfig.json not found');
      console.debug('Creating stackedConfig.json');
    } else {
      json = JSON.parse(file_data) ?? {};
    }

    return json.typeOfArchitecture;
  }

  public static updateTypeOfArchitecture(typeOfArch: string) {
    const root_path = VsCodeActions.rootPath;
    const file_data = FileSystemManager.readFileAsString(root_path, 'stackedConfig.json');

    let json: Config = {};

    if (file_data === undefined) {
      console.debug('stackedConfig.json not found');
      console.debug('Creating stackedConfig.json');
    } else {
      json = JSON.parse(file_data) ?? {};
    }

    json.typeOfArchitecture = typeOfArch;
    FileSystemManager.createFile(root_path, 'stackedConfig.json', JSON.stringify(json, null, 4));
  }
}


export interface Config {
  typeOfArchitecture?: string;
}