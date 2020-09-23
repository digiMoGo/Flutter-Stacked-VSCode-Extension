import _ = require("lodash");
import * as path from 'path';
import { FileSystemManager } from "./file_system_manager";
import { VsCodeActions } from "./vs_code_actions";

export class RouterConstants {
    constructor(private routeList: Array<string>) { }

    public create() {
        let dartString = '// [ This is an auto generated file ]\n\n';
        this.routeList.forEach((value) => {
            dartString += `const String ${this.lowerCamelCased(value)} = '${this.lowerCamelCased(value)}';\n`;
        });

        const root_path = VsCodeActions.rootPath;
        const json_path = path.join(root_path, 'lib', 'core');
        FileSystemManager.createFile(json_path, 'router_constants.dart', dartString);
    }

    private lowerCamelCased(value: string): string {
        return _.camelCase(value);
    }
}