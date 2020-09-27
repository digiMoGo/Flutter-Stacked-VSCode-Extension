// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as path from "path";
import * as _ from "lodash";
import { FileSystemManager } from './utils/file_system_manager';
import { VsCodeActions } from './utils/vs_code_actions';
import { Utils, TYPE_OF_ARCHITECTURE, TYPE_OF_VIEWMODEL, TYPE_OF_WIDGET } from './utils/utils';
import { Architecture } from './utils/architecture';
import { ViewFile } from './utils/view_file';
import { WidgetFile } from './utils/widget_file';
import { RouterJSON } from './utils/router_json';
import { ConfigJSON } from './utils/config_json';
import { type } from 'os';

export function activate(context: vscode.ExtensionContext) {

	let regenerateDisposable = vscode.commands.registerCommand('stackedExtension.regenerateRoutes', async () => {
		if (!FileSystemManager.isFlutterProject()) {
			VsCodeActions.showErrorMessage('Missing pubspec');
			return;
		}

		VsCodeActions.showInformationMessage('Regenerating router and router constants');
		RouterJSON.generateFiles();
	});

	let initializeDisposable = vscode.commands.registerCommand('stackedExtension.initializeArchitecture', async () => {
		if (!FileSystemManager.isFlutterProject()) {
			VsCodeActions.showErrorMessage('Missing pubspec');
			return;
		}

		let rootPath = VsCodeActions.rootPath;
		if (_.isUndefined(rootPath)) { return; }

		let typeOfArchitecture = await inputTypeOfArchitecture();
		if (typeOfArchitecture === undefined) {
			return;
		}

		let inputString = await VsCodeActions.getInputString('Enter Class Name', async (value) => {
			if (value.length === 0) {
				return 'Enter a Class Name';
			}

			if (value.toLowerCase() === 'view') {
				return 'View is not a Valid Class Name';
			}

			return undefined;
		});

		if (inputString.length === 0 || inputString.toLowerCase() === 'view') {
			console.warn("activate: inputString length is 0");
			VsCodeActions.showErrorMessage("Invalid name for file");
			return;
		}

		console.debug(`inputString: { ${inputString} }`);

		let nameArray = inputString.trim().split('/');
		let folders: string[] = [];
		if (nameArray.length > 1) {
			let folderList = nameArray.splice(0, nameArray.length - 1).map(element => { return element; });
			console.debug(`folderlist: { ${folderList} }`);
			folders = folderList;
		}

		let formattedInputString = _.last(nameArray);
		if (formattedInputString === undefined) {
			console.error('formattedInputString is undefined');
			return;
		}
		let fileName = Utils.processFileName(formattedInputString);
		console.debug(`activate: fileName: ${fileName}`);

		let typeOfViewModel = await inputTypeOfViewModel();
		if (typeOfViewModel === undefined) {
			VsCodeActions.showErrorMessage("Type of ViewModel not selected");
			return;
		}

		new Architecture(path.join(rootPath, 'lib')).init(fileName);
		new ViewFile(rootPath, fileName, typeOfArchitecture, typeOfViewModel).createViews();
	});

	let viewDisposable = vscode.commands.registerCommand('stackedExtension.createViews', async () => {
		if (!FileSystemManager.isFlutterProject()) {
			VsCodeActions.showErrorMessage('Missing pubspec');
			return;
		}

		let typeOfArchitecture = await inputTypeOfArchitecture();
		if (typeOfArchitecture === undefined) {
			return;
		}

		let inputString = await VsCodeActions.getInputString('Enter Class Name', async (value) => {
			if (value.length === 0) {
				return 'Enter a Class Name';
			}

			if (value.toLowerCase() === 'view') {
				return 'View is not a Valid Class Name';
			}

			return undefined;
		});

		if (inputString.length === 0 || inputString.toLowerCase() === 'view') {
			console.warn("activate: inputString length is 0");
			VsCodeActions.showErrorMessage("Invalid name for file");
			return;
		}

		console.debug(`inputString: { ${inputString} }`);

		let nameArray = inputString.trim().split('/');
		let folders: string[] = [];
		if (nameArray.length > 1) {
			let folderList = nameArray.splice(0, nameArray.length - 1).map(element => { return element; });
			console.debug(`folderlist: { ${folderList} }`);
			folders = folderList;
		}

		let formattedInputString = _.last(nameArray);
		if (formattedInputString === undefined) {
			console.error('formattedInputString is undefined');
			return;
		}
		let fileName = Utils.processFileName(formattedInputString);
		console.debug(`activate: fileName: ${fileName}`);

		let typeOfViewModel = await inputTypeOfViewModel();
		if (typeOfViewModel === undefined) {
			VsCodeActions.showErrorMessage("Type of ViewModel not selected");
			return;
		}

		let rootPath = VsCodeActions.rootPath;
		if (rootPath === undefined) { return; }

		new ViewFile(rootPath, fileName, typeOfArchitecture, typeOfViewModel, folders).createViews();
	});

	let widgetDisposable = vscode.commands.registerCommand('stackedExtension.createWidget', async () => {
		if (!FileSystemManager.isFlutterProject()) {
			VsCodeActions.showErrorMessage('Missing pubspec');
			return;
		}

		let typeOfArchitecture = await inputTypeOfArchitecture();
		if (typeOfArchitecture === undefined) {
			return;
		}
		
		let typeOfWidget = await inputTypeOfWidget();
		if (typeOfWidget === undefined) {
			VsCodeActions.showErrorMessage("Type of Widget not selected");
			return;
		}

		let inputString = await VsCodeActions.getInputString('Enter class name', async (value) => {
			if (value.length === 0) {
				return 'Enter class name';
			}
			if (value.toLowerCase() === 'widget') {
				return 'Widget is not a valid class name';
			}
			return undefined;
		});

		if (inputString.length === 0 || inputString.toLowerCase() === 'widget') {
			console.warn("activate: inputString length is 0");
			VsCodeActions.showErrorMessage("Invalid name for file");
			return;
		}

		let fileName = Utils.processFileName(inputString.trim());
		console.debug(`activate: fileName: ${fileName}`);

		let typeOfViewModel;
		if (typeOfWidget === TYPE_OF_WIDGET.Smart) {
			typeOfViewModel = await inputTypeOfViewModel();
			if (typeOfViewModel === undefined) {
				VsCodeActions.showErrorMessage("Type of ViewModel not selected");
				return;
			}
		}

		let rootPath = VsCodeActions.rootPath;
		if (rootPath === undefined) { return; }

		new WidgetFile(rootPath, fileName, typeOfArchitecture, typeOfWidget, typeOfViewModel).createWidgets();
	});

	context.subscriptions.push(initializeDisposable);
	context.subscriptions.push(viewDisposable);
	context.subscriptions.push(widgetDisposable);
	context.subscriptions.push(regenerateDisposable);

	async function inputTypeOfArchitecture(): Promise<TYPE_OF_ARCHITECTURE | undefined> {
		let typeOfArchitecturePreference = ConfigJSON.readTypeOfArchitecture();

		if (typeOfArchitecturePreference === undefined) {
			let typeOfArch = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_ARCHITECTURE);
			if (typeOfArch === undefined) {
				console.warn("undefined");
				VsCodeActions.showErrorMessage('Type of Architecture not selected');
				return;
			}
			ConfigJSON.updateTypeOfArchitecture(typeOfArch);
			typeOfArchitecturePreference = typeOfArch;
		}
		return Utils.convertResponsiveToEnum(typeOfArchitecturePreference);
	}

	async function inputTypeOfViewModel(): Promise<TYPE_OF_VIEWMODEL | undefined> {
		let viewModelType = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_VIEWMODEL);
		return Utils.convertViewModelToEnum(viewModelType);
	}

	async function inputTypeOfWidget(): Promise<TYPE_OF_WIDGET | undefined> {
		let widgetType = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_WIDGET);
		return Utils.convertWidgetToEnum(widgetType);
	}
}

export function deactivate() {
	console.debug('Flutter Stacked Generator: Deactivated');
}
