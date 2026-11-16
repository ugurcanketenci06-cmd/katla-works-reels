# Katla Works Reels — Sesli ve logolu önizleme

React + TypeScript + Remotion. `KatlaWorksReels`: **1080×1920, 30 FPS, 1095 kare / 36,5 saniye**, 6 sahne.

## Çalıştırma

Node.js 22 veya 24 ile:

- `npm ci`: kilitli bağımlılıkları kurar.
- `npm run dev -- --port=3000 --no-open`: Remotion Studio'yu başlatır. `http://localhost:3000/KatlaWorksReels` adresinde Play'e basın; ses açık gelir.
- `npm run check`: TypeScript kontrolü.
- `npm run compositions`: boyut, FPS ve süre kontrolü.
- `npm run verify`: Chromium'da altı sahnenin giriş, animasyon ve son karelerinden 36 PNG üretir (`out/verification/`). MP4 üretmez.
- Studio çalışırken `npm run verify:preview`: MP3'ü tarayıcıda çözer, sessiz olmadığını kontrol eder ve Studio'da sesi açık şekilde 40 saniyelik oynatma testi yapar. MP4 üretmez.

Sistem Chromium için test komutlarının önüne `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium` ekleyin. Kompozisyon listesi için `npm run compositions -- --browser-executable=/usr/bin/chromium` kullanın. Farklı Studio adresi `STUDIO_URL` ile belirtilebilir.

## Medya ve zamanlama

- Gerçek ses: `public/audio/voiceover.mp3` (MP3, mono, 44,1 kHz; 36,4408 saniye).
- Logo: `public/images/katla-logo.jpg`.
- Ses ilk kareden başlar. Görüntü ses kaydını tamamen kapsar.
- Sahne zamanlaması `src/timeline.ts` içindedir; aralarında boşluk veya çakışma olmaması test edilir.
- Konuşma ile sahnelerin kelime düzeyinde eşleşmesi ve marka telaffuzu ayrıca dinlenerek değerlendirilmelidir; otomatik test bunları doğrulamaz.

Bu sürümde nihai MP4 render edilmez. Studio'nun isteğe bağlı çevrimiçi hata duyurusu servisine erişilememesi önizlemenin çalışmasını engellemez; test raporunda ayrı gösterilir.
