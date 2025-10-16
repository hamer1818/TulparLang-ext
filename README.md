# Tulpar VS Code Extension

Tulpar dili için temel VS Code desteği: sözdizimi vurgulama, snippet'ler ve "Run Tulpar File" komutu.

Nasıl kullanılır:

- Uzantıyı geliştirici modunda çalıştırın (F5).
- Tulpar dosyalarınızın uzantısı `.tpr` olmalı.
- Aktif dosyayı çalıştırmak için komut paletinden `Run Tulpar File` seçin veya `CTRL+Shift+P` -> `Run Tulpar File`.

Konfigürasyon:

- `tulpar.runCommand` ayarı ile çalıştırma komutunu özelleştirebilirsiniz. Varsayılan: `tulpar run ${file}`.

Notlar:

- Bu uzantı minimal bir başlangıç sağlar. Dil özelliklerini genişletmek için ileride LSP ekleyebilirsiniz.
