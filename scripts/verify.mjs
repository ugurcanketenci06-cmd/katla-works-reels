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
const {SCENES, FPS, DURATION, PAUSES, SERVICES} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
assert.equal(FPS, 30);
assert.equal(DURATION, 1095);
let nextStart = 0;
for (const scene of SCENES) {
  assert.equal(scene.start, nextStart, 'Scenes must have no gaps or overlaps');
  assert.ok(Number.isInteger(scene.end-scene.start) && scene.end-scene.start > 30);
  nextStart = scene.end;
}
assert.equal(nextStart, DURATION);
for (const scene of SCENES.slice(1)) {
  const from = (scene.start-2)/FPS, to = (scene.start+2)/FPS;
  assert.ok(PAUSES.some(p=>from>=p.start && to<=p.end), `Cut at ${scene.start} must fit entirely inside a measured pause`);
}
const narrationSource = await readFile('src/narration.ts','utf8');
const narrationJS = ts.transpileModule(narrationSource, {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {WORDS} = await import(`data:text/javascript;base64,${Buffer.from(narrationJS).toString('base64')}`);
for (const scene of SCENES.slice(1)) {
  assert.ok(WORDS.every(w=>w.end<=(scene.start-2)/FPS || w.start>=(scene.start+2)/FPS), 'A transition must not cover an aligned spoken word');
}
const serveUrl = await bundle({entryPoint: 'src/index.tsx'});
const browser = await openBrowser('chrome', {browserExecutable});
try {
  const composition = await selectComposition({
    serveUrl, id: 'KatlaWorksReels', puppeteerInstance: browser,
  });
  assert.equal(composition.width, 1080);
  assert.equal(composition.height, 1920);
  assert.equal(composition.fps, 30);
  assert.equal(composition.durationInFrames, 1095);
  await mkdir('out/verification', {recursive: true});
  // Entry, text springs, settled content and scene boundaries.
  let count = 0;
  for (const {start, end} of SCENES) {
    const duration = end-start;
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
  for (const service of SERVICES) {
    const frame = Math.round(service.at*FPS)+25;
    await renderStill({serveUrl, composition, frame, puppeteerInstance:browser, output:`out/verification/service-${service.kind}.png`, imageFormat:'png'});
    count++;
  }
  console.log(`PASS: 1080x1920, 30 FPS, 1095 frames; ${count} PNG frames rendered with voiceover and logo assets.`);
} finally {
  await browser.close({silent: true});
}
