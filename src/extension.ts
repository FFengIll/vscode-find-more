'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const channel = vscode.window.createOutputChannel("find all channel");

function findAll(s=" ") {
    //console.log(s);
    // get active text editor
    var editor = vscode.window.activeTextEditor;
    var target = editor.document.getText(editor.selection);
    //target=s;

    var line = editor.document.lineCount;
    var filename = editor.document.uri;

    //clear channel at first
    channel.clear();
    for (var i = 0; i < line; i++) {
        var tmp = editor.document.lineAt(i);
        var text = tmp.text;
        var info = null;
        if (text.indexOf(target) > 0) {
            info = filename +"\t"+ i +"\t"+ text;
            channel.appendLine(info);
            //vscode.window.showQuickPick(info);
        }
    }
    //show channel with msg
    channel.show();

}


function jump(){
var editor=vscode.window.activeTextEditor;
var selection=editor.selection;
var lineid=selection.start.line;
var name='f:/Projects/Client/GitBook/fengyouzheng/pin-llvm-doc/SUMMARY.md';
var uri=vscode.Uri.file(name);
var line=null;

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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = null;
    disposable = vscode.commands.registerCommand('find.findAll', () => {
        //var input = 
        findAll();
    });
    context.subscriptions.push(disposable);

        disposable = vscode.commands.registerCommand('find.jump', () => {
        //var input = 
        jump();
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}