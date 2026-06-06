import { isIdentifier, isObjectProperty } from '@babel/types'
import { BaseNodeHandler } from './BaseNodeHandler'
export class ObjectPropertyHandler extends BaseNodeHandler {
  isContain(): boolean {
    return this._isContain(this.path.parentPath!.node, this.index)
  }
  handle() {
    const parentNode = this.path.parentPath!.node
    const key = isObjectProperty(parentNode) ? parentNode.key : undefined
    return {
      name: isIdentifier(key) ? key.name : '',
      start: { ...parentNode.loc!.start },
      end: { ...parentNode.loc!.end },
    }
  }
}
