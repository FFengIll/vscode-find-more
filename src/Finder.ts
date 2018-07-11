"use strict";

import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';

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

    private engine: string;
    private engine_options: Array<string>;

    private useDiagnostics: Boolean;

    static EXTENSION_NAME = 'find-more';

    constructor(context: vscode.ExtensionContext) {
        this.extensionName = "find-more";

        // output channel
        this.channel = vscode.window.createOutputChannel(Finder.EXTENSION_NAME);

        // get ripgrep
        this.engine = vscode.workspace.getConfiguration().get<string>('find.engine');
        var option_str = vscode.workspace.getConfiguration().get<string>('find.options');
        this.engine_options = option_str.split(' ');

        // use  diagnostics
        this.useDiagnostics = vscode.workspace.getConfiguration().get<boolean>('find.diagnostics');

        // Create DiagnosticCollection
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection(this.extensionName);
        context.subscriptions.push(this.diagnosticCollection);

        this.channel = vscode.window.createOutputChannel("find all channel");

        // Load custom rule config
        loadCustomConfig();

        this.showPosition = new vscode.Position(10, 0);
    }

    private get_indexes(text: string, target: string): any {
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
        let lineCount = doc.lineCount;

        // data array
        var diagnostics = [];
        var locations = [];
        var ranges = [];
        var lines = [];
        var filepath = vscode.window.activeTextEditor.document.uri.fsPath.toString();

        //try if we have rg
        var options = [];
        options.push(target);
        options.push(filepath);
        options = options.concat(this.engine_options);

        this.channel.show();

        var completed = false;
        console.log(this.engine, options.toString())
        if (this.engine) {
            var rg = child_process.spawnSync(this.engine, options);
            if (rg.stdout != null) {
                completed = true;
                var output = rg.stdout.toString();
                console.log(output);

                //work both with \r and \n
                var found = output.split('\n');
                if (found.length <= 1) {
                    found = output.split('\r');
                }
                //process
                found.forEach(element => {
                    var pair = element.split(':');
                    if (pair.length <= 1) {
                        return;
                    }
                    //start from 0
                    var lineno = parseInt(pair[0]) - 1;
                    lines.push(lineno);
                })

            } else {
                completed = false;
            }
        }

        if (!completed) {
            this.channel.appendLine("no engine or error, use general find instead!");
            console.log("no engine or error, use general find instead!");
            //if no engine or error, general find
            for (var lineno = 0; lineno < lineCount; lineno++) {
                let text = editor.document.lineAt(lineno).text;
                let index = text.indexOf(target);
                if (index >= 0) {
                    lines.push(lineno);
                }
            }
        }

        lines.forEach(lineno => {

            let text = editor.document.lineAt(lineno).text;
            let indexes = this.get_indexes(text, target);

            indexes.forEach(index => {
                //set position, range, uri to show as reference
                let start = new vscode.Position(lineno, index);
                let end = new vscode.Position(lineno, index + target.length);
                let range = new vscode.Range(start, end);
                let location = new vscode.Location(uri, range);
                locations.push(location);

                //show in log
                let message = filepath + "\t" + lineno + "\t" + text;
                this.channel.appendLine(message);
                console.log(message);

                //process diagnostic
                if (this.useDiagnostics) {
                    var ruleName = "found";//result.ruleName;
                    var ruleDescription = 'found';//result.ruleDescription;

                    //ruleName + "/" + result.ruleAlias + ": " + ruleDescription;

                    //var range = new vscode.Range(lineno, index, lineno, index + target.length);
                    ranges.push(range);

                    var diagnostic = new vscode.Diagnostic(range, text, vscode.DiagnosticSeverity.Information);

                    diagnostic.code = 'found';
                    diagnostics.push(diagnostic);
                }
            });

        });

        this.showInReference(uri, locations);
        if (this.useDiagnostics) {
            this.showInProblems(uri, diagnostics);
        }
    }

    public find2017(target: string) {
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
            let chs = this.get_indexes(text, target);

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