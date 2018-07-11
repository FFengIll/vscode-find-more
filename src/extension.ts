"use strict";

import * as vscode from 'vscode';
import * as path from 'path';
import Finder from './Finder';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    //console.log('Congratulations, your extension "find-more" is now active!');

    let finder = new Finder(context);

    //core contributions
    let disposable = null;
    disposable = vscode.commands.registerCommand('find.findAll', () => {

        var editor = vscode.window.activeTextEditor;
        var target = editor.document.getText(editor.selection);

        if (target.length > 0) {
            finder.find(target);
        } else {
            vscode.window.showInputBox({ prompt: 'target' })
                .then(target => {
                    finder.find(target);
                });
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('find.clear', () => {
        finder.clear();
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {

}