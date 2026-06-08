import * as vscode from 'vscode'
import { getDeleteFunctionNode, type Position } from '@delete-function/core'

export function activate(context: vscode.ExtensionContext) {
  const commandId = 'delete-function.deleteFunction'
  const disposable = vscode.commands.registerCommand(commandId, () => {
    try {
      deleteFunction()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      vscode.window.showErrorMessage(`Delete function failed: ${message}`)
    }
  })

  context.subscriptions.push(disposable)
}

function createPosition(curPos: vscode.Position): Position {
  const editor = vscode.window.activeTextEditor
  const offset = editor?.document.offsetAt(curPos)

  return {
    line: curPos.line,
    column: curPos.character,
    offset: offset ?? 0
  }
}

function deleteFunction() {
  const editor = vscode.window.activeTextEditor

  if (editor) {
    const curPos = editor.selection.active

    const languageType = vscode.window.activeTextEditor?.document.languageId
    const position = createPosition(curPos)

    if (!languageType) {
      return
    }

    const node = getDeleteFunctionNode(
      position,
      editor.document.getText(),
      languageType
    )

    if (!node) {
      return
    }

    editor.edit((editBuilder) => {
      editBuilder.delete(
        new vscode.Range(
          new vscode.Position(node.start.line - 1, node.start.column),
          new vscode.Position(node.end.line - 1, node.end.column)
        )
      )
    })
  }
}
