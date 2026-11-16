import React from 'react';
import {AbsoluteFill, Composition, interpolate, registerRoot, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Audio} from 'remotion';
import {SCENES, FPS, DURATION} from './timeline';

const yellow='#F4C430', black='#101010';
function Scene({index}:{index:number}) {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const s=SCENES[index];
  const fade=interpolate(f,[0,8],[0,1],{extrapolateRight:'clamp'});
  const light=index%2===1; const fg=light?black:'#FFFFFF'; const bg=light?yellow:black;
  return <AbsoluteFill style={{backgroundColor:bg,color:fg,fontFamily:'Arial, sans-serif',padding:'150px 88px',boxSizing:'border-box',overflow:'hidden'}}>
    <div style={{fontSize:35,fontWeight:900,letterSpacing:3,opacity:fade}}>KATLA <span style={{color:light?black:yellow}}>WORKS</span></div>
    <div style={{position:'absolute',top:460,left:88,right:88}}>
      <div style={{fontSize:32,fontWeight:700,letterSpacing:5,marginBottom:55,color:light?black:yellow}}>{s.kicker}</div>
      {s.lines.map((line,i)=>{
        const scale=spring({frame:f-i*9,fps,config:{damping:17,stiffness:170}});
        return <div key={i} style={{fontSize:line.length>16?82:112,fontWeight:900,lineHeight:1.04,letterSpacing:-3,transform:`translateY(${(1-scale)*140}px)`,opacity:Math.max(0,scale),marginBottom:22}}>{line}</div>;
      })}
    </div>
    <div style={{position:'absolute',bottom:360,left:88,right:88,height:9,backgroundColor:light?'#1113':'#fff3'}}>
      <div style={{height:'100%',width:`${Math.min(100,f/s.duration*100)}%`,backgroundColor:light?black:yellow}}/>
    </div>
    <div style={{position:'absolute',bottom:275,left:88,fontSize:30,fontWeight:800,letterSpacing:2}}>{s.footer}</div>
    <div style={{position:'absolute',right:88,bottom:270,fontSize:33,fontWeight:900}}>{String(index+1).padStart(2,'0')} / 05</div>
    <div style={{position:'absolute',width:700,height:700,border:`30px solid ${light?black:yellow}`,borderRadius:'50%',opacity:.08,right:-350,top:140,transform:`scale(${1+f*.004})`}}/>
  </AbsoluteFill>;
}
const Reel:React.FC<{withAudio:boolean}>=({withAudio})=><AbsoluteFill style={{background:black}}>
  {SCENES.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><Scene index={i}/></Sequence>)}
  {withAudio&&<Audio src={staticFile('audio/voiceover.mp3')}/>}
</AbsoluteFill>;
const Root=()=> <Composition id="KatlaWorksReels" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={DURATION} defaultProps={{withAudio:false}}/>;
registerRoot(Root);
