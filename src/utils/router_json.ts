import * as path from 'path';
import * as _ from 'lodash';
import { VsCodeActions } from './vs_code_actions';
import { FileSystemManager } from './file_system_manager';
import { RouterConstants } from './router_constants';
import { Router } from './router';
import { YamlHelper } from './yaml_helper';

export class RouterJSON {

    constructor(private fileName: string, private folders?: string[]) { }

    public async addRoute() {
        const root_path = VsCodeActions.rootPath;
        const json_path = path.join(root_path, 'lib', 'core');
        const file_data = FileSystemManager.readFileAsString(json_path, 'router.json');

        let json: IRouterJSON = {};
        if (file_data === undefined) {
            console.debug('router.json not found');
            console.debug('Creating router.json');
        } else {
            json = JSON.parse(file_data) ?? {};
        }

        const last_updated: string = new Date().toUTCString();
        json.last_updated = last_updated;

        const routes = json.routes ?? [];
        const pathValue = this.pathValue.replace(/\\/g, "/");
        console.log("pathValue: " + pathValue);

        let routeName = `${this.snakeCasedFileName}ViewRoute`;
        let suffix: number | undefined;

        while (this.checkIfSameRouteExists(routeName + (suffix ?? ''), routes)) {
            if (_.isUndefined(suffix)) {
                suffix = 0;
            } else {
                suffix += 1;
            }
        }

        if (suffix !== undefined) {
            routeName += suffix;
        }

        routes.push({
            'file_path': `${pathValue}/${this.snakeCasedFileName}_view.dart`,
            'route_name': routeName,
            'view_name': this.upperSnakeCasedFileName + 'View',
        });

        json.routes = routes;
        this.saveJson(json_path, json);

        RouterJSON.generateFiles();
    }

    public static generateFiles() {
        const root_path = VsCodeActions.rootPath;
        const json_path = path.join(root_path, 'lib', 'core');
        const file_data = FileSystemManager.readFileAsString(json_path, 'router.json');

        let json: IRouterJSON = {};
        if (file_data === undefined) {
            console.debug('router.json not found');
            console.debug('Creating router.json');
        } else {
            json = JSON.parse(file_data) ?? {};
        }

        const last_updated: string = new Date().toUTCString();
        json.last_updated = last_updated;

        const routes = json.routes ?? [];
        new RouterConstants(routes.map((value) => value.route_name)).create();
        new Router('router.dart', routes, YamlHelper.getProjectName()).create();
    }

    private saveJson(json_path: string, file: Object) {
        FileSystemManager.createFile(json_path, 'router.json', JSON.stringify(file, null, 4));
    }

    private checkIfSameRouteExists(routeName: string, routes: Array<IRouteObject>): boolean {
        for (const value of routes) {
            console.log(`value: ${value.route_name} === routeName: ${routeName}`);
            if (value.route_name === routeName) { return true; }
        }
        return false;
    }

    private get pathValue(): string {
        if (this.folders === undefined) {
            return path.join(
                'views',
                this.snakeCasedFileName
            );
        }
        return path.join('views', ...this.folders, this.snakeCasedFileName);
    }

    private get snakeCasedFileName(): string {
        let snakeCasedFileName = _.snakeCase(this.fileName);
        return snakeCasedFileName;
    }

    private get upperSnakeCasedFileName(): string {
        return _.upperFirst(this.snakeCasedFileName);
    }
}

export interface IRouterJSON {
    last_updated?: string;
    routes?: Array<IRouteObject>;
}

export interface IRouteObject {
    file_path: string;
    view_name: string;
    route_name: string;
}