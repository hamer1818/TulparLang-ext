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
    const defaultCmd = config.get('runCommand') || 'tulpar ${file}';
    const filePath = doc.fileName;
    const cmd = defaultCmd.replace('${file}', '"' + filePath + '"');

    const terminal = vscode.window.createTerminal({ name: 'Tulpar Run' });
    terminal.show(true);
    terminal.sendText(cmd);
  });

  // Status bar item for quick access
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'tulpar.runFile';
  statusBarItem.text = '$(play) Tulpar: Run';
  statusBarItem.tooltip = 'Run current Tulpar file';
  
  // Show status bar item only when a Tulpar file is active
  const updateStatusBar = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'tulpar') {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  };

  updateStatusBar();
  vscode.window.onDidChangeActiveTextEditor(updateStatusBar);
  vscode.workspace.onDidOpenTextDocument(updateStatusBar);

  context.subscriptions.push(runDisposable);
  context.subscriptions.push(statusBarItem);
}

function deactivate() {}

module.exports = { activate, deactivate };
