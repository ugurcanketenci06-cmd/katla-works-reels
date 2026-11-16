import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import ts from 'typescript';
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';

// Real browser smoke test; only PNG frames are produced, never a final video.
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || undefined;
const source = await readFile('src/timeline.ts', 'utf8');
const {outputText} = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.ESNext},
});
const {SCENES, FPS, DURATION} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
assert.equal(FPS, 30);
assert.equal(DURATION, 720);
let nextStart = 0;
for (const scene of SCENES) {
  assert.equal(scene.start, nextStart, 'Scenes must have no gaps or overlaps');
  assert.ok(Number.isInteger(scene.duration) && scene.duration > 30);
  nextStart += scene.duration;
}
assert.equal(nextStart, DURATION);
const serveUrl = await bundle({entryPoint: 'src/index.tsx'});
const browser = await openBrowser('chrome', {browserExecutable});
try {
  const composition = await selectComposition({
    serveUrl, id: 'KatlaWorksReels', puppeteerInstance: browser,
  });
  assert.equal(composition.width, 1080);
  assert.equal(composition.height, 1920);
  assert.equal(composition.fps, 30);
  assert.equal(composition.durationInFrames, 720);
  assert.equal(composition.props.withAudio, false);
  await mkdir('out/verification', {recursive: true});
  // Entry, text springs, wipe start/end and final CTA for every scene.
  let count = 0;
  for (const {start, duration} of SCENES) {
    for (const offset of [0, 8, 30, duration-8, duration-4, duration-1]) {
      const frame = start + offset;
      await renderStill({
        serveUrl, composition, frame, puppeteerInstance: browser,
        output: `out/verification/frame-${String(frame).padStart(3, '0')}.png`,
        imageFormat: 'png',
      });
      count++;
    }
  }
  console.log(`PASS: 1080x1920, 30 FPS, 720 frames; ${count} PNG frames rendered without voiceover.`);
} finally {
  await browser.close({silent: true});
}
