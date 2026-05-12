# Change Log

All notable changes to the "vscode-Tulpar" extension will be documented in this file.

## [0.4.0] - 2026-05-12

### ✨ Added — Debugger integration (Plan 07 Part B)

- **`Tulpar: Debug File`** komutu + status bar / editor toolbar entry
  (`$(debug-alt)` icon). Aktif `.tpr` dosyasını `tulpar debug` DAP
  server'ı üzerinden başlatır.
- **`launch.json` desteği** (`type: "tulpar"`). F5 ile debugging,
  per-line breakpoint, gdb backed step / inspection.
  - `initialConfigurations` ve `configurationSnippets` ile VS Code
    "Add Configuration..." flow'u Tulpar entry'sini öneriyor.
  - `contributes.breakpoints` ile `.tpr` dosyalarına gutter
    breakpoint koyulabiliyor.
- **`DebugAdapterDescriptorFactory`** Tulpar derleyicisini
  (`tulpar.executablePath`) `tulpar debug <program>` olarak spawn
  eder; stdio DAP protokolü üzerinden VS Code'un Run and Debug
  paneliyle konuşur.
- Çalışma için Tulpar tarafında `tulpar debug` (TulparLang #178, #180,
  #186, #188) + gdb yüklü olmalı.

## [0.3.0] - 2026-05-02

### ✨ Added — Snippets

- **`twingsa`** — multi-threaded Wings server (`listen_async`)
- **`topenapi`** — auto-generated OpenAPI 3.0 doc from registered routes
- **`tloginfo` / `tlogerror`** — Wings structured JSON logger
- **`thttpget` / `thttppost`** — outbound HTTP client (with optional JSON parse)
- **`torm`** — Active-Record style mini-ORM over SQLite
- **`tnow`** — `now_iso8601()` UTC timestamp
- **`trxc`** — `regex_capture` skeleton with `[whole, g1, g2, …]` array unpacking
- **`tcsv`** — RFC 4180 CSV parse loop
- **`tglob`** — shell-style file glob enumeration
- **`tpkgdep`** — `tulpar.toml` `[dependencies]` line
- **`tarena`** — per-request arena scope (`arena_save` / `arena_restore`)

### 🎨 Improved — Grammar

- 60+ new builtins highlighted: `regex_*`, `csv_*`, `file_glob`, `keys`,
  `now_iso8601` / `format_iso8601` / `parse_iso8601` / `weekday` /
  `date_add_seconds`, `arena_save` / `arena_restore`, `env`, `mod`,
  `http_request` / `http_get` / `http_post` / `http_put` / `http_delete` /
  `http_get_json` / `http_post_json` / `http_should_keepalive` /
  `http_recv_request`, `wings_openapi` / `wings_metrics_prom` /
  `log_info` / `log_error`, `listen_async`, `orm_open` / `orm_close` /
  `define_model` / `orm_create` / `orm_find` / `orm_all` / `orm_where` /
  `orm_update` / `orm_delete`, `thread_detach`.
- Built-in lib modules consumable via `import "..."`: `wings`, `router`,
  `http_utils`, `async`, `middleware`, `socket`, `tulpar_api`, `test`,
  `http_client`, `orm`.

### 📚 Documentation

- README: outline of the new ecosystem surface (paket yöneticisi,
  `http_client`, ORM, OpenAPI, Prometheus metrics, async server).

## [0.2.0] - 2026-04-30

### ✨ Added

- **Language Server Protocol (LSP) entegrasyonu**
  - Eklenti artık `tulpar --lsp` modunu spawn edip standart LSP protokolü
    üzerinden konuşuyor. Diagnostics, dosya kaydedilmesini beklemeden her
    keystroke'ta `textDocument/didChange` ile yenileniyor.
  - Önceki regex tabanlı stderr scraping (`HATA (Satır N): ...` parse'ı)
    tamamen kaldırıldı; mesajlar artık structured `range` + `severity` ile
    geliyor, did-you-mean ipucu da diagnostic mesajının altında görünür.
  - `tulpar.executablePath` veya `tulpar.diagnostics.enabled` değiştiğinde
    LSP otomatik yeniden başlar — pencere reload'ı gerekmez.
  - Sonraki sürümlerde (server tarafı eklendikçe) hover, completion,
    go-to-definition, rename de sıfır eklenti değişikliğiyle eklenecek.

### 🧹 Removed

- Eski `parseDiagnostics` + `ERR_REGEXES` blokları (artık LSP).

## [0.1.0] - 2026-04-29

### ✨ Added

- **Inline diagnostics (Problems panel)**
  - Tulpar derleyicisinin `HATA (Satır N): ...`, `Ayristirma hatasi: ... at line N`,
    `Atamada tanimsiz degisken: ...` formatındaki çıktısı parse edilip VS Code'un
    Problems paneline yansıtıldı.
  - Dosya kaydedildiğinde otomatik kontrol (`tulpar.diagnostics.runOnSave`).
  - Manuel kontrol için **Tulpar: Check File (Diagnostics)** komutu.
- **Yeni komutlar (her biri ayrı durumlu terminal kullanır)**
  - **Tulpar: Run File** — varsayılan (silent AOT + VM fallback).
  - **Tulpar: Run with VM** — `tulpar --vm <file>`.
  - **Tulpar: Build (AOT)** — standalone executable üretir (`tulpar build <file>`).
  - **Tulpar: Build & Run (AOT)** — `tulpar --aot <file>`.
  - **Tulpar: Open REPL** — `tulpar --repl`.
- **İki status bar düğmesi:** `▶ Tulpar Run` ve `📦 Tulpar Build`.
- **Yeni snippet'ler**
  - `tfunci` — Tulpar'ın native AOT path'ini tetikleyen typed-return fonksiyonu (`func name(...): int { ... }`).
  - `trouter` — `lib/router.tpr` ile basit GET endpoint.
  - `tapi` — FastAPI-style `lib/tulpar_api.tpr` iskeleti.
  - `tsocket` — TCP socket server iskeleti.
  - `tasync`, `tmw` — async + middleware blokları.
  - `tjsonarr`, `tforin`, `twhile`, `tifelse`, `tp`, `tps`.
- **Genişletilmiş yapılandırma**
  - `tulpar.executablePath` — derleyicinin yolu (PATH'te değilse).
  - `tulpar.diagnostics.enabled` / `tulpar.diagnostics.runOnSave`.
  - `tulpar.aot.outputName` — AOT build'in varsayılan çıktı adı.
  - `tulpar.runCommand` opsiyonel olarak korundu (boşsa varsayılan kullanılır).

### 🎨 Improved

- **Grammar yenilendi**
  - `func name(...): int { ... }` typed-return sözdizimi vurgulanıyor (Tulpar'ın
    yeni native codegen yolu için kritik).
  - Function declaration adı `entity.name.function`; user-defined call site'lar da yakalanıyor.
  - `type` ve `null` artık keyword olarak tanınıyor.
  - Hex literal (`0x...`) ve scientific float desteği.
  - ALL_CAPS tanımlayıcılar `variable.other.constant` olarak vurgulanıyor (`PI`, `PORT`, vb.).
- **Built-in fonksiyon listesi** Tulpar'ın güncel embed'lenmiş kütüphanelerine
  göre yenilendi: `api_init`, `api_use`, `api_put`, `api_delete`, socket
  ailesi, `async_run`, `middleware_use`, `db_prepare`/`db_step`/`db_finalize`,
  `epoch_ms`, vb. (60+ → 130+).

### 📚 Documentation

- README'ye Diagnostics ve yeni komutlar bölümü eklendi.

## [0.0.3] - 2026-01-27

### ✨ Added
- **bigint and json types**: Added syntax highlighting for `bigint` and `json` types
- **New snippets**: Type definitions (`ttype`), try-catch-finally (`ttry`), JSON literals (`tjson`), threading (`tthread`), HTTP routes (`twings`), database operations (`tdb`)
- **Status bar integration**: Quick run button in status bar for easy access
- **Enhanced built-in functions**: Added missing functions (`file_read`, `file_write`, `file_delete`, `timestamp`, `time_ms`, `clock_ms`, `db_execute`)
- **HTTP/Wings API functions**: Added syntax highlighting for Wings and TulparAPI functions (`get`, `post`, `listen`, `route_get`, `route_post`, `api_get`, `api_post`, `api_run`, `api_json_response`)

### 🎨 Improved
- Updated run command default to `tulpar ${file}` (VM mode, aligned with Tulpar CLI)
- Enhanced README with comprehensive feature coverage section
- Better documentation with examples and links to Tulpar language examples
- Improved configuration description with execution mode examples

### 📚 Documentation
- README updated with feature list, usage instructions, and examples
- Added links to Tulpar language examples repository
- Comprehensive feature coverage documentation

## [0.0.2] - 2026-01-12

### ✨ Added
- **Exception Handling Anahtar Kelimeleri**: `try`, `catch`, `finally`, `throw`
- **Threading Fonksiyonları**: `thread_create`, `mutex_create`, `mutex_lock`, `mutex_unlock`
- **I/O Fonksiyonları**: `sleep`
- **HTTP Fonksiyonları**: `http_parse_request`, `http_create_response`
- **Database Fonksiyonları**: `db_open`, `db_close`, `db_query`

### 🎨 Improved
- Syntax highlighting: 10 yeni fonksiyon ve 4 yeni keyword eklendi

---

## [0.5.0] - 2025-10-14

### ✨ Added
- **16 String İşleme Fonksiyonu Eklendi**:
  - **Dönüşüm**: `upper`, `lower`, `capitalize`, `reverse`
  - **Temizleme**: `trim`, `replace`
  - **Arama**: `contains`, `startsWith`, `endsWith`, `indexOf`, `count`
  - **Alt String**: `substring`, `repeat`
  - **Bölme/Birleştirme**: `split`, `join`
  - **Kontrol**: `isEmpty`, `isDigit`, `isAlpha`

- **10 Yeni String Snippet'i**:
  - `oupper` - String'i büyük harfe çevirme
  - `olower` - String'i küçük harfe çevirme
  - `otrim` - Boşlukları temizleme
  - `oreplace` - String içinde değiştirme
  - `ocontains` - String içinde arama
  - `osubstring` - Alt string alma
  - `osplit` - String'i ayırma
  - `ojoin` - Dizi birleştirme
  - `oreverse` - String'i tersine çevirme
  - `ocapitalize` - İlk harfi büyütme

### 🎨 Improved
- Syntax highlighting: 16 string fonksiyonu eklendi
- IntelliSense: Tüm string fonksiyonları için otomatik tamamlama
- Hover bilgisi: String fonksiyonları için parametreler ve Türkçe açıklamalar

### 📚 Documentation
- README.md: String fonksiyonları bölümü eklendi
- Toplam 59 built-in fonksiyon (43 → 59)

---

## [0.4.1] - 2025-10-13

### 🐛 Fixed
- **Yorum İçindeki Kelimeler Fonksiyon Olarak Algılanma Hatası**
  - Satır sonu yorumlarındaki (`//`) kelimeler artık fonksiyon olarak kontrol edilmiyor
  - Örnek: `float angle = pi / 4.0;  // 45 derece (radyan)` → "derece" kelimesi hata vermiyor ✅
  - Fonksiyon kontrolünden önce yorumlar temizleniyor

### ✨ Added
- **JSON Object Tanımlamaları için Noktalı Virgül Kontrolü**
  - Çok satırlı `arrayJson` tanımlamalarının sonunda noktalı virgül kontrolü
  - Süslü parantezleri (`{}`) sayarak object kapanışını tespit eder
  - Örnek: `arrayJson data = { ... }` → Sonunda `;` yoksa uyarı verir
  - Hata mesajı: "JSON object definition should end with semicolon (;)"

---

## [0.4.0] - 2025-10-13

### ✨ Added
- **27 Matematik Fonksiyonu Eklendi**:
  - **Temel Matematik**: `abs`, `sqrt`, `cbrt`, `pow`, `hypot`
  - **Yuvarlama**: `floor`, `ceil`, `round`, `trunc`
  - **Trigonometri**: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`
  - **Hiperbolik**: `sinh`, `cosh`, `tanh`
  - **Logaritma**: `exp`, `log`, `log10`, `log2`
  - **İstatistik**: `min`, `max` (variadic - sınırsız argüman)
  - **Rastgele Sayı**: `random`, `randint`
  - **Diğer**: `fmod`

- **16 Yeni Matematik Snippet'i**:
  - `osqrt`, `opow`, `oabs` - Temel matematik fonksiyonları
  - `ofloor`, `oceil`, `oround` - Yuvarlama işlemleri
  - `osin`, `ocos`, `otan` - Trigonometrik fonksiyonlar
  - `olog`, `olog10`, `oexp` - Logaritma ve üstel fonksiyonlar
  - `orandom`, `orandint` - Rastgele sayı üretimi
  - `omin`, `omax` - Min/Max değer bulma
  - `opythag` - Pisagor teoremi kısayolu (`√(a²+b²)`)
  - `orad` - Derece → Radyan dönüşüm formülü

### 🎨 Improved
- Syntax highlighting: 27 matematik fonksiyonu eklendi
- IntelliSense: Tüm matematik fonksiyonları için otomatik tamamlama
- Hover bilgisi: Matematik fonksiyonları için parametreler ve açıklamalar

### 📚 Documentation
- README güncellendi: Matematik fonksiyonları bölümü eklendi
- `math_demo.Tulpar`: Tüm matematik fonksiyonlarını gösteren kapsamlı demo dosyası

---

## [0.3.4] - 2025-10-10

### Fixed
- 🐛 **Çok Satırlı Dizi Tanımlamalarında Noktalı Virgül Hatası**
  - Dizi tanımlaması satır satır yapılırken noktalı virgül kontrolü artık doğru çalışıyor
  - Örnek: `arrayJson config = ["Tulpar", "1.2.1", ...];` şeklinde satır satır yazarken her satır için hata vermiyor
  - Açık parantez (`[`) kapanana kadar noktalı virgül kontrolü yapılmıyor
  - 72. satırda `"Tulpar",` artık noktalı virgül hatası vermiyor ✅

## [0.3.3] - 2025-10-10

### Fixed
- 🐛 **arrayJson Dizi Erişimlerinde Yanlış Tip Kontrolü**
  - `arrayJson` dizilerinden veri alırken tip kontrolü artık çalışmıyor
  - Örnek: `str isim = kullanici[0];` artık hata vermiyor (arrayJson karışık tip içerir)
  - `int yas = kullanici[1];` ve `bool aktif = kullanici[2];` gibi kullanımlar destekleniyor
  - Dizi erişimleri (`[index]`) tip kontrolünden muaf tutuldu

## [0.3.2] - 2025-10-10

### Fixed
- 🐛 **Satır Sonundaki Yorumlar Noktalı Virgül Kontrolünde Sorun Yaratıyordu**
  - Artık `int x = 5;  // yorum` şeklindeki satırlar doğru kontrol ediliyor
  - Satır sonunda noktalı virgül varsa yorum olsa bile hata vermiyor
  - Örnek: `int hak = 7; // Tahmin hakkı` → Artık uyarı yok ✅

## [0.3.1] - 2025-10-10

### Fixed
- 🐛 **String İçindeki Metinler Hata Vermiyordu**
  - String literalleri içindeki büyük harfli kelimeler artık fonksiyon olarak algılanmıyor
  - Örnek: `print("Not: A (Mükemmel!)")` artık hata vermiyor
  - String içindeki parantezli ifadeler düzgün çalışıyor

## [0.3.0] - 2025-10-10

### Added
- ✨ **Tip Kontrolü (Type Checking)**
  - String'e sayı atama kontrolü
  - Int'e string atama kontrolü
  - Bool'a geçersiz değer atama kontrolü
  - Array tip uyuşmazlığı kontrolü (arrayInt, arrayStr)
  - Gerçek zamanlı tip hataları gösterimi

- 💡 **Kullanılmayan Kod Algılama**
  - Kullanılmayan değişken tespiti ve uyarısı
  - Kullanılmayan fonksiyon tespiti ve uyarısı
  - Kullanılmayan kodlar gri/soluk görünür

- 🔍 **Gelişmiş Diagnostics**
  - Tanımlanmamış fonksiyon çağrısı hataları (bilgi → hata seviyesine yükseltildi)
  - Daha detaylı hata mesajları
  - Hata kodları eklendi (type-mismatch, unused-variable, etc.)

### Improved
- 📊 Daha kapsamlı kod analizi
- 🎯 Daha kesin hata mesajları
- 🚀 Performans iyileştirmeleri

## [0.2.0] - 2025-10-10

### Added
- 🧠 **IntelliSense (Otomatik Tamamlama)**
  - Anahtar kelimeler için otomatik tamamlama
  - Veri tipleri önerileri
  - Built-in fonksiyon önerileri (parametre bilgisiyle)
  - Kullanıcı tanımlı fonksiyon önerileri
  - Değişken önerileri (tip bilgisiyle)

- 💡 **Hover Bilgisi**
  - Built-in fonksiyonlar için dokümantasyon
  - Kullanıcı fonksiyonları için parametre bilgisi
  - Değişkenler için tip bilgisi
  - Anahtar kelimeler için açıklama

- 🔍 **Diagnostics (Kod Analizi)**
  - Noktalı virgül eksikliği uyarıları
  - Tanımlanmamış fonksiyon uyarıları
  - Gerçek zamanlı hata gösterimi

### Improved
- 📝 README güncellendi
- 📦 Extension.js büyük ölçüde genişletildi (1KB → 9KB)

## [0.1.0] - 2025-10-10

### Added
- ✨ **Sözdizimi Vurgulama**
  - Anahtar kelimeler vurgulaması
  - Veri tipleri vurgulaması
  - Built-in fonksiyonlar vurgulaması
  - Operatörler vurgulaması
  - Yorum satırları vurgulaması

- 📝 **Snippets (Kod Şablonları)**
  - Değişken tanımlama snippet'leri
  - Dizi tanımlama snippet'leri
  - Kontrol yapıları (if, else, for, while)
  - Fonksiyon tanımlama şablonları
  - Kullanıcı girişi şablonları

- 🏃 **Run Tulpar File Komutu**
  - Command Palette'ten .Tulpar dosyası çalıştırma
  - Özelleştirilebilir çalıştırma komutu

- 🎨 **Dil Konfigürasyonu**
  - Otomatik parantez/tırnak kapatma
  - Blok ve satır yorumu desteği
  - Akıllı girinti

### Initial Release
- İlk sürüm yayınlandı
- Temel Tulpar dil desteği eklendi
