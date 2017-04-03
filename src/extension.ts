"use strict";

import * as vscode from 'vscode';

// Constants
var extensionName = 'find-more';
var configFileName = ".markdownlint.json";
var codeActionPrefix = "Click for more information about ";
// var configOverride = "The '" + configFileName +
//     "' file in this folder overrides any user/workspace configuration settings for the " +
//     extensionName + " extension.";
var badConfig = "Unable to read configuration file ";

// Variables
var diagnosticCollection: vscode.DiagnosticCollection = null;
var customConfig = null;
var throttle = {
    "document": null,
    "timeout": null
};

var colors = {}
const channel = null;// = vscode.window.createOutputChannel("find all channel");

// Implements CodeActionsProvider.provideCodeActions to open info links for rules
function provideCodeActions(document, range, codeActionContext) {
    var diagnostics = codeActionContext.diagnostics || [];
    return diagnostics.map(function forDiagnostic(diagnostic) {
        return {
            "title": codeActionPrefix + diagnostic.message.substr(0, 5),
            "command": "vscode.open",
            "arguments": [vscode.Uri.parse(diagnostic.code)]
        };
    });
}

// Loads custom rule configuration
function loadCustomConfig() {

}

// Suppresses a pending lint for the specified document
function suppressLint(document) {
    if (throttle.timeout && (document === throttle.document)) {
        clearTimeout(throttle.timeout);
        throttle.document = null;
        throttle.timeout = null;
    }
}

/**
 * result
 */
class result {
    desc: string;
    index;
    textline: vscode.TextLine;
    line;
    constructor() {

    }
}

function getColorDecoration(color = '#FF0000') {
    if (1) {
        var rules = {};
        var markerType = "background";
        switch (markerType) {
            case 'background':
                rules['backgroundColor'] = color;
                rules['color'] =/* getColorContrast(color) === */'dark' ? '#111' : '#fff';
                break;
            case 'underline':
                rules['color'] = 'inherit; border-bottom:solid 2px ' + color;
                break;
            default:  // outline
                rules['borderColor'] = color;
                rules['borderStyle'] = 'solid';
                rules['borderWidth'] = '2px';
                break;
        }
        colors[color] = vscode.window.createTextEditorDecorationType(rules);
    }
    var res = colors[color];
    return res;
}


function findAll(target) {

    // get active text editor
    var editor = vscode.window.activeTextEditor;
    var document = vscode.window.activeTextEditor.document;

    //var target = editor.document.getText(editor.selection);
    var len = target.length;

    var line = editor.document.lineCount;
    var filename = editor.document.uri;

    //clear channel at first
    var found = [];

    // Lint and create Diagnostics
    var diagnostics = [];

    var color = getColorDecoration();
    var ranges = [];

    //clean first
    diagnosticCollection.clear();
    // channel.clear();

    //process
    for (var i = 0; i < line; i++) {
        var textline = editor.document.lineAt(i);
        var text = textline.text;
        var first = text.indexOf(target);
        var info = new result;
        if (first < 0) {
            continue;
        } else {
            info.desc = filename + "\t" + i + "\t" + text;
            info.index = first;
            info.textline = textline;
            info.line = i;

            //console.info(info);
            //channel.appendLine(info.desc);
            found.push(info);

            //process diagnostic
            var ruleName = "found";//result.ruleName;
            var ruleDescription = 'found';//result.ruleDescription;
            var message = info.textline.text;//ruleName + "/" + result.ruleAlias + ": " + ruleDescription;
            /*if (result.errorDetail) {
                message += " [" + result.errorDetail + "]";
            }*/
            var range = new vscode.Range(info.line, info.index, info.line, info.index + len);
            ranges.push(range);
            /*if (result.errorRange) {
                var start = result.errorRange[0] - 1;
                var end = start + result.errorRange[1];
                range = range.with(range.start.with(undefined, start), range.end.with(undefined, end));
            }*/

            var diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Information);
            //diagnostic.code = markdownlintRulesMdPrefix + markdownlintVersion + markdownlintRulesMdPostfix +
            //    "#" + ruleName.toLowerCase() + "---" + ruleDescription.toLowerCase().replace(/ /g, "-");
            diagnostic.code = 'found';
            diagnostics.push(diagnostic);
        }
    }

    // Publish
    //editor.setDecorations(getColorDecoration(), ranges);
    //channel.show();
    diagnosticCollection.set(document.uri, diagnostics);
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "find-more" is now active!');

    // Create DiagnosticCollection
    diagnosticCollection = vscode.languages.createDiagnosticCollection(extensionName);
    context.subscriptions.push(diagnosticCollection);

    // Load custom rule config
    loadCustomConfig();

    //core contributions
    let disposable = null;
    disposable = vscode.commands.registerCommand('find.findAll', () => {
        var editor = vscode.window.activeTextEditor;
        var target = editor.document.getText(editor.selection);

        if (target.length > 0) {
            findAll(target);
        } else {
            vscode.window.showInputBox({ prompt: 'target' })
                .then(target => {
                    findAll(target);
                });
        }
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}