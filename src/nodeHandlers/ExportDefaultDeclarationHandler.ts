import { BaseNodeHandler } from "./BaseNodeHandler";
export class ExportDefaultDeclarationHandler extends BaseNodeHandler {
  isContain(): boolean {
    return this._isContain(this.path.parentPath!.node, this.index);
  }

  handle() {
    const parentNode = this.path.parentPath!.node;
    return {
      name: "",
      start: { ...parentNode.loc!.start },
      end: { ...parentNode.loc!.end },
    };
  }
}
