# Ses hizalama kaydı

Kaynak: `public/audio/voiceover.mp3`, 36,440816 saniye, mono / 44,1 kHz.
SHA-256: `2ab8be8d3f36887129af5e53a0f344bed8ae012f7242a3ff3c54a76eda461c4d`.
Logo SHA-256: `ef9c913845b08db002e9cb5dc7a1d08a03cc1d7ae277b942e5507bd431a01165`.
İki medya dosyası da değiştirilmedi. Ses kesilmez, ötelenmez veya hızlandırılmaz.

## Ölçüm

FFmpeg `silencedetect=noise=-35dB:d=0.15` gerçek MP3 üzerinde çalıştırıldı.
Sonuçlar ve tüm geçiş pencereleri `audio-analysis.json` dosyasında.
`npm run verify:audio` aynı kontrolü yeniden yapar; sistemde FFmpeg gerektirir.

| İstenen kontrol | Ölçülen düşük ses aralığı | Geçiş karesi | Geçişin tamamı |
| --- | --- | --- | --- |
| 10,67–11,04 sn | 10,676780–11,040408 | 326 / 10,8667 sn | 10,8000–10,9333 sn |
| 15,33–15,63 sn | 15,330907–15,627868 | 465 / 15,5000 sn | 15,4333–15,5667 sn |
| 30,26–30,49 sn | 30,296372–30,489546 | 912 / 30,4000 sn | 30,3333–30,4667 sn |

Son aralığın başlangıcı -35 dB eşiğinde 30,296 sn'dir; 30,26 sn sessiz kabul edilmedi.
Tüm 7 sahne geçişinin ±2 karelik turuncu geçişi ölçülen duraklamaya sığar.
8 sahne: maliyet → soru → artık gerek yok → marka → hizmetler → tek çatı → odaklan → çağrı.
Hizmet grafiklerinin değişimi aynı sahnede, ilgili sözün başlangıcında yapılır;
21,31 sn'deki e-ticaret başlangıcına tam ekran geçiş eklenmez.

## Kelimeler

`faster-whisper 1.2.1`, `small`, CPU int8, `language=tr`, `beam_size=5`,
`word_timestamps=True`, `vad_filter=False` ile iki geçiş yapıldı.
İkinci geçişte cümleler ölçülen duraklamalardan bölündü; marka yazımı için
“Katla Works, profesyonel web sitesi, Meta reklamları, e-ticaret” bağlamı verildi.
Modelin kelime başlangıçlarını sessizliğe yaydığı noktalarda başlangıç,
ölçülen sessizliğin sonuna alındı. Kelime bitişleri değiştirilmedi.
“Burak” otomatik çözüm hatası, ilk geçişteki “bırak” ve cümle bağlamıyla düzeltildi.
“e” + “-ticaret” tek kelimeye birleştirildi.

`src/narration.ts` 77 kelimenin saniye zamanlarını, model güven değerlerini ve
altyazı gruplarını saklar. `cue()` başlıkları aynı kelime verisine bağlar;
kelime girişleri 30 FPS'e en yakın kareye yuvarlanır. Maliyet sayaçları maaş,
sigorta, yemek ve yol sözcükleriyle artar. Rakamlar gider kalemi sayısıdır;
parasal fiyat veya reklam performans iddiası oluşturulmaz. Grafikler temsili arayüzlerdir.

Bunlar model ve sinyal ölçümüyle hizalanmış zamanlardır; fonem düzeyinde insan
onaylı transkript değildir. Özellikle marka adının model güveni düşüktür;
logo yazımı korunur, ses kaydının telaffuzu değiştirilmez. Kareye yuvarlama
±16,7 ms ekler; model kelime sınırlarının hatası bundan daha büyük olabilir.

## Test kapsamı

- `npm run check`: TypeScript.
- `npm run verify:audio`: gerçek ses sinyalinde tüm geçiş pencereleri.
- `npm run verify`: 48 sahne karesi ve 4 hizmet karesi; konuşan kelimenin üzerine geçiş gelmemesi.
- Studio açıkken `npm run verify:preview`: her kelime başlangıcı ve +8 kare,
  sahne sınırları ve hizmet örneklerinde yazı taşması, metin çakışması ve erken kelime girişi;
  ardından ses açık 40 saniye oynatma, MP3 çözme ve ses sinyali kontrolü.
- `npm run verify:layout`: yalnızca 175 örnek karedeki metin kontrollerini tekrarlar.

Hiçbir komut final MP4 üretmez. PNG çıktıları `out/verification/` altında kalır.
