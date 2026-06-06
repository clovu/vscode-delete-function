import { isIdentifier, isVariableDeclarator } from "@babel/types";
import { BaseNodeHandler } from "./BaseNodeHandler";
export class FunctionExpressionHandler extends BaseNodeHandler {
  isContain(): boolean {
    return this._isContain(this.path.parentPath!.parentPath!.node, this.index);
  }
  handle() {
    const declaratorNode = this.path.parentPath!.node;
    const id = isVariableDeclarator(declaratorNode)
      ? declaratorNode.id
      : undefined;
    const grandParentNode = this.path.parentPath!.parentPath!.node;
    return {
      name: isIdentifier(id) ? id.name : "",
      start: { ...grandParentNode.loc!.start },
      end: { ...grandParentNode.loc!.end },
    };
  }
}
