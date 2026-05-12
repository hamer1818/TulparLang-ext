const vscode = require('vscode');
const path = require('path');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

const LANGUAGE_ID = 'tulpar';

let client = null;

/**
 * Resolve the configured Tulpar executable. Returns a quoted path
 * suitable for embedding in a shell command.
 */
function tulparExe() {
  const cfg = vscode.workspace.getConfiguration('tulpar');
  const exe = (cfg.get('executablePath') || 'tulpar').trim();
  if (exe.includes(' ') && !exe.startsWith('"')) {
    return '"' + exe + '"';
  }
  return exe;
}

/**
 * Build a shell command for a given mode. Mode-specific flags follow
 * Tulpar's CLI: default = AOT compile + run silently (falls back to VM
 * on AOT failure), '--vm' forces VM, 'build' produces a standalone exe,
 * '--repl' is interactive.
 */
function buildCommand(mode, filePath, outputName) {
  const exe = tulparExe();
  const quoted = '"' + filePath + '"';
  switch (mode) {
    case 'vm':
      return `${exe} --vm ${quoted}`;
    case 'aot-build': {
      const out = outputName && outputName.length
        ? ' "' + outputName + '"'
        : '';
      return `${exe} build ${quoted}${out}`;
    }
    case 'aot-run':
      return `${exe} --aot ${quoted}`;
    case 'repl':
      return `${exe} --repl`;
    case 'run':
    default:
      return `${exe} ${quoted}`;
  }
}

/**
 * Return the active Tulpar document, or show a friendly error.
 */
async function activeTulparDoc() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('Tulpar: No active editor.');
    return null;
  }
  const doc = editor.document;
  if (doc.languageId !== LANGUAGE_ID) {
    vscode.window.showErrorMessage('Tulpar: Active file is not a Tulpar (.tpr) file.');
    return null;
  }
  await doc.save();
  return doc;
}

/**
 * Run a command in a reusable Tulpar terminal.
 */
function runInTerminal(name, cmd) {
  const existing = vscode.window.terminals.find(t => t.name === name);
  const terminal = existing || vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
}

// ---------------------------------------------------------------------------
// LSP client
// ---------------------------------------------------------------------------
//
// Spawns `tulpar --lsp` as a child process and connects via stdio JSON-RPC.
// Replaces the previous regex-based stderr scraping: diagnostics, hover,
// completion, etc. all flow through the standard LSP protocol once the
// server side adds them.
function startLanguageClient() {
  const cfg = vscode.workspace.getConfiguration('tulpar');
  if (!cfg.get('diagnostics.enabled', true)) return;

  const exe = (cfg.get('executablePath') || 'tulpar').trim();

  const serverOptions = {
    run:   { command: exe, args: ['--lsp'], transport: TransportKind.stdio },
    debug: { command: exe, args: ['--lsp'], transport: TransportKind.stdio },
  };

  const clientOptions = {
    documentSelector: [{ scheme: 'file', language: LANGUAGE_ID }],
    synchronize: {
      // Re-validate every open document when the user edits Tulpar config.
      configurationSection: 'tulpar',
    },
  };

  client = new LanguageClient('tulpar', 'Tulpar Language Server',
                              serverOptions, clientOptions);
  client.start();
}

function stopLanguageClient() {
  if (!client) return Promise.resolve();
  const c = client;
  client = null;
  return c.stop();
}

// ---------------------------------------------------------------------------
// Debug adapter
// ---------------------------------------------------------------------------
//
// VS Code spawns the adapter ONCE per debug session and talks DAP over
// the spawned process's stdio. `tulpar debug <file>` is the adapter
// entry point: it AOT-builds the .tpr with --debug (DWARF), spawns a
// gdb subprocess, and forwards setBreakpoints / stackTrace / variables
// / etc. to gdb/MI. `program` is passed as argv[2] so the adapter
// already knows the source file at startup; the launch request's
// `arguments.program` overrides this when present (kept for clients
// that don't go through the factory).
class TulparDebugAdapterFactory {
  createDebugAdapterDescriptor(session) {
    const cfg = vscode.workspace.getConfiguration('tulpar');
    const exe = (cfg.get('executablePath') || 'tulpar').trim();
    const program = (session.configuration && session.configuration.program) || '';
    return new vscode.DebugAdapterExecutable(exe, ['debug', program]);
  }
}

