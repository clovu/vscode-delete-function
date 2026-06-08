import { Position, rust2ast } from '@delete-function/rust'

import type { Node, Position as VscPosition } from './index'

export function vscodePosition2RustPosition(vp: VscPosition): Position {
  return new Position(vp.line + 1, vp.column)
}

export function getDeleteFunctionNodeRust(code: string, position: Position) {
  const astStr = rust2ast(code, position)
  if (!astStr) { return }
  const ast = JSON.parse(astStr) as Node

  return {
    name: ast.name,
    start: {
      line: ast.start.line,
      column: ast.start.column
    },
    end: {
      line: ast.end.line,
      column: ast.end.column
    },
  }
}
