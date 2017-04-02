"use strict";

import * as vscode from 'vscode';
//import * as markdownlint from 'markdownlint';
// Requires
//var vscode = require("vscode");
var markdownlint = null;//require("markdownlint");
var fs = require("fs");
var path = require("path");
var packageJson =null;// require("./package.json");
var defaultConfig =null;// require("./default-config.json");

// Constants
var extensionName ='test';// packageJson.name;
var markdownlintVersion ='test';// packageJson
    // .dependencies
    // .markdownlint
    // .replace(/[^\d.]/, "");
var configFileName = ".markdownlint.json";
var markdownLanguageId = "markdown";
var markdownlintRulesMdPrefix = "https://github.com/DavidAnson/markdownlint/blob/v";
var markdownlintRulesMdPostfix = "/doc/Rules.md";
var codeActionPrefix = "Click for more information about ";
var configOverride = "The '" + configFileName +
    "' file in this folder overrides any user/workspace configuration settings for the " +
    extensionName + " extension.";
var badConfig = "Unable to read configuration file ";
var throttleDuration = 500;

// Variables
var diagnosticCollection = null;
var customConfig = null;
var throttle = {
    "document": null,
    "timeout": null
};

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
    var settings = vscode.workspace.getConfiguration(packageJson.displayName);
    customConfig = settings.get("config");

    var rootPath = vscode.workspace.rootPath;
    if (rootPath) {
        var configFilePath = path.join(rootPath, configFileName);
        if (fs.existsSync(configFilePath)) {
            try {
                customConfig = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
                vscode.window.showInformationMessage(configOverride);
            } catch (ex) {
                vscode.window.showWarningMessage(badConfig + "'" + configFilePath + "' (" + (ex.message || ex.toString()) + ")");
            }
        }
    }

    // Re-lint all open files
    //(vscode.workspace.textDocuments || []).forEach(lint);
}

// Suppresses a pending lint for the specified document
function suppressLint(document) {
    if (throttle.timeout && (document === throttle.document)) {
        clearTimeout(throttle.timeout);
        throttle.document = null;
        throttle.timeout = null;
    }
}

// Requests a lint of the specified document
function requestLint(document) {
    suppressLint(document);
    throttle.document = document;
    throttle.timeout = setTimeout(function waitThrottleDuration() {
        // Do not use throttle.document in this function; it may have changed
        //lint(document);
        suppressLint(document);
    }, throttleDuration);
}

// Handles the didChangeTextDocument event
function didChangeTextDocument(change) {
    requestLint(change.document);
}

// Handles the didCloseTextDocument event
function didCloseTextDocument(document) {
    suppressLint(document);
    diagnosticCollection.delete(document.uri);
}


const channel = null;// = vscode.window.createOutputChannel("find all channel");

function findAll(s = " ") {
    //console.log(s);
    // get active text editor
    var editor = vscode.window.activeTextEditor;
    var target = editor.document.getText(editor.selection);
    //target=s;

    var line = editor.document.lineCount;
    var filename = editor.document.uri;

    //clear channel at first
    var found = [];
    // channel.clear();
    for (var i = 0; i < line; i++) {
        var tmp = editor.document.lineAt(i);
        var text = tmp.text;
        var info = null;
        if (text.indexOf(target) >= 0) {
            info = filename + "\t" + i + "\t" + text;
            // channel.appendLine(info);
            found.push(info);
            //vscode.window.showQuickPick(info);
        }
    }
    //show channel with msg
    // channel.show();

    var diagnostics = [];

    // Lint and create Diagnostics
    var document = vscode.window.activeTextEditor.document;

    found.forEach(function forResult(result) {
        var ruleName = "test";//result.ruleName;
        var ruleDescription = 'test';//result.ruleDescription;
        var message = 'test';//ruleName + "/" + result.ruleAlias + ": " + ruleDescription;
        /*if (result.errorDetail) {
            message += " [" + result.errorDetail + "]";
        }*/
        var range = document.lineAt(1).range;
        /*if (result.errorRange) {
            var start = result.errorRange[0] - 1;
            var end = start + result.errorRange[1];
            range = range.with(range.start.with(undefined, start), range.end.with(undefined, end));
        }*/
        var diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
        diagnostic.code = markdownlintRulesMdPrefix + markdownlintVersion + markdownlintRulesMdPostfix +
            "#" + ruleName.toLowerCase() + "---" + ruleDescription.toLowerCase().replace(/ /g, "-");
        diagnostics.push(diagnostic);
    });

    // Publish
    diagnosticCollection.set(document.uri, diagnostics);
}


function jump() {
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    var lineid = selection.start.line;
    var name = 'f:/Projects/Client/GitBook/fengyouzheng/pin-llvm-doc/SUMMARY.md';
    var uri = vscode.Uri.file(name);
    var line = null;

    vscode.workspace.openTextDocument(uri);
    //var args={'to':name,'by':'tab','value':'1'};
    //var args={'to':'first'};
    //let success = vscode.commands.executeCommand('moveActiveEditor',args );
    //console.log(success);

    //new vscode.Diagnostic()
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "find-more" is now active!');


    // Hook up to workspace events
    context.subscriptions.push(
        //vscode.workspace.onDidOpenTextDocument(lint),
        //vscode.workspace.onDidChangeTextDocument(didChangeTextDocument),
        //vscode.workspace.onDidCloseTextDocument(didCloseTextDocument),
        //vscode.workspace.onDidChangeConfiguration(loadCustomConfig)
    );

    // Register CodeActionsProvider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(markdownLanguageId, {
            "provideCodeActions": provideCodeActions
        }));

    // Create DiagnosticCollection
    diagnosticCollection = vscode.languages.createDiagnosticCollection(extensionName);
    context.subscriptions.push(diagnosticCollection);

    // Hook up to file system changes for custom config file
    var rootPath = vscode.workspace.rootPath;
    if (rootPath) {
        var fileSystemWatcher = vscode.workspace.createFileSystemWatcher(path.join(rootPath, configFileName));
        context.subscriptions.push(
            fileSystemWatcher,
            fileSystemWatcher.onDidCreate(loadCustomConfig),
            fileSystemWatcher.onDidChange(loadCustomConfig),
            fileSystemWatcher.onDidDelete(loadCustomConfig));
    }

    // Load custom rule config
    //loadCustomConfig();

    //core contributions
    let disposable = null;
    disposable = vscode.commands.registerCommand('find.findAll', () => {
        //var input = 
        findAll();
        // var doc = vscode.window.activeTextEditor.document;
        // lint(doc);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('find.jump', () => {
        //var input = 
        jump();
    });
    context.subscriptions.push(disposable);
}

exports.activate = activate;


// this method is called when your extension is deactivated
export function deactivate() {
}