"use strict"

import * as vscode from "vscode"
import Finder from "./Finder"
import { FindTextInFilesOptions } from "vscode"
import { openStdin } from "process"

// do not use it
export interface IFindInFilesArgs {
  query?: string
  replace?: string
  preserveCase?: boolean
  triggerSearch?: boolean
  filesToInclude?: string
  filesToExclude?: string
  isRegex?: boolean
  isCaseSensitive?: boolean
  matchWholeWord?: boolean
  useExcludeSettingsAndIgnoreFiles?: boolean
  onlyOpenEditors?: boolean
}

function findInFile(path: string, target: string) {
  var include: string[] = []
  vscode.workspace.workspaceFolders?.map((folder) => {
    var folderPath = folder.uri.path
    if (path.startsWith(folderPath)) {
      var splitor = path.charAt(folderPath.length)
      if (splitor == "\\" || splitor == "/") {
        include.push(path.substring(folderPath.length + 1))
      }
    }
  })

  console.info(path)
  console.info(include)
  if (include.length == 0) {
    include.push(path)
  }
  var filesToInclude = include.join(",")
  if (target.length > 0) {
    vscode.commands.executeCommand("workbench.action.findInFiles", {
      query: target,
      filesToInclude: filesToInclude,
      triggerSearch: true,
    })
  } else {
    vscode.commands.executeCommand("workbench.action.findInFiles", {
      query: "",
      filesToInclude: filesToInclude,
      triggerSearch: false,
    })
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  //console.log('Congratulations, your extension "find-more" is now active!');

  // let finder = new Finder(context)

  //core contributions
  context.subscriptions.push(
    vscode.commands.registerCommand("findInFile.withText", async function () {
      var editor = vscode.window.activeTextEditor
      if (editor == null) {
        return
      }
      var target = editor.document.getText(editor.selection)
      var path = editor.document.uri.fsPath

      findInFile(path, target)
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "findInFile.withFile",
      async function (uri: vscode.Uri) {
        var path = uri.fsPath
        findInFile(path, "")
      }
    )
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
