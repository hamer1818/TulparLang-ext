# Change Log

All notable changes to the "vscode-olang" extension will be documented in this file.

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
- `math_demo.olang`: Tüm matematik fonksiyonlarını gösteren kapsamlı demo dosyası

---

## [0.3.4] - 2025-10-10

### Fixed
- 🐛 **Çok Satırlı Dizi Tanımlamalarında Noktalı Virgül Hatası**
  - Dizi tanımlaması satır satır yapılırken noktalı virgül kontrolü artık doğru çalışıyor
  - Örnek: `arrayJson config = ["OLang", "1.2.1", ...];` şeklinde satır satır yazarken her satır için hata vermiyor
  - Açık parantez (`[`) kapanana kadar noktalı virgül kontrolü yapılmıyor
  - 72. satırda `"OLang",` artık noktalı virgül hatası vermiyor ✅

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

- 🏃 **Run Olang File Komutu**
  - Command Palette'ten .olang dosyası çalıştırma
  - Özelleştirilebilir çalıştırma komutu

- 🎨 **Dil Konfigürasyonu**
  - Otomatik parantez/tırnak kapatma
  - Blok ve satır yorumu desteği
  - Akıllı girinti

### Initial Release
- İlk sürüm yayınlandı
- Temel OLang dil desteği eklendi
