"use strict";

import * as vscode from 'vscode';
import * as path from 'path';

// Loads custom rule configuration
function loadCustomConfig() {

}

var colors = {};

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

/**
 * Finder
 */
export default class Finder {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private channel: vscode.OutputChannel;

    private extensionName: string;
    private showPosition: vscode.Position;

    constructor(context: vscode.ExtensionContext) {
        this.extensionName = "find-more";

        // Create DiagnosticCollection
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection(this.extensionName);
        context.subscriptions.push(this.diagnosticCollection);

        this.channel = vscode.window.createOutputChannel("find all channel");

        // Load custom rule config
        loadCustomConfig();

        this.showPosition = new vscode.Position(10, 0);
    }

    private find_in_string(text: string, target: string): any {
        let chs = new Array();

        let maxlen = text.length;
        let len = target.length;
        let cur = 0;
        while (cur < maxlen) {
            var ch = text.indexOf(target, cur);
            if (ch < 0) {
                break;
            } else {
                chs.push(ch);
                cur = ch + len;
            }
        }

        return chs;
    }

    public find(target: string) {
        // get active text editor
        let editor = vscode.window.activeTextEditor;
        let doc = vscode.window.activeTextEditor.document;
        let uri = doc.uri
        let totalline = doc.lineCount;

        // data array
        var diagnostics = [];
        var foundLocations = [];
        var ranges = [];

        //process
        for (var line = 0; line < totalline; line++) {
            let text = editor.document.lineAt(line).text;
            let chs = this.find_in_string(text, target);

            chs.forEach(ch => {
                //set position, range, uri
                let start = new vscode.Position(line, ch);
                let end = new vscode.Position(line, ch + target.length);
                let range = new vscode.Range(start, end);
                let location = new vscode.Location(uri, range);
                foundLocations.push(location);
            });

            chs.forEach(ch => {
                let desc = uri + "\t" + line + "\t" + text;

                //process diagnostic
                var ruleName = "found";//result.ruleName;
                var ruleDescription = 'found';//result.ruleDescription;
                var message = text;
                //ruleName + "/" + result.ruleAlias + ": " + ruleDescription;

                var range = new vscode.Range(line, ch, line, ch + target.length);
                ranges.push(range);

                var diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Information);

                diagnostic.code = 'found';
                diagnostics.push(diagnostic);
            });

        }

        this.showInProblems(uri, diagnostics);
        this.showInReference(uri, foundLocations);
    }

    /**
     * use executeCommand with editor.action.showReferences to show find results
     * 
     * Official Doc:
     * editor.action.showReferences - Show references at a position in a file
     * uri The text document in which to show references
     * position The position at which to show
     * locations An array of locations.
     * @param target 
     */
    private async showInReference(showUri: vscode.Uri, foundLocations: any[]) {
        let showPosition = this.showPosition;
        //use command to show
        var res = await vscode.commands.executeCommand(
            'editor.action.showReferences',
            showUri, showPosition, foundLocations);
        //console.log(res);
    }

    /**
     * use vscode.Diagnostic to show find results in PROBLEMS panel
     * @param target 
     */
    private showInProblems(uri: vscode.Uri, diagnostics: any[]) {
        //clean
        this.clear();

        var color = getColorDecoration();

        // Publish
        //editor.setDecorations(getColorDecoration(), ranges);
        //this.channel.show();
        this.diagnosticCollection.set(uri, diagnostics);
    }

    public clear() {
        this.channel.clear();
        this.diagnosticCollection.clear();
    }
}