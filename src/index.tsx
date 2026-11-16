import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, registerRoot, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DURATION, FPS, SCENES} from './timeline';

const ORANGE='#F28A35', CREAM='#F4EBDD', DARK='#090A0B';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const appear=(f:number, delay=0)=>interpolate(f,[delay,delay+12],[0,1],clamp);
function Line({text,delay=0,large=false,accent=false}:{text:string,delay?:number,large?:boolean,accent?:boolean}){
 const f=useCurrentFrame(); const {fps}=useVideoConfig();const s=spring({fps,frame:f-delay,config:{damping:18,stiffness:165}});
 return <div style={{fontSize:large?(text.length>12?88:112):65,fontWeight:900,lineHeight:1.06,letterSpacing:-2,whiteSpace:'nowrap',color:accent?ORANGE:CREAM,opacity:Math.max(0,Math.min(1,s)),transform:`translateY(${(1-s)*85}px)`,marginBottom:22}}>{text}</div>;
}
function Panel({kind}:{kind:typeof SCENES[number]['kind']}){
 const f=useCurrentFrame();
 const scene=SCENES.find(s=>s.kind===kind)!;
 const duration=scene.end-scene.start;
 const pulse=1+0.012*Math.sin(f/5);const p=interpolate(f,[0,35],[0,1],clamp);
 return <AbsoluteFill style={{background:DARK,color:CREAM,fontFamily:'Arial, Helvetica, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(circle at 80% 26%, #402315 0%, transparent 48%)',opacity:.75}}/>
  <div style={{position:'absolute',top:152,left:86,right:86,display:'flex',justifyContent:'space-between',fontWeight:800,letterSpacing:4,fontSize:28,color:ORANGE}}><span>KATLA / WORKS</span><span>BURSA • DİJİTAL</span></div>
  <div style={{position:'absolute',top:270,left:86,width:120*p,height:9,background:ORANGE}}/>
  {kind==='cost'&&<>
   <div style={{position:'absolute',top:400,left:86,right:70}}><Line text="PERSONEL MAAŞI" large/><Line text="SİGORTA" delay={20} large accent/><Line text="YEMEK + YOL" delay={38} large/></div>
   <div style={{position:'absolute',top:1100,left:86,right:86}}>{['₺','₺₺','₺₺₺'].map((x,i)=><div key={i} style={{display:'inline-block',fontSize:100,fontWeight:900,color:ORANGE,opacity:appear(f,20+i*12),transform:`translateY(${Math.sin((f+i*8)/9)*12}px)`,marginRight:65}}>{x}</div>)}</div>
   <div style={{position:'absolute',bottom:270,left:86,fontSize:43,fontWeight:900}}>DAHA NE KADAR ÖDEYECEKSİN?</div>
  </>}
  {kind==='question'&&<><div style={{position:'absolute',top:520,left:86,right:80}}><Line text="DİJİTALDE" large/><Line text="BÜYÜMEK" large accent delay={12}/><Line text="İÇİN..." large delay={24}/></div><div style={{position:'absolute',top:1020,left:86,right:86,padding:45,border:`4px solid ${ORANGE}`,fontSize:55,fontWeight:900,transform:`scale(${pulse})`}}>YENİ PERSONEL MASRAFI MI?</div></>}
  {kind==='brand'&&<><div style={{position:'absolute',top:385,left:86,right:86}}><Line text="ARTIK" large/><Line text="GEREK YOK." large accent delay={12}/></div><div style={{position:'absolute',top:830,left:130,right:130,opacity:appear(f,20),transform:`scale(${.92+.08*appear(f,20)})`}}><Img src={staticFile('images/katla-logo.jpg')} style={{width:'100%',borderRadius:30,boxShadow:`0 0 90px #F28A3530`}}/></div></>}
  {kind==='services'&&<><div style={{position:'absolute',top:340,left:86,right:80}}><Line text="TEK EKİP." large/><Line text="TÜM DİJİTAL" large accent delay={12}/><Line text="İŞLER." large delay={24}/></div><div style={{position:'absolute',top:890,left:86,right:86,display:'flex',flexDirection:'column',gap:26}}>{['WEB SİTESİ KURULUMU + YÖNETİMİ','META REKLAMLARI','SOSYAL MEDYA İÇERİKLERİ','E-TİCARET OPERASYONLARI'].map((x,i)=><div key={x} style={{background:'#1B1A19',borderLeft:`12px solid ${ORANGE}`,borderRadius:12,padding:'25px 30px',fontSize:38,fontWeight:800,opacity:appear(f,35+i*25),transform:`translateX(${(1-appear(f,35+i*25))*170}px)`}}>{x}</div>)}</div></>}
  {kind==='bundle'&&<><div style={{position:'absolute',top:445,left:86,right:80}}><Line text="HEPSİ" large/><Line text="TEK ÇATI" large accent delay={10}/><Line text="ALTINDA." large delay={20}/></div><div style={{position:'absolute',top:1080,left:86,right:86,fontSize:51,fontWeight:800,lineHeight:1.25}}>AYRI AYRI PERSONEL ÇALIŞTIRMANA <span style={{color:ORANGE}}>GEREK YOK.</span></div></>}
  {kind==='cta'&&<><div style={{position:'absolute',top:340,left:86,right:86}}><Line text="İŞLETMENİ" large/><Line text="BÜYÜT." large accent delay={12}/><Line text="DİJİTALİ BİZE" delay={24}/><Line text="BIRAK." large accent delay={36}/></div><div style={{position:'absolute',top:910,left:260,right:260,opacity:appear(f,30)}}><Img src={staticFile('images/katla-logo.jpg')} style={{width:'100%',borderRadius:20}}/></div><div style={{position:'absolute',bottom:270,left:86,right:86,padding:38,background:ORANGE,color:DARK,fontSize:55,fontWeight:900,textAlign:'center',borderRadius:16,opacity:appear(f,50)}}>DM'DEN KATLA YAZ!</div></>}
  <div style={{position:'absolute',left:86,right:86,bottom:180,height:5,background:'#FFFFFF25'}}><div style={{height:'100%',background:ORANGE,width:`${Math.min(100,f/(duration-1)*100)}%`}}/></div>
 </AbsoluteFill>;
}
const Reel:React.FC=()=> <AbsoluteFill style={{background:DARK}}>{SCENES.map(s=><Sequence key={s.kind} from={s.start} durationInFrames={s.end-s.start}><Panel kind={s.kind}/></Sequence>)}<Audio src={staticFile('audio/voiceover.mp3')}/></AbsoluteFill>;
const Root=()=> <Composition id="KatlaWorksReels" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={DURATION}/>;
registerRoot(Root);
