const vscode = require('vscode');
const path = require('path');

// OLang anahtar kelimeleri ve built-in fonksiyonlar
const KEYWORDS = ['if', 'else', 'for', 'while', 'func', 'return', 'break', 'continue', 'in'];
const TYPES = ['int', 'float', 'str', 'bool', 'array', 'arrayInt', 'arrayFloat', 'arrayStr', 'arrayBool', 'arrayJson'];
const BUILTIN_FUNCTIONS = [
  // I/O Fonksiyonları
  { name: 'print', description: 'Konsola çıktı yazdırır', params: '(...values)' },
  { name: 'input', description: 'Kullanıcıdan string girişi alır', params: '(prompt: str)' },
  { name: 'inputInt', description: 'Kullanıcıdan integer girişi alır', params: '(prompt: str)' },
  { name: 'inputFloat', description: 'Kullanıcıdan float girişi alır', params: '(prompt: str)' },
  
  // Dizi Fonksiyonları
  { name: 'length', description: 'Dizi veya string uzunluğunu döner', params: '(array/str)' },
  { name: 'push', description: 'Diziye eleman ekler', params: '(array, value)' },
  { name: 'pop', description: 'Diziden son elemanı çıkarır', params: '(array)' },
  { name: 'range', description: 'Belirtilen aralıkta sayı dizisi oluşturur', params: '(start, end)' },
  
  // Tip Dönüşüm Fonksiyonları
  { name: 'toInt', description: 'Değeri integer\'a çevirir', params: '(value)' },
  { name: 'toFloat', description: 'Değeri float\'a çevirir', params: '(value)' },
  { name: 'toString', description: 'Değeri string\'e çevirir', params: '(value)' },
  { name: 'toBool', description: 'Değeri boolean\'a çevirir', params: '(value)' },
  
  // Temel Matematik Fonksiyonları
  { name: 'abs', description: 'Mutlak değer alır', params: '(x: float)' },
  { name: 'sqrt', description: 'Karekök hesaplar', params: '(x: float)' },
  { name: 'cbrt', description: 'Küp kök hesaplar', params: '(x: float)' },
  { name: 'pow', description: 'Üs alma (x^y)', params: '(x: float, y: float)' },
  { name: 'hypot', description: 'Hipotenüs hesaplar √(x²+y²)', params: '(x: float, y: float)' },
  
  // Yuvarlama Fonksiyonları
  { name: 'floor', description: 'Aşağı yuvarlar', params: '(x: float)' },
  { name: 'ceil', description: 'Yukarı yuvarlar', params: '(x: float)' },
  { name: 'round', description: 'En yakın tamsayıya yuvarlar', params: '(x: float)' },
  { name: 'trunc', description: 'Ondalık kısmı atar', params: '(x: float)' },
  
  // Trigonometri Fonksiyonları
  { name: 'sin', description: 'Sinüs hesaplar (radyan)', params: '(x: float)' },
  { name: 'cos', description: 'Kosinüs hesaplar (radyan)', params: '(x: float)' },
  { name: 'tan', description: 'Tanjant hesaplar (radyan)', params: '(x: float)' },
  { name: 'asin', description: 'Arksinüs hesaplar', params: '(x: float)' },
  { name: 'acos', description: 'Arkkosinüs hesaplar', params: '(x: float)' },
  { name: 'atan', description: 'Arktanjant hesaplar', params: '(x: float)' },
  { name: 'atan2', description: 'İki değişkenli arktanjant', params: '(y: float, x: float)' },
  
  // Hiperbolik Fonksiyonlar
  { name: 'sinh', description: 'Hiperbolik sinüs', params: '(x: float)' },
  { name: 'cosh', description: 'Hiperbolik kosinüs', params: '(x: float)' },
  { name: 'tanh', description: 'Hiperbolik tanjant', params: '(x: float)' },
  
  // Logaritma ve Üstel Fonksiyonlar
  { name: 'exp', description: 'e üzeri x (e^x)', params: '(x: float)' },
  { name: 'log', description: 'Doğal logaritma (ln)', params: '(x: float)' },
  { name: 'log10', description: '10 tabanlı logaritma', params: '(x: float)' },
  { name: 'log2', description: '2 tabanlı logaritma', params: '(x: float)' },
  
  // İstatistik Fonksiyonları
  { name: 'min', description: 'En küçük değeri bulur', params: '(...values)' },
  { name: 'max', description: 'En büyük değeri bulur', params: '(...values)' },
  
  // Rastgele Sayı Fonksiyonları
  { name: 'random', description: '0 ile 1 arası rastgele sayı', params: '()' },
  { name: 'randint', description: 'Belirtilen aralıkta rastgele tamsayı', params: '(min: int, max: int)' },
  
  // Diğer Matematik Fonksiyonları
  { name: 'fmod', description: 'Kayan noktalı modulo', params: '(x: float, y: float)' }
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

    // Dizi ve JSON object tanımlaması takibi için (çok satırlı yapıları tespit etmek için)
    let insideArrayDefinition = false;
    let arrayBracketCount = 0;
    let insideObjectDefinition = false;
    let objectBraceCount = 0;
    let objectStartLine = -1;

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      
      // Yorum satırlarını atla
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        return;
      }

      // Çok satırlı dizi tanımlaması kontrolü
      // Açılış ve kapanış parantezlerini say
      const openBrackets = (trimmed.match(/\[/g) || []).length;
      const closeBrackets = (trimmed.match(/\]/g) || []).length;
      arrayBracketCount += openBrackets - closeBrackets;
      
      // Eğer parantez açıksa, dizi tanımlaması içindeyiz
      insideArrayDefinition = arrayBracketCount > 0;

      // Çok satırlı JSON object tanımlaması kontrolü
      // arrayJson veya object başlangıcını tespit et
      if (/^(arrayJson|array)\s+\w+\s*=\s*\{/.test(trimmed)) {
        insideObjectDefinition = true;
        objectStartLine = lineIndex;
        objectBraceCount = 0;
      }
      
      // Süslü parantezleri say
      if (insideObjectDefinition) {
        const openBraces = (trimmed.match(/\{/g) || []).length;
        const closeBraces = (trimmed.match(/\}/g) || []).length;
        objectBraceCount += openBraces - closeBraces;
        
        // Tüm süslü parantezler kapandı mı?
        if (objectBraceCount === 0 && trimmed.includes('}')) {
          // Object tanımı burada bitiyor, noktalı virgül kontrolü yap
          if (!trimmed.endsWith(';') && !trimmed.endsWith(';)')) {
            const diagnostic = new vscode.Diagnostic(
              new vscode.Range(lineIndex, line.length - 1, lineIndex, line.length),
              'JSON object definition should end with semicolon (;)',
              vscode.DiagnosticSeverity.Warning
            );
            diagnostic.code = 'missing-semicolon-object';
            diagnostics.push(diagnostic);
          }
          insideObjectDefinition = false;
          objectStartLine = -1;
        }
      }

      // 1. Noktalı virgül kontrolü
      if (trimmed && !trimmed.endsWith('{') && !trimmed.endsWith('}') && 
          !trimmed.startsWith('}') && !trimmed.endsWith('*/') && 
          !insideArrayDefinition && !insideObjectDefinition) {  // Dizi veya object tanımlaması içinde değilse
        // Statement türlerini kontrol et
        if (/^(int|float|str|bool|array\w*)\s+\w+\s*=/.test(trimmed) ||
            /^(return|break|continue)\b/.test(trimmed)) {
          // Satır sonundaki yorumları kaldırarak kontrol et
          let codeOnly = trimmed;
          // Satır içi yorum varsa (//) yorumdan önceki kısmı al
          const commentIndex = codeOnly.indexOf('//');
          if (commentIndex !== -1) {
            codeOnly = codeOnly.substring(0, commentIndex).trim();
          }
          
          // Noktalı virgül kontrolü (yorum kaldırıldıktan sonra)
          if (!codeOnly.endsWith(';')) {
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
      // NOT: arrayJson[index] gibi dizi erişimlerini atla (karışık tip içerebilir)
      const stringAssignRegex = /str\s+(\w+)\s*=\s*(-?\d+\.?\d*)\s*;?/;
      let match = stringAssignRegex.exec(trimmed);
      if (match && !trimmed.includes('[')) {  // Dizi erişimi değilse kontrol et
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
      if (match && !trimmed.includes('[')) {  // Dizi erişimi değilse kontrol et
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
      if (match && !trimmed.includes('[')) {  // Dizi erişimi değilse kontrol et
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
      // Önce string literallerini ve yorumları temizle
      let cleanedLine = trimmed;
      
      // Satır sonu yorumunu kaldır (//)
      const commentIndex = cleanedLine.indexOf('//');
      if (commentIndex !== -1) {
        cleanedLine = cleanedLine.substring(0, commentIndex).trim();
      }
      
      // String literalleri kaldır (içindeki parantezli metinler hata vermesin)
      cleanedLine = cleanedLine.replace(/"[^"]*"/g, '""');  // Çift tırnak içindekiler
      cleanedLine = cleanedLine.replace(/'[^']*'/g, "''");  // Tek tırnak içindekiler
      
      const funcCallRegex = /(\w+)\s*\(/g;
      let match2;
      while ((match2 = funcCallRegex.exec(cleanedLine)) !== null) {
        const funcName = match2[1];
        // Built-in veya anahtar kelime değilse ve tanımlı değilse
        if (!BUILTIN_FUNCTIONS.some(f => f.name === funcName) && 
            !KEYWORDS.includes(funcName) &&
            !functions.has(funcName)) {
          const startPos = match2.index;
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
