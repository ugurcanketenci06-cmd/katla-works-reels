import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {openBrowser} from '@remotion/renderer';

async function loadTS(path) {
  const source = await readFile(path,'utf8');
  const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const {WORDS} = await loadTS('src/narration.ts');
const {SCENES, SERVICES} = await loadTS('src/timeline.ts');
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
  const frames = [...new Set([
    ...WORDS.flatMap(w=>[Math.round(w.start*30),Math.min(1094,Math.round(w.start*30)+8)]),
    ...SCENES.flatMap(s=>[s.start,Math.min(1094,s.start+3),s.end-1]),
    ...SERVICES.map(s=>Math.round(s.at*30)+25),
  ])].sort((a,b)=>a-b);
  for (const frame of frames) {
    const result = await page.evaluate(async frame => {
      window.remotion_setFrame(frame,'KatlaWorksReels',1);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const root=document.querySelector('[data-reel]');
      const box=root.getBoundingClientRect(), scale=box.width/1080;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      const visible=[];
      let node;
      while ((node=walker.nextNode())) {
        if(!node.textContent.trim()) continue;
        let element=node.parentElement, hidden=false;
        while(element&&element!==root) {
          const style=getComputedStyle(element);
          if(Number(style.opacity)<0.05||style.display==='none'||style.visibility==='hidden') hidden=true;
          element=element.parentElement;
        }
        if(hidden) continue;
        const range=document.createRange();range.selectNodeContents(node);
        for(const rect of range.getClientRects()) {
          if(rect.width<1||rect.height<1) continue;
          visible.push({text:node.textContent.trim(),x:(rect.left-box.left)/scale,y:(rect.top-box.top)/scale,right:(rect.right-box.left)/scale,bottom:(rect.bottom-box.top)/scale});
        }
      }
      const overflow=visible.filter(r=>r.x<60||r.right>1020||r.y<120||r.bottom>1690);
      const overlaps=[];
      for(let i=0;i<visible.length;i++) for(let j=i+1;j<visible.length;j++) {
        const a=visible[i],b=visible[j];
        if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>3 && Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>3) overlaps.push([a.text,b.text]);
      }
      const early=[...root.querySelectorAll('[data-word]')].filter(el=>Number(el.dataset.at)>frame&&Number(getComputedStyle(el).opacity)>0);
      return {frame:Number(root.dataset.frame),overflow,overlaps,early:early.length};
    },frame);
    assert.equal(result.frame,frame);
    assert.deepEqual(result.overflow,[],`Text overflow at frame ${frame}`);
    assert.deepEqual(result.overlaps,[],`Text overlap at frame ${frame}`);
    assert.equal(result.early,0,`Early word entry at frame ${frame}`);
  }
  console.log(`PASS: ${frames.length} frames checked for text overflow, overlap and early word entries.`);
  await page.evaluate(async ()=> {
    window.remotion_setFrame(0,'KatlaWorksReels',1);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  if (!process.argv.includes('--layout-only')) {
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
  }
  if (advisories.length) console.log('Optional Remotion advisory service:', advisories);
} finally {
  await browser.close({silent: true});
}
