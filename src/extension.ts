// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as _ from "lodash";
import { FileSystemManager } from './utils/file_system_manager';
import { VsCodeActions } from './utils/vs_code_actions';
import { Utils } from './utils/utils';

export function activate(context: vscode.ExtensionContext) {

	let initializeDisposable = vscode.commands.registerCommand('extension.initializeArchitecture', () => {
		if (!FileSystemManager.isFlutterProject()) { return; }

		let rootPath = VsCodeActions.rootPath;
		if (_.isUndefined(rootPath)) { return; }

		let typeOfArchitecture = getTypeOfArchitecture();

		if (typeOfArchitecture === undefined) {
			// TODO ask for type
		}

		if (typeOfArchitecture === 'Mobile') {
			// TODO Add Mobile initialisation
			return;
		}

		if (typeOfArchitecture === 'Responsive') {
			// TODO add responsive initialisaiton
			return;
		}
	});

	let viewDisposable = vscode.commands.registerCommand('extension.createViews', () => {
		if (!FileSystemManager.isFlutterProject()) { return; }

		let typeOfArchitecture = getTypeOfArchitecture();

		if (typeOfArchitecture === undefined) {
			// TODO ask for type
		}

		if (typeOfArchitecture === 'Mobile') {
			// TODO Add Mobile Views
			return;
		}

		if (typeOfArchitecture === 'Responsive') {
			// TODO Add Responsive Views
			return;
		}
	});

	let widgetDisposable = vscode.commands.registerCommand('extension.createWidget', () => {
		if (!FileSystemManager.isFlutterProject()) { return; }

		let typeOfArchitecture = getTypeOfArchitecture();

		if (typeOfArchitecture === undefined) {
			// TODO ask for type
		}

		if (typeOfArchitecture === 'Mobile') {
			// TODO Add Mobile Widget
			return;
		}

		if (typeOfArchitecture === 'Responsive') {
			// TODO Add Responsive Widget
			return;
		}
	});

	let disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {

		let typeOfArch = await vscode.window.showQuickPick(['Responsive', 'Mobile']);
		if (typeOfArch === undefined) {
			console.warn("undefined");
			return;
		}
		updateTypeOfArchitecture(typeOfArch);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(initializeDisposable);
	context.subscriptions.push(viewDisposable);
	context.subscriptions.push(widgetDisposable);

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
