# Katla Works Reels — Sesli ve logolu önizleme

React + TypeScript + Remotion. `KatlaWorksReels`: **1080×1920, 30 FPS, 1095 kare / 36,5 saniye**, 8 sahne.

## Çalıştırma

Node.js 22 veya 24 ile:

- `npm ci`: kilitli bağımlılıkları kurar.
- `npm run dev -- --port=3000 --no-open`: Remotion Studio'yu başlatır. `http://localhost:3000/KatlaWorksReels` adresinde Play'e basın; ses açık gelir.
- `npm run check`: TypeScript kontrolü.
- `npm run compositions`: boyut, FPS ve süre kontrolü.
- Studio açıkken `npm run verify:layout`: 175 örnek karede taşma, çakışma ve erken kelime girişini kontrol eder.
- `npm run verify`: Chromium'da sekiz sahnenin giriş, animasyon ve son karelerinden 48 PNG ve hizmetlere ait 4 PNG üretir (`out/verification/`). MP4 üretmez.
- Studio çalışırken `npm run verify:preview`: kelime girişleri ve sahne sınırlarında yazı taşması/çakışmasını kontrol eder; ardından MP3'ü çözer ve sesi açık 40 saniye oynatır. MP4 üretmez.

Sistem Chromium için test komutlarının önüne `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium` ekleyin. Kompozisyon listesi için `npm run compositions -- --browser-executable=/usr/bin/chromium` kullanın. Farklı Studio adresi `STUDIO_URL` ile belirtilebilir.

## Medya ve zamanlama

- Gerçek ses: `public/audio/voiceover.mp3` (MP3, mono, 44,1 kHz; 36,4408 saniye).
- Logo: `public/images/katla-logo.jpg`.
- Ses ilk kareden başlar. Görüntü ses kaydını tamamen kapsar.
- Sahne zamanlaması `src/timeline.ts` içindedir; aralarında boşluk veya çakışma olmaması test edilir.
- `src/narration.ts` ses kaydından çıkarılan kelime zamanlarını içerir. Başlıklar, altyazı vurguları, gider sayacı ve hizmet grafikleri bu akışa hizalanır.
- `npm run verify:audio` gerçek MP3 üzerinde geçişlerin düşük sesli duraklamalara sığdığını doğrular (FFmpeg gerektirir).
- Ölçülen duraklamalar, ASR yöntemi ve doğruluk sınırları: [ses hizalama kaydı](docs/audio-alignment.md). Marka telaffuzu model tarafından kesin doğrulanamaz.

Bu sürümde nihai MP4 render edilmez. Studio'nun isteğe bağlı çevrimiçi hata duyurusu servisine erişilememesi önizlemenin çalışmasını engellemez; test raporunda ayrı gösterilir.
