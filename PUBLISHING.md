# Tulpar VS Code Extension - Publishing Guide

Bu rehber, Tulpar VS Code eklentisini VS Code Marketplace ve Open VSX Registry'de yayınlamak için adım adım talimatlar içerir.

## Ön Hazırlık

### 1. Gerekli Araçların Kurulumu

#### VS Code Extension Manager (vsce)
```bash
npm install -g @vscode/vsce
```

#### Open VSX CLI (ovsx)
```bash
npm install -g ovsx
```

### 2. Hesap Oluşturma

#### VS Code Marketplace
1. [Visual Studio Marketplace Publisher Portal](https://marketplace.visualstudio.com/manage) adresine git
2. Microsoft hesabınla giriş yap
3. "Create Publisher" butonuna tıkla
4. Publisher ID: `hamer1818` (package.json'da zaten var)
5. Publisher adı ve açıklama gir
6. Onayla

#### Open VSX Registry
1. [Open VSX Registry](https://open-vsx.org/) adresine git
2. Sağ üstteki "Login" butonuna tıkla
3. GitHub hesabınla giriş yap
4. "Create Publisher" seçeneğini kullan
5. Publisher namespace: `hamer1818`

## Yayınlama Adımları

### Adım 1: package.json Kontrolü ve Güncelleme

`package.json` dosyasında şu alanların dolu olduğundan emin ol:

- ✅ `name`: "vscode-tulpar" (zaten var)
- ✅ `displayName`: "Tulpar" (zaten var)
- ✅ `publisher`: "hamer1818" (zaten var)
- ✅ `version`: Güncel versiyon numarası
- ✅ `description`: Kısa açıklama (zaten var)
- ✅ `repository`: GitHub repo URL'i (zaten var)
- ✅ `icon`: Icon dosyası (tulpar.webp - zaten var)
- ✅ `license`: LICENSE dosyası var mı kontrol et

**Eklenecek alanlar:**

```json
{
  "categories": ["Programming Languages", "Snippets"],
  "keywords": ["tulpar", "programming", "language", "syntax", "highlighting"],
  "homepage": "https://github.com/hamer1818/TulparLang-ext",
  "bugs": {
    "url": "https://github.com/hamer1818/TulparLang-ext/issues"
  },
  "license": "MIT"
}
```

### Adım 2: CHANGELOG.md Güncelleme

Yeni özellikler için CHANGELOG.md'yi güncelle:

```markdown
## [0.0.3] - 2026-01-27

### ✨ Added
- **bigint and json types**: Added syntax highlighting for `bigint` and `json` types
- **New snippets**: Type definitions, try-catch-finally, JSON literals, threading, HTTP routes, database operations
- **Status bar integration**: Quick run button in status bar
- **Enhanced built-in functions**: Added missing functions (file_read, file_write, file_delete, timestamp, time_ms, clock_ms, db_execute)
- **HTTP/Wings API functions**: Added syntax highlighting for Wings and TulparAPI functions

### 🎨 Improved
- Updated run command default to `tulpar ${file}` (VM mode)
- Enhanced README with feature coverage section
- Better documentation and examples

### 📚 Documentation
- README updated with comprehensive feature list
- Added links to Tulpar language examples
```

### Adım 3: README.md Kontrolü

README.md'nin şunları içerdiğinden emin ol:
- ✅ Açıklayıcı başlık ve açıklama
- ✅ Özellikler listesi
- ✅ Kullanım talimatları
- ✅ Konfigürasyon örnekleri
- ✅ Snippet listesi
- ✅ Örnekler ve linkler

### Adım 4: .vscodeignore Kontrolü

`.vscodeignore` dosyasında şunların olduğundan emin ol:
- `.vscode/**`
- `.git`
- `node_modules/**`
- `*.vsix`
- Test dosyaları (opsiyonel)

### Adım 5: VSIX Paketi Oluşturma

```bash
cd d:\yazilim\tulpar-ext
vsce package
```

Bu komut `vscode-tulpar-0.0.3.vsix` gibi bir dosya oluşturur.

### Adım 6: VS Code Marketplace'e Yayınlama

#### İlk Yayınlama:
```bash
vsce publish
```

Bu komut:
1. package.json'u doğrular
2. VSIX paketi oluşturur
3. VS Code Marketplace'e yükler
4. Yayınlar

**Not:** İlk yayınlamada Microsoft hesabınla giriş yapman istenecek.

#### Sonraki Güncellemeler:
```bash
# Versiyonu package.json'da artır (örn: 0.0.2 → 0.0.3)
# CHANGELOG.md'yi güncelle
vsce publish
```

### Adım 7: Open VSX Registry'ye Yayınlama

#### İlk Yayınlama:
```bash
ovsx publish vscode-tulpar-0.0.3.vsix
```

Bu komut:
1. Open VSX'e giriş yapmanı ister (GitHub OAuth)
2. VSIX paketini yükler
3. Yayınlar

#### Sonraki Güncellemeler:
```bash
# Versiyonu artır
vsce package
ovsx publish vscode-tulpar-0.0.X.vsix
```

## Versiyonlama Stratejisi

Semantic Versioning (SemVer) kullan:
- **MAJOR.MINOR.PATCH** (örn: 1.2.3)
- **MAJOR**: Geriye dönük uyumsuz değişiklikler
- **MINOR**: Yeni özellikler (geriye dönük uyumlu)
- **PATCH**: Hata düzeltmeleri

Örnek:
- `0.0.2` → `0.0.3` (yeni snippet'ler, küçük iyileştirmeler)
- `0.0.3` → `0.1.0` (büyük özellik ekleme)
- `0.1.0` → `1.0.0` (ilk stabil sürüm)

## Yayınlama Sonrası Kontrol

### VS Code Marketplace
1. [Marketplace sayfanı](https://marketplace.visualstudio.com/items?itemName=hamer1818.tulpar) kontrol et
2. Eklenti doğru görünüyor mu?
3. README render edilmiş mi?
4. Icon görünüyor mu?
5. Versiyon numarası doğru mu?

### Open VSX Registry
1. [Open VSX sayfanı](https://open-vsx.org/extension/hamer1818/tulpar) kontrol et
2. Tüm bilgiler doğru mu?
3. İndirme sayısı görünüyor mu?

## Sorun Giderme

### "Publisher not found" Hatası
- VS Code Marketplace'te publisher hesabı oluşturduğundan emin ol
- Publisher ID'nin package.json'dakiyle aynı olduğunu kontrol et

### "Invalid Personal Access Token" Hatası
- Open VSX için GitHub token'ının geçerli olduğundan emin ol
- Token'ın gerekli izinlere sahip olduğunu kontrol et

### VSIX Paketi Çok Büyük
- `.vscodeignore` dosyasını kontrol et
- Gereksiz dosyaları ekle
- `node_modules` klasörünün ignore edildiğinden emin ol

### Versiyon Hatası
- package.json'daki versiyonun önceki versiyondan büyük olduğundan emin ol
- CHANGELOG.md'de versiyon notlarını ekle

## Otomatik Yayınlama (GitHub Actions) - İsteğe Bağlı

GitHub Actions ile otomatik yayınlama için `.github/workflows/publish.yml` oluşturabilirsin:

```yaml
name: Publish Extension

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @vscode/vsce
      - run: vsce package
      - run: vsce publish -p ${{ secrets.VSCE_PAT }}
      - run: npm install -g ovsx
      - run: ovsx publish *.vsix -p ${{ secrets.OPEN_VSX_TOKEN }}
```

## Önemli Notlar

1. **Personal Access Token (PAT)**: 
   - VS Code Marketplace için: [Azure DevOps](https://dev.azure.com) → Personal Access Tokens
   - Open VSX için: GitHub Personal Access Token

2. **İlk Yayınlama**: 
   - Marketplace'te onay süreci 1-2 gün sürebilir
   - Open VSX genellikle anında yayınlanır

3. **Güncellemeler**:
   - Her güncellemede versiyon numarasını artır
   - CHANGELOG.md'yi güncelle
   - Önemli değişiklikleri README'de belirt

4. **Test**:
   - Yayınlamadan önce VSIX paketini lokal olarak test et:
   ```bash
   code --install-extension vscode-tulpar-0.0.3.vsix
   ```

## Hızlı Başlangıç Komutları

```bash
# 1. Versiyonu artır (package.json'da manuel)
# 2. CHANGELOG.md güncelle
# 3. VSIX oluştur
vsce package

# 4. VS Code Marketplace'e yayınla
vsce publish

# 5. Open VSX'e yayınla
ovsx publish *.vsix
```

## İletişim ve Destek

- **GitHub Issues**: https://github.com/hamer1818/TulparLang-ext/issues
- **Repository**: https://github.com/hamer1818/TulparLang-ext