// `tulpar.debug` mirrors the `Tulpar: Run File` ergonomics but routes
// through VS Code's debug subsystem instead of a terminal. Picks up
// the active .tpr, builds a transient launch config, and hands it to
// `vscode.debug.startDebugging`. The launch config is identical in
// shape to what users put in their launch.json; users who want
// persistent settings can use the F5 + launch.json flow instead.
async function debugActiveFile() {
  const doc = await activeTulparDoc();
  if (!doc) return;
  const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
  await vscode.debug.startDebugging(folder, {
    type: 'tulpar',
    request: 'launch',
    name: 'Tulpar: Debug Active File',
    program: doc.fileName,
    stopOnEntry: false,
  });
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------
function activate(context) {
  startLanguageClient();

  // Restart the LSP if the user changes the executable path / toggles
  // diagnostics, so they don't have to reload the window.
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('tulpar.executablePath') ||
          e.affectsConfiguration('tulpar.diagnostics.enabled')) {
        await stopLanguageClient();
        startLanguageClient();
      }
    })
  );

  // ---- Commands ----
  const cmd = (id, mode) => vscode.commands.registerCommand(id, async () => {
    const doc = await activeTulparDoc();
    if (!doc) return;
    const cfg = vscode.workspace.getConfiguration('tulpar');
    const override = (cfg.get('runCommand') || '').trim();
    if (override && id === 'tulpar.runFile') {
      const final = override.replace('${file}', '"' + doc.fileName + '"');
      runInTerminal('Tulpar', final);
      return;
    }
    let out = '';
    if (mode === 'aot-build') {
      out = (cfg.get('aot.outputName') || '').trim();
      if (!out) {
        out = path.basename(doc.fileName, path.extname(doc.fileName));
      }
    }
    runInTerminal('Tulpar', buildCommand(mode, doc.fileName, out));
  });

  context.subscriptions.push(
    cmd('tulpar.runFile', 'run'),
    cmd('tulpar.runVM', 'vm'),
    cmd('tulpar.buildAOT', 'aot-build'),
    cmd('tulpar.runAOT', 'aot-run'),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tulpar.runRepl', () => {
      runInTerminal('Tulpar REPL', buildCommand('repl', '', ''));
    })
  );

  // `tulpar.checkFile` used to trigger a manual `tulpar build` and parse
  // stderr. With the LSP server in charge, every keystroke already
  // re-validates; the command is kept as a "force re-check" by saving the
  // active document, which the server picks up via didSave.
  context.subscriptions.push(
    vscode.commands.registerCommand('tulpar.checkFile', async () => {
      const doc = await activeTulparDoc();
      if (!doc) return;
      // didSave is sent automatically by the language client on save.
    })
  );

  // ---- Debugger ----
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      'tulpar', new TulparDebugAdapterFactory()),
    vscode.commands.registerCommand('tulpar.debug', debugActiveFile),
  );

  // ---- Status bar: Run + Build buttons ----
  const runItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 102);
  runItem.command = 'tulpar.runFile';
  runItem.text = '$(play) Tulpar Run';
  runItem.tooltip = 'Run current Tulpar file (default mode)';

  const buildItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
  buildItem.command = 'tulpar.buildAOT';
  buildItem.text = '$(package) Tulpar Build';
  buildItem.tooltip = 'Compile current Tulpar file to a native executable (AOT)';

  const updateStatusBar = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === LANGUAGE_ID) {
      runItem.show();
      buildItem.show();
    } else {
      runItem.hide();
      buildItem.hide();
    }
  };
  updateStatusBar();
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
    vscode.workspace.onDidOpenTextDocument(updateStatusBar),
    runItem,
    buildItem
  );
}

function deactivate() {
  return stopLanguageClient();
}

module.exports = { activate, deactivate };
