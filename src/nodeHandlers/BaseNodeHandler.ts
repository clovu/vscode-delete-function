import type { NodePath } from '@babel/traverse'
import type { Node as BabelNode } from '@babel/types'

interface Node {
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

interface IBaseNodeHandler {
  handle(): Node | undefined;
  isContain(): boolean;
}

export class BaseNodeHandler<T extends BabelNode = BabelNode>
  implements IBaseNodeHandler
{
  protected path: NodePath<T>
  protected index: number
  constructor(path: NodePath<T>, index: number) {
    this.path = path
    this.index = index
  }

  _isContain(node: BabelNode, index: number) {
    // 也可以通过 工具类实现
    return index >= node.start! && index <= node.end!
  }

  isContain(): boolean {
    throw new Error('must write isContain')
  }

  handle(): Node | undefined {
    throw new Error('must write handle')
  }
}
