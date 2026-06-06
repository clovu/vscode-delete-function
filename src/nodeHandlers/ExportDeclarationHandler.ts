// ExportNamedDeclaration and ExportDefaultDeclaration
import { isExportNamedDeclaration, isFunctionDeclaration } from "@babel/types";
import { BaseNodeHandler } from "./BaseNodeHandler";
export class ExportDeclarationHandler extends BaseNodeHandler {
  isContain(): boolean {
    return this._isContain(this.path.parentPath!.node, this.index);
  }

  handle() {
    const parentPath = this.path.parentPath!;
    const parentNode = parentPath.node;
    const getName = () => {
      if (!isExportNamedDeclaration(parentNode)) {
        return "";
      }
      const declaration = parentNode.declaration;
      return isFunctionDeclaration(declaration)
        ? declaration.id?.name ?? ""
        : "";
    };
    return {
      name: getName(),
      start: { ...parentNode.loc!.start },
      end: { ...parentNode.loc!.end },
    };
  }
}
