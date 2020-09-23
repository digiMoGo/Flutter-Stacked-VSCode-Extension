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
		if (!FileSystemManager.isFlutterProject()) { return; }

		let rootPath = VsCodeActions.rootPath;
		if (_.isUndefined(rootPath)) { return; }

		let typeOfArchitecture = await inputTypeOfArchitecture();
		let typeOfViewModel = await inputTypeOfViewModel();

		new Architecture(path.join(rootPath, 'lib')).init();
		new ViewFile(rootPath, "home", typeOfArchitecture, typeOfViewModel).createViews();
	});

	let viewDisposable = vscode.commands.registerCommand('stackedExtension.createViews', async () => {
		if (!FileSystemManager.isFlutterProject()) { return; }

		let typeOfArchitecture = await inputTypeOfArchitecture();
		let typeOfViewModel = await inputTypeOfViewModel();

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

		let rootPath = VsCodeActions.rootPath;
		if (rootPath === undefined) { return; }

		new ViewFile(rootPath, fileName, typeOfArchitecture, typeOfViewModel, folders).createViews();
	});

	let widgetDisposable = vscode.commands.registerCommand('stackedExtension.createWidget', async () => {
		if (!FileSystemManager.isFlutterProject()) { return; }

		let typeOfArchitecture = await inputTypeOfArchitecture();
		let typeOfWidget = await inputTypeOfWidget();
		let typeOfViewModel;
		if (typeOfWidget === TYPE_OF_WIDGET.Smart) {
			typeOfViewModel = await inputTypeOfViewModel();
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

		let rootPath = VsCodeActions.rootPath;
		if (rootPath === undefined) { return; }
		new WidgetFile(rootPath, fileName, typeOfArchitecture, typeOfWidget, typeOfViewModel).createWidgets();
	});

	context.subscriptions.push(initializeDisposable);
	context.subscriptions.push(viewDisposable);
	context.subscriptions.push(widgetDisposable);

	async function inputTypeOfArchitecture(): Promise<TYPE_OF_ARCHITECTURE> {
		let typeOfArchitecturePreference = getTypeOfArchitecture();

		if (typeOfArchitecturePreference === undefined) {
			let typeOfArch = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_ARCHITECTURE);
			if (typeOfArch === undefined) {
				console.warn("undefined");
				return TYPE_OF_ARCHITECTURE.Mobile;
			}
			updateTypeOfArchitecture(typeOfArch);
			typeOfArchitecturePreference = typeOfArch;
		}
		return Utils.convertResponsiveToEnum(typeOfArchitecturePreference);
	}

	async function inputTypeOfViewModel(): Promise<TYPE_OF_VIEWMODEL> {
		let viewModelType = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_VIEWMODEL);
		return Utils.convertViewModelToEnum(viewModelType);
	}

	async function inputTypeOfWidget(): Promise<TYPE_OF_WIDGET> {
		let widgetType = await VsCodeActions.getInputDropdown(Utils.TYPE_OF_WIDGET);
		return Utils.convertWidgetToEnum(widgetType);
	}

	function getTypeOfArchitecture(): string | undefined {
		return context.workspaceState.get<string>(Utils.ARCHITECTURE);
	}

	async function updateTypeOfArchitecture(value: string) {
		await context.workspaceState.update(Utils.ARCHITECTURE, value);
	}
}

export function deactivate() {
	console.debug('Flutter Stacked Generator: Deactivated');
}
