const vscode = require('vscode');
const path = require('path');

// OLang anahtar kelimeleri ve built-in fonksiyonlar
const KEYWORDS = ['if', 'else', 'for', 'while', 'func', 'return', 'break', 'continue', 'in'];
const TYPES = ['int', 'float', 'str', 'bool', 'array', 'arrayInt', 'arrayFloat', 'arrayStr', 'arrayBool', 'arrayJson'];
const BUILTIN_FUNCTIONS = [
  { name: 'print', description: 'Konsola çıktı yazdırır', params: '(...values)' },
  { name: 'input', description: 'Kullanıcıdan string girişi alır', params: '(prompt: str)' },
  { name: 'inputInt', description: 'Kullanıcıdan integer girişi alır', params: '(prompt: str)' },
  { name: 'inputFloat', description: 'Kullanıcıdan float girişi alır', params: '(prompt: str)' },
  { name: 'length', description: 'Dizi veya string uzunluğunu döner', params: '(array/str)' },
  { name: 'push', description: 'Diziye eleman ekler', params: '(array, value)' },
  { name: 'pop', description: 'Diziden son elemanı çıkarır', params: '(array)' },
  { name: 'range', description: 'Belirtilen aralıkta sayı dizisi oluşturur', params: '(start, end)' },
  { name: 'toInt', description: 'Değeri integer\'a çevirir', params: '(value)' },
  { name: 'toFloat', description: 'Değeri float\'a çevirir', params: '(value)' },
  { name: 'toString', description: 'Değeri string\'e çevirir', params: '(value)' },
  { name: 'toBool', description: 'Değeri boolean\'a çevirir', params: '(value)' }
];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('OLang extension activated');

  // 1. Run Command
  const runDisposable = vscode.commands.registerCommand('olang.runFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor with an Olang file.');
      return;
    }

    const doc = editor.document;
    if (doc.languageId !== 'olang') {
      vscode.window.showErrorMessage('Active file is not an Olang file.');
      return;
    }

    await doc.save();

    const config = vscode.workspace.getConfiguration('olang');
    const defaultCmd = config.get('runCommand') || 'olang run ${file}';
    const filePath = doc.fileName;
    const cmd = defaultCmd.replace('${file}', '"' + filePath + '"');

    const terminal = vscode.window.createTerminal({ name: 'Olang Run' });
    terminal.show(true);
    terminal.sendText(cmd);
  });

  // 2. IntelliSense (Completion Provider)
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'olang',
    {
      provideCompletionItems(document, position, token, context) {
        const completions = [];

        // Anahtar kelimeler
        KEYWORDS.forEach(keyword => {
          const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
          item.detail = 'OLang keyword';
          completions.push(item);
        });

        // Tipler
        TYPES.forEach(type => {
          const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
          item.detail = 'OLang type';
          completions.push(item);
        });

        // Built-in fonksiyonlar
        BUILTIN_FUNCTIONS.forEach(func => {
          const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
          item.detail = func.params;
          item.documentation = new vscode.MarkdownString(func.description);
          item.insertText = new vscode.SnippetString(`${func.name}($1)$0`);
          completions.push(item);
        });

        // Dosyadaki fonksiyonları tespit et
        const text = document.getText();
        const funcRegex = /func\s+(\w+)\s*\((.*?)\)/g;
        let match;
        while ((match = funcRegex.exec(text)) !== null) {
          const funcName = match[1];
          const params = match[2];
          const item = new vscode.CompletionItem(funcName, vscode.CompletionItemKind.Function);
          item.detail = `(${params})`;
          item.documentation = 'User-defined function';
          completions.push(item);
        }

        // Dosyadaki değişkenleri tespit et
        const varRegex = /(int|float|str|bool|array\w*)\s+(\w+)\s*=/g;
        while ((match = varRegex.exec(text)) !== null) {
          const varType = match[1];
          const varName = match[2];
          const item = new vscode.CompletionItem(varName, vscode.CompletionItemKind.Variable);
          item.detail = varType;
          item.documentation = 'Variable';
          completions.push(item);
        }

        return completions;
      }
    }
  );

  // 3. Hover Provider
  const hoverProvider = vscode.languages.registerHoverProvider('olang', {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);

      // Built-in fonksiyonlar için hover
      const builtinFunc = BUILTIN_FUNCTIONS.find(f => f.name === word);
      if (builtinFunc) {
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(`${builtinFunc.name}${builtinFunc.params}`, 'olang');
        markdown.appendMarkdown(`\n\n${builtinFunc.description}`);
        return new vscode.Hover(markdown);
      }

      // Anahtar kelimeler için hover
      if (KEYWORDS.includes(word)) {
        return new vscode.Hover(`**OLang Keyword:** \`${word}\``);
      }

      // Tipler için hover
      if (TYPES.includes(word)) {
        return new vscode.Hover(`**OLang Type:** \`${word}\``);
      }

      // Kullanıcı tanımlı fonksiyonlar
      const text = document.getText();
      const funcRegex = new RegExp(`func\\s+${word}\\s*\\(([^)]*)\\)`, 'g');
      const funcMatch = funcRegex.exec(text);
      if (funcMatch) {
        const params = funcMatch[1];
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(`func ${word}(${params})`, 'olang');
        markdown.appendMarkdown('\n\n*User-defined function*');
        return new vscode.Hover(markdown);
      }

      // Değişkenler
      const varRegex = new RegExp(`(int|float|str|bool|array\\w*)\\s+${word}\\s*=`, 'g');
      const varMatch = varRegex.exec(text);
      if (varMatch) {
        const varType = varMatch[1];
        return new vscode.Hover(`**Variable:** \`${varType} ${word}\``);
      }

      return null;
    }
  });

  // 4. Diagnostics (Hata Gösterme)
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('olang');
  
  function updateDiagnostics(document) {
    if (document.languageId !== 'olang') {
      return;
    }

    const diagnostics = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Değişken ve tip bilgilerini topla
    const variables = new Map(); // {name: {type, line, used}}
    const functions = new Map(); // {name: {params, line, used}}

    // Önce tüm tanımlamaları topla
    lines.forEach((line, lineIndex) => {
      // Değişken tanımlamalarını bul
      const varRegex = /(int|float|str|bool|array\w*)\s+(\w+)\s*=/g;
      let match;
      while ((match = varRegex.exec(line)) !== null) {
        const varType = match[1];
        const varName = match[2];
        if (!variables.has(varName)) {
          variables.set(varName, { type: varType, line: lineIndex, used: false });
        }
      }

      // Fonksiyon tanımlamalarını bul
      const funcRegex = /func\s+(\w+)\s*\((.*?)\)/g;
      while ((match = funcRegex.exec(line)) !== null) {
        const funcName = match[1];
        const params = match[2];
        functions.set(funcName, { params, line: lineIndex, used: false });
      }
    });

    // Kullanımları işaretle
    lines.forEach((line, lineIndex) => {
      // Değişken kullanımlarını kontrol et
      variables.forEach((info, varName) => {
        // Tanımlama satırı dışında geçiyorsa "kullanılmış" say
        if (lineIndex !== info.line && line.includes(varName)) {
          // Gerçekten kullanım mı yoksa sadece yorum mu?
          const trimmed = line.trim();
          if (!trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
            info.used = true;
          }
        }
      });

      // Fonksiyon kullanımlarını kontrol et
      functions.forEach((info, funcName) => {
        if (lineIndex !== info.line && new RegExp(`${funcName}\\s*\\(`).test(line)) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
            info.used = true;
          }
        }
      });
    });

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      
      // Yorum satırlarını atla
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        return;
      }

      // 1. Noktalı virgül kontrolü
      if (trimmed && !trimmed.endsWith('{') && !trimmed.endsWith('}') && 
          !trimmed.startsWith('}') && !trimmed.endsWith('*/')) {
        // Statement türlerini kontrol et
        if (/^(int|float|str|bool|array\w*)\s+\w+\s*=/.test(trimmed) ||
            /^(return|break|continue)\b/.test(trimmed)) {
          if (!trimmed.endsWith(';')) {
            const diagnostic = new vscode.Diagnostic(
              new vscode.Range(lineIndex, line.length - 1, lineIndex, line.length),
              'Statement should end with semicolon (;)',
              vscode.DiagnosticSeverity.Warning
            );
            diagnostic.code = 'missing-semicolon';
            diagnostics.push(diagnostic);
          }
        }
      }

      // 2. Tip kontrolü - String'e sayı atama
      const stringAssignRegex = /str\s+(\w+)\s*=\s*(-?\d+\.?\d*)\s*;?/;
      let match = stringAssignRegex.exec(trimmed);
      if (match) {
        const varName = match[1];
        const value = match[2];
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          `Type mismatch: Cannot assign number '${value}' to string variable '${varName}'`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.code = 'type-mismatch';
        diagnostics.push(diagnostic);
      }

      // 3. Tip kontrolü - Int'e string atama
      const intStringRegex = /int\s+(\w+)\s*=\s*["'](.+?)["']\s*;?/;
      match = intStringRegex.exec(trimmed);
      if (match) {
        const varName = match[1];
        const value = match[2];
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          `Type mismatch: Cannot assign string "${value}" to int variable '${varName}'`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.code = 'type-mismatch';
        diagnostics.push(diagnostic);
      }

      // 4. Tip kontrolü - Bool'a yanlış değer atama
      const boolRegex = /bool\s+(\w+)\s*=\s*([^;\n]+);?/;
      match = boolRegex.exec(trimmed);
      if (match) {
        const varName = match[1];
        const value = match[2].trim();
        // true, false, veya boolean expression değilse hata
        if (!['true', 'false'].includes(value) && 
            !/[<>!=]=?/.test(value) && 
            !/^\d+$/.test(value) &&
            !value.includes('(')) {
          const diagnostic = new vscode.Diagnostic(
            new vscode.Range(lineIndex, 0, lineIndex, line.length),
            `Type mismatch: '${value}' is not a valid boolean value. Use 'true' or 'false'`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.code = 'type-mismatch';
          diagnostics.push(diagnostic);
        }
      }

      // 5. Array tip kontrolü
      const arrayIntRegex = /arrayInt\s+(\w+)\s*=\s*\[(.*?)\]\s*;?/;
      match = arrayIntRegex.exec(trimmed);
      if (match) {
        const varName = match[1];
        const elements = match[2];
        // String elemanları içeriyorsa hata
        if (elements.includes('"') || elements.includes("'")) {
          const diagnostic = new vscode.Diagnostic(
            new vscode.Range(lineIndex, 0, lineIndex, line.length),
            `Type mismatch: arrayInt '${varName}' cannot contain string values`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.code = 'array-type-mismatch';
          diagnostics.push(diagnostic);
        }
      }

      const arrayStrRegex = /arrayStr\s+(\w+)\s*=\s*\[(.*?)\]\s*;?/;
      match = arrayStrRegex.exec(trimmed);
      if (match) {
        const varName = match[1];
        const elements = match[2].trim();
        // Eleman varsa ve string değilse hata
        if (elements && !elements.includes('"') && !elements.includes("'")) {
          const diagnostic = new vscode.Diagnostic(
            new vscode.Range(lineIndex, 0, lineIndex, line.length),
            `Type mismatch: arrayStr '${varName}' should contain string values in quotes`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.code = 'array-type-mismatch';
          diagnostics.push(diagnostic);
        }
      }

      // 6. Tanımlanmamış fonksiyon çağrısı
      const funcCallRegex = /(\w+)\s*\(/g;
      while ((match = funcCallRegex.exec(line)) !== null) {
        const funcName = match[1];
        // Built-in veya anahtar kelime değilse ve tanımlı değilse
        if (!BUILTIN_FUNCTIONS.some(f => f.name === funcName) && 
            !KEYWORDS.includes(funcName) &&
            !functions.has(funcName)) {
          const startPos = match.index;
          const diagnostic = new vscode.Diagnostic(
            new vscode.Range(lineIndex, startPos, lineIndex, startPos + funcName.length),
            `Function '${funcName}' is not defined`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.code = 'undefined-function';
          diagnostics.push(diagnostic);
        }
      }
    });

    // 7. Kullanılmayan değişken uyarıları
    variables.forEach((info, varName) => {
      if (!info.used) {
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(info.line, 0, info.line, lines[info.line].length),
          `Variable '${varName}' is declared but never used`,
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.code = 'unused-variable';
        diagnostic.tags = [vscode.DiagnosticTag.Unnecessary];
        diagnostics.push(diagnostic);
      }
    });

    // 8. Kullanılmayan fonksiyon uyarıları
    functions.forEach((info, funcName) => {
      if (!info.used) {
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(info.line, 0, info.line, lines[info.line].length),
          `Function '${funcName}' is declared but never used`,
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.code = 'unused-function';
        diagnostic.tags = [vscode.DiagnosticTag.Unnecessary];
        diagnostics.push(diagnostic);
      }
    });

    diagnosticCollection.set(document.uri, diagnostics);
  }

  // Dosya değiştiğinde diagnostics güncelle
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === 'olang') {
        updateDiagnostics(e.document);
      }
    })
  );

  // Dosya açıldığında diagnostics güncelle
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.languageId === 'olang') {
        updateDiagnostics(doc);
      }
    })
  );

  // Mevcut editörü kontrol et
  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document);
  }

  context.subscriptions.push(
    runDisposable,
    completionProvider,
    hoverProvider,
    diagnosticCollection
  );
}

function deactivate() {
  console.log('OLang extension deactivated');
}

module.exports = { activate, deactivate };
