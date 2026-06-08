import type { ClassMethod } from '@babel/types'
import { isIdentifier } from '@babel/types'
import { BaseNodeHandler } from './BaseNodeHandler'

export class ClassMethodsHandler extends BaseNodeHandler<ClassMethod>{
  isContain(): boolean {
    return this._isContain(this.path.node, this.index)
  }
  handle () {
    const { key } = this.path.node
    return {
      name: isIdentifier(key) ? key.name : '',
      start: { ...this.path.node.loc!.start },
      end: { ...this.path.node.loc!.end },
    }
  }
}
