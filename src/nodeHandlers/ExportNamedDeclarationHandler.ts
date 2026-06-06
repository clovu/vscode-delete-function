import { BaseNodeHandler } from './BaseNodeHandler'
export class ExportNamedDeclarationHandler extends BaseNodeHandler {
  isContain(): boolean {
    return this._isContain(
      this.path.parentPath!.parentPath!.parentPath!.node,
      this.index
    )
  }

  handle() {
    const getName = () => {
      return Object.keys(this.path.parentPath!.getBindingIdentifiers())[0]
    }

    const targetNode = this.path.parentPath!.parentPath!.parentPath!.node
    return {
      name: getName(),
      start: { ...targetNode.loc!.start },
      end: { ...targetNode.loc!.end },
    }
  }
}
