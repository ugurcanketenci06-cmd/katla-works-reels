import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const file='public/audio/voiceover.mp3';
const result=spawnSync('ffmpeg',['-hide_banner','-i',file,'-af','silencedetect=noise=-35dB:d=0.15','-f','null','-'],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr || 'FFmpeg must be installed');
const pauses=[];
let start;
for (const line of result.stderr.split('\n')) {
  const a=line.match(/silence_start: ([\d.]+)/), b=line.match(/silence_end: ([\d.]+)/);
  if(a) start=Number(a[1]);
  if(b&&start!==undefined){pauses.push({start,end:Number(b[1])});start=undefined;}
}
const js=ts.transpileModule(await readFile('src/timeline.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {SCENES,FPS}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const cuts=SCENES.slice(1).map(scene=>{
 const from=(scene.start-2)/FPS,to=(scene.start+2)/FPS;
 const pause=pauses.find(p=>p.start<=from&&p.end>=to);
 assert.ok(pause,`Transition ${scene.kind} at ${scene.start/FPS}s intersects non-silent audio`);
 return {scene:scene.kind,frame:scene.start,from,to,pause};
});
for (const expected of [10.85,15.48,30.4]) assert.ok(pauses.some(p=>p.start<expected&&p.end>expected));
const hash=createHash('sha256').update(await readFile(file)).digest('hex');
await mkdir('out/verification',{recursive:true});
await writeFile('out/verification/audio-analysis.json',JSON.stringify({sha256:hash,thresholdDb:-35,minimumPauseSeconds:0.15,pauses,cuts},null,2));
console.log(`PASS: ${cuts.length} transition windows fit inside pauses measured from the actual MP3.`,cuts);
