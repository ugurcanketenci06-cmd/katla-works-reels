import assert from 'node:assert/strict';
import {openBrowser} from '@remotion/renderer';

const browser = await openBrowser('chrome', {
  browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || undefined,
  chromiumOptions: {flags: {'autoplay-policy': 'no-user-gesture-required'}},
});
const errors = [];
const advisories = [];
try {
  const page = await browser.newPage({
    context: () => null, logLevel: 'error', indent: false, pageIndex: 0,
    onBrowserLog: log => {
      if (log.type === 'error') {
        const advisory = log.stackTrace?.some(frame => frame.url?.startsWith('https://bugs.remotion.dev/'));
        (advisory ? advisories : errors).push(log.text);
      }
    },
    onLog: () => {},
  });
  await page.goto({url: `${process.env.STUDIO_URL || 'http://localhost:3000'}/KatlaWorksReels`, timeout: 30000});
  // Wait for Studio's audio metadata and play control to be ready.
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await page.evaluate(() => Boolean(
      document.querySelector('audio')?.readyState >= 2 &&
      document.querySelector('button[aria-label="Play"]')
    ))) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  const decoded = await page.evaluate(async () => {
    const audio = document.querySelector('audio');
    if (!audio) throw new Error('Studio audio element not found');
    const context = new AudioContext();
    try {
      const response = await fetch(audio.src);
      if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      const samples = buffer.getChannelData(0);
      let peak = 0;
      for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
      return {duration: buffer.duration, sampleRate: buffer.sampleRate, peak};
    } finally {
      await context.close();
    }
  });
  assert.ok(decoded.duration > 36 && decoded.duration <= 36.5);
  assert.ok(decoded.peak > 0.01, 'Voiceover must contain a non-silent signal');
  await page.evaluate(() => document.querySelector('button[aria-label="Play"]').click());
  let maximumTime = 0;
  for (let i = 0; i < 80; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const media = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return {time: audio.currentTime, muted: audio.muted, volume: audio.volume, error: audio.error?.message};
    });
    assert.equal(media.error, undefined);
    assert.equal(media.muted, false);
    assert.ok(media.volume > 0);
    maximumTime = Math.max(maximumTime, media.time);
    if (i % 10 === 9) console.log('Playback:', media);
  }
  assert.ok(maximumTime > 35, 'Preview must reach the end of the voiceover');
  // Studio's optional online bug advisory can fail in isolated environments.
  assert.deepEqual(errors, []);
  console.log('PASS: Studio playback, audible audio settings and MP3 decoding.', decoded);
  if (advisories.length) console.log('Optional Remotion advisory service:', advisories);
} finally {
  await browser.close({silent: true});
}
