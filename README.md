# Katla Works Reels

React + TypeScript + Remotion. 1080×1920, 30 FPS, 720 kare / 24 saniye.

Ses dosyası için `public/audio/voiceover.mp3` konumunu kullanın. Ses eklenince `withAudio` prop değerini `true` yapın. `src/timeline.ts` sahne başlangıçlarını ve sürelerini içerir. Henüz final render yapılmadı.

Codex ortamında `npm install`, `npm run check`, `npm run compositions` ile doğrulayın. Önizleme için `npm run dev`.

## Kurulum ve doğrulama

- Node.js 22 veya 24 kullanın. Kilitli bağımlılıkları `npm ci` ile kurun.
- `npm run check`: TypeScript kontrolü.
- `npm run compositions`: kompozisyon boyutu, FPS ve süre bilgisi.
- `npm run verify`: gerçek Chromium içinde 5 sahnenin giriş, tipografi, geçiş ve son karelerinden toplam 30 PNG üretir (`out/verification/`). MP4 üretmez.
- Sistem Chromium kullanılıyorsa: `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run verify`. Kompozisyon listesi için: `npm run compositions -- --browser-executable=/usr/bin/chromium`.

## Seslendirmeyi sonradan ekleme

`public/audio/voiceover.mp3` henüz gerekli değildir: `withAudio: false` varsayılanıyla ses bileşeni oluşturulmaz ve eksik dosya istenmez. Dosyayı ekledikten sonra Studio'nun Props alanında `withAudio` değerini `true` yapın (kalıcı varsayılan için `src/index.tsx` içindeki `defaultProps` değerini değiştirin). Ses ilk karede başlar; video süresi 24 saniye olarak kalır. Daha uzun ses bu sürede kesilir, kısa ses sonrasında video sessiz devam eder. Ses dosyası `.gitignore` kapsamındadır.

Türkçe metinler UTF-8 tutulur. Animasyonlar kare numarasından hesaplanır; sahne süreleri `src/timeline.ts` dosyasındadır. Son çağrı sahnesi son kareye kadar görünür kalır.
