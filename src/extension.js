const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const runDisposable = vscode.commands.registerCommand('tulpar.runFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor with a Tulpar file.');
      return;
    }

    const doc = editor.document;
    if (doc.languageId !== 'tulpar') {
      vscode.window.showErrorMessage('Active file is not a Tulpar file.');
      return;
    }

    await doc.save();

    const config = vscode.workspace.getConfiguration('tulpar');
    const defaultCmd = config.get('runCommand') || 'tulpar run ${file}';
    const filePath = doc.fileName;
    const cmd = defaultCmd.replace('${file}', '"' + filePath + '"');

    const terminal = vscode.window.createTerminal({ name: 'Tulpar Run' });
    terminal.show(true);
    terminal.sendText(cmd);
  });

  context.subscriptions.push(runDisposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
