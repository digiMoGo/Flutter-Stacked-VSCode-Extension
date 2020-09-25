import * as path from 'path';
import * as _ from "lodash";
import { FileSystemManager } from "./file_system_manager";
import { VsCodeActions } from "./vs_code_actions";

export class ConfigJSON {

  constructor() { }

  public static readTypeOfArchitecture(): string | undefined {
    const root_path = VsCodeActions.rootPath;
    const json_path = path.join(root_path, 'lib', 'core');
    const file_data = FileSystemManager.readFileAsString(json_path, 'config.json');

    let json: Config = {};

    if (file_data === undefined) {
      console.debug('config.json not found');
      console.debug('Creating config.json');
    } else {
      json = JSON.parse(file_data) ?? {};
    }

    return json.typeOfArchitecture;
  }

  public static updateTypeOfArchitecture(typeOfArch: string) {
    const root_path = VsCodeActions.rootPath;
    const json_path = path.join(root_path, 'lib', 'core');
    const file_data = FileSystemManager.readFileAsString(json_path, 'config.json');

    let json: Config = {};

    if (file_data === undefined) {
      console.debug('config.json not found');
      console.debug('Creating config.json');
    } else {
      json = JSON.parse(file_data) ?? {};
    }

    json.typeOfArchitecture = typeOfArch;
    FileSystemManager.createFile(json_path, 'config.json', JSON.stringify(json, null, 4));
  }
}


export interface Config {
  typeOfArchitecture?: string;
}