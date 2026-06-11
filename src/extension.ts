'use strict';

import * as vscode from 'vscode';
import * as syspath from 'path';

// do not use it
export interface IFindInFilesArgs {
    query?: string;
    replace?: string;
    preserveCase?: boolean;
    triggerSearch?: boolean;
    filesToInclude?: string;
    filesToExclude?: string;
    isRegex?: boolean;
    isCaseSensitive?: boolean;
    matchWholeWord?: boolean;
    useExcludeSettingsAndIgnoreFiles?: boolean;
    onlyOpenEditors?: boolean;
}

function findInFile(path: string, target: string) {
    var include: string[] = [];
    vscode.workspace.workspaceFolders?.map((folder) => {
        var folderPath = folder.uri.path;
        if (path.startsWith(folderPath)) {
            var splitor = path.charAt(folderPath.length);
            if (splitor == syspath.sep) {
                include.push(path.substring(folderPath.length + 1));
            }
        }
    });

    console.info(path);
    console.info(include);
    if (include.length == 0) {
        include.push(path);
    }
    var filesToInclude = include.join(',');
    if (target.length > 0) {
        vscode.commands.executeCommand('workbench.action.findInFiles', {
            query: target,
            filesToInclude: filesToInclude,
            triggerSearch: true,
        });
    } else {
        vscode.commands.executeCommand('workbench.action.findInFiles', {
            query: '',
            filesToInclude: filesToInclude,
            triggerSearch: false,
        });
    }
}

async function findByName() {
    console.log('findByName called');
    const input = await vscode.window.showInputBox({
        placeHolder: 'Enter filename or glob pattern (e.g. index, *.ts)',
        prompt: 'Find files by name',
    });
    console.log('Input received:', input);
    if (input === undefined || input.trim() === '') {
        return;
    }

    // Build a filesToInclude glob pattern for the Search panel
    // If user typed glob chars, use as-is; otherwise treat as substring match
    const hasGlob = /[*?{}\[\]]/.test(input);
    const filesToInclude = hasGlob ? input : `**/*${input}*`;

    console.log('Executing findInFiles with filesToInclude:', filesToInclude);

    // Workaround: VS Code Search panel won't trigger with empty query.
    // Use a single space as the query (matches all files via whitespace) combined with filesToInclude.
    await vscode.commands.executeCommand('workbench.action.findInFiles', {
        query: ' ', // Single space as placeholder
        filesToInclude: filesToInclude,
        triggerSearch: true,
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log(
        `Congratulations, your extension "find-more" is now active! (${vscode.env.appRoot})`
    );

    //core contributions
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'findInFile.withText',
            async function () {
                var editor = vscode.window.activeTextEditor;
                if (editor == null) {
                    return;
                }
                var target = editor.document.getText(editor.selection);
                var path = editor.document.uri.fsPath;

                findInFile(path, target);
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'findInFile.withFile',
            async function (uri: vscode.Uri) {
                var path = uri.fsPath;
                findInFile(path, '');
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('findInFile.byName', findByName)
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
