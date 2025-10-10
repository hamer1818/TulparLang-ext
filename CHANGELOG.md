# Change Log

All notable changes to the "vscode-olang" extension will be documented in this file.

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
