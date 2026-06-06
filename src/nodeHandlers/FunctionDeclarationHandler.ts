import type { FunctionDeclaration } from "@babel/types";
import { BaseNodeHandler } from "./BaseNodeHandler";
export class FunctionDeclarationHandler extends BaseNodeHandler<FunctionDeclaration> {
  isContain(): boolean {
    return this._isContain(this.path.node, this.index);
  }

  handle() {
    return {
      name: this.path.node.id?.name ?? "",
      start: { ...this.path.node.loc!.start },
      end: { ...this.path.node.loc!.end },
    };
  }
}
