import _ = require("lodash");
import * as path from 'path';
import { Base } from "./base";
import { FileSystemManager } from "../../utils/file_system_manager";
import { IRouteObject } from "../../utils/router_json";
import { VsCodeActions } from "../../utils/vs_code_actions";

export class Router extends Base {
	private _dartString: string;
	private initialPath: string;

	constructor(fileName: string, private routes: Array<IRouteObject>, suffix?: string) {
		super(fileName, suffix);
		this.initialPath = suffix === undefined ? '../../' : `package:${suffix}`;
		this._dartString = '// [ This is an auto generated file ]\n\n';
		this._dartString += `import 'package:flutter/material.dart';
import '${this.initialPath}/core/router_constants.dart';\n\n`;
	}

	public create() {

		this.routes.forEach((value, index) => {
			this._dartString += `import '${this.initialPath}/${value.file_path}' as view${index};\n`;
		});

		this._dartString += `\nclass Router {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {\n`;

		this.routes.forEach((value, index) => {
			this._dartString += `      case ${this.lowerCamelCased(value.route_name)}:\n`;
			this._dartString += `        return MaterialPageRoute(builder: (_) => view${index}.${value.view_name}());\n`;
		});

		this._dartString += `      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for \${settings.name}'),
            ),
          ),
        );
    }
  }
}`;

		const root_path = VsCodeActions.rootPath;
		const json_path = path.join(root_path, 'lib', 'core');
		FileSystemManager.createFile(json_path, 'router.dart', this._dartString);

	}

	private lowerCamelCased(value: string): string {
		return _.camelCase(value);
	}
}