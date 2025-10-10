# Olang VS Code Extension

**Olang** dili için tam özellikli VS Code uzantısı — sözdizimi vurgulama, IntelliSense, tip kontrolü, kullanılmayan kod algılama, hover bilgisi, diagnostics, snippet'ler ve "Run Olang File" komutu.

## 🚀 Özellikler

### 🧠 IntelliSense (Otomatik Tamamlama)
- **Anahtar kelimeler**: `if`, `else`, `for`, `while`, `func`, `return`, `break`, `continue`
- **Veri tipleri**: `int`, `float`, `str`, `bool`, `array`, `arrayInt`, `arrayFloat`, `arrayStr`, `arrayBool`, `arrayJson`
- **Yerleşik fonksiyonlar**: `print`, `input`, `inputInt`, `inputFloat`, `length`, `push`, `pop`, `range`, `toInt`, `toFloat`, `toString`, `toBool`
- **Kullanıcı tanımlı fonksiyonlar**: Dosyadaki tüm fonksiyonlar otomatik algılanır
- **Değişkenler**: Tanımlı değişkenler tip bilgisiyle birlikte önerilir

### 💡 Hover Bilgisi
- Fonksiyonların üzerine gelin → parametre ve açıklama bilgisi görün
- Değişkenlerin üzerine gelin → tip bilgisini görün
- Anahtar kelimelerin üzerine gelin → açıklama görün

### 🔍 Diagnostics (Kod Analizi) - GELIŞMIŞ

#### Tip Kontrolü
- ❌ **String'e sayı atama**: `str isim = 123;` → Hata
- ❌ **Int'e string atama**: `int yas = "yirmi";` → Hata  
- ❌ **Bool'a geçersiz değer**: `bool aktif = "evet";` → Hata
- ❌ **Array tip uyuşmazlığı**: `arrayInt nums = ["a", "b"];` → Hata
- ❌ **Tanımlanmamış fonksiyon**: `bilinmeyenFunc();` → Hata

#### Kullanılmayan Kod Algılama
- 💡 **Kullanılmayan değişkenler** → Gri/soluk görünür + uyarı
- 💡 **Kullanılmayan fonksiyonlar** → Gri/soluk görünür + uyarı
- 🎯 Kod temizliği için öneriler

#### Genel Kontroller
- ⚠️ Noktalı virgül eksikliği uyarıları
- 🔴 Gerçek zamanlı hata gösterimi

### ✨ Sözdizimi Vurgulama
- Anahtar kelimeler: `if`, `else`, `for`, `while`, `func`, `return`, `break`, `continue`, `in`
- Veri tipleri: `int`, `float`, `str`, `bool`, `array`, `arrayInt`, `arrayFloat`, `arrayStr`, `arrayBool`, `arrayJson`
- Yerleşik fonksiyonlar: `print`, `input`, `inputInt`, `inputFloat`, `length`, `push`, `pop`, `range`, `toInt`, `toFloat`, `toString`, `toBool`
- Operatörler: `&&`, `||`, `!`, `==`, `!=`, `<=`, `>=`, `++`, `--`, `+=`, `-=`, `*=`, `/=`
- Yorumlar: `//` satır yorumu, `/* */` blok yorumu

### 📝 Snippet'ler (Kod Şablonları)
- `print` → Print statement
- `oint`, `ofloat`, `ostr`, `obool` → Değişken tanımlamaları
- `oarray`, `oarrayint`, `oarraystr` → Dizi tanımlamaları
- `oif`, `oifelse` → If/else yapıları
- `owhile`, `ofor`, `oforin` → Döngüler
- `ofunc`, `ofuncr` → Fonksiyon tanımlamaları
- `oinput`, `oinputint` → Kullanıcı girişi
- `ocomment` → Bölüm yorumu

### 🏃 Run Olang File Komutu
- Command Palette (`Ctrl+Shift+P`) → `Run Olang File`
- Aktif `.olang` dosyasını terminalden çalıştırır
- Ayarlardan komut özelleştirilebilir: `olang.runCommand`

### 🎨 Dil Konfigürasyonu
- Otomatik parantez/tırnak kapatma
- Blok ve satır yorumu desteği
- Akıllı girinti

## 📦 Kullanım

### Uzantıyı Geliştirici Modunda Çalıştırma

1. Bu projeyi VS Code'da açın
2. `F5` tuşuna basın (Extension Development Host açılır)
3. Yeni pencerede bir `.olang` dosyası açın
4. Sözdizimi vurgulama otomatik çalışacaktır
5. `Ctrl+Shift+P` → `Run Olang File` ile dosyayı çalıştırın

### Ayarlar

`settings.json` dosyanıza ekleyebilirsiniz:

```json
{
  "olang.runCommand": "olang run ${file}"
}
```

`${file}` yerine aktif dosyanın yolu konulur. Örneğin:
- Windows: `"C:\\olang\\olang.exe run ${file}"`
- Linux/Mac: `"/usr/local/bin/olang run ${file}"`

## 📚 Örnek Olang Kodu

```olang
// Basit bir Olang programı
print("=== Merhaba OLang! ===");

int yas = inputInt("Yaşınızı girin: ");
str isim = input("İsminizi girin: ");

if (yas >= 18) {
    print("Merhaba", isim, "- Yetişkinsiniz!");
} else {
    print("Merhaba", isim, "- Henüz çocuksunuz!");
}

// Diziler
arrayInt sayilar = [1, 2, 3, 4, 5];
for (int i = 0; i < length(sayilar); i++) {
    print("Sayı:", sayilar[i]);
}

// Fonksiyonlar
func topla(int a, int b) {
    return a + b;
}

int sonuc = topla(10, 20);
print("Toplam:", sonuc);
```

## 🔧 Geliştirme

### Gereksinimler
- Node.js (v14+)
- VS Code (v1.60.0+)

### Kurulum
```bash
cd olan-ext
# Bağımlılık yok, direkt F5 ile çalıştırabilirsiniz
```

### Test
1. `F5` ile Extension Development Host'u başlatın
2. Test dosyalarını `examples/` klasöründen açın
3. Sözdizimi vurgulamasını ve snippet'leri test edin

## 📦 Yayımlama

```bash
# vsce kurulumu (ilk kez)
npm install -g @vscode/vsce

# Uzantıyı paketleme
vsce package

# Marketplace'e yükleme (publisher hesabı gerekli)
vsce publish
```

## 🎯 İleri Özellikler (Planlanan)

- [ ] Language Server Protocol (LSP) entegrasyonu
  - Kod tamamlama (IntelliSense)
  - Hata kontrolü (diagnostics)
  - Hover bilgileri
  - Go to Definition
- [ ] Hata ayıklama (Debug) desteği
- [ ] Kod biçimlendirme (formatter)
- [ ] Otomatik import/organize

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

---

**Olang ile kodlamanın keyfini çıkarın!** 🎉
