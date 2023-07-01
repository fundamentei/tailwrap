import * as vscode from "vscode";
import wrap from "./wrap";

export function activate(context: vscode.ExtensionContext) {
  function generateCommand(groupByStrategy: "MODIFIER" | "GROUP") {
    return async () => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const editor = vscode.window.activeTextEditor;
      const selectionWithQuotes = editor.document.getText(editor.selection);
      if (!selectionWithQuotes) {
        return;
      }

      let selectionContents = "";
      try {
        selectionContents = JSON.parse(selectionWithQuotes);
      } catch {
        vscode.window.showErrorMessage("Invalid selection");
        return;
      }
      const replacement = wrap(selectionContents, groupByStrategy, "CLASSNAMES");
      if (replacement) {
        editor.edit((editBuilder) => {
          return editBuilder.replace(editor.selection, replacement);
        });
      }
    };
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("tailwrap.wrapByModifier", generateCommand("MODIFIER")),
    vscode.commands.registerCommand("tailwrap.wrapByGroup", generateCommand("GROUP"))
  );
}

export function deactivate() {}
