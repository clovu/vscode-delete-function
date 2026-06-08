import * as vscode from 'vscode'
import { getDeleteFunctionNodeJs } from './handleJs'
import { getDeleteFunctionNodeRust, vscodePosition2RustPosition } from './handleRs'
import { getDeleteFunctionNodeVue } from './handleVue'

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface Node {
  name: string;
  start: {
    line: number;
    column: number;
    index: number;
  };
  end: {
    line: number;
    column: number;
    index: number;
  };
}

export function getDeleteFunctionNode(position: Position, code: string, type: string) {
  const { offset } = position

  if (type === 'vue') {
    return getDeleteFunctionNodeVue(offset, code)
  } if (type === 'rust') {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    return getDeleteFunctionNodeRust(code, vscodePosition2RustPosition(position))
  } else {
    return getDeleteFunctionNodeJs(offset, code)
  }
}
