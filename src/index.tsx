import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DURATION, FPS, SCENES, SERVICES} from './timeline';
import {WORDS, cue} from './narration';
import {CostCounters, ServiceGraphic, ORANGE, CREAM, DARK} from './graphics';

const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const toFrame = (seconds:number) => Math.round(seconds*FPS);
function Word({text,at,accent=false}: {text:string;at:number;accent?:boolean}) {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame:frame-toFrame(at),fps,config:{damping:20,stiffness:280}});
  return <span data-word data-at={toFrame(at)} style={{display:'inline-block',marginRight:18,color:accent?ORANGE:CREAM,opacity:frame<toFrame(at)?0:0.3+0.7*Math.min(1,p),transform:`translateY(${(1-p)*30}px)`}}>{text}</span>;
}
function Line({words,size=94}: {words:readonly (readonly [string,number,boolean?])[];size?:number}) {
  return <div data-layout style={{fontSize:size,fontWeight:900,lineHeight:1.12,letterSpacing:-2,whiteSpace:'nowrap',marginBottom:16}}>{words.map(([text,at,accent])=><Word key={`${text}-${at}`} text={text} at={at} accent={accent}/>)}</div>;
}
function Logo({top=810,size=680,at=cue('Katla')}: {top?:number;size?:number;at?:number}) {
  const f=useCurrentFrame();
  const p=interpolate(f,[toFrame(at),toFrame(at)+9],[0,1],clamp);
  return <Img data-layout src={staticFile('images/katla-logo.jpg')} style={{position:'absolute',top,left:(1080-size)/2,width:size,height:size,objectFit:'cover',borderRadius:'50%',opacity:p,transform:`scale(${0.94+0.06*p})`,boxShadow:'0 0 70px #F28A3520'}}/>;
}
function Caption() {
  const f=useCurrentFrame();
  const active=WORDS.findIndex(w=>f>=toFrame(w.start)&&f<toFrame(w.end));
  if(active<0) return null;
  const phrase=WORDS[active].phrase;
  return <div data-layout style={{position:'absolute',left:86,right:86,top:1510,minHeight:112,fontSize:36,lineHeight:1.4,fontWeight:800,textAlign:'center',padding:'22px 20px',boxSizing:'border-box',borderRadius:18,background:'#090A0BEE'}}>
    {WORDS.filter(w=>w.phrase===phrase).map(w=><span key={w.start} style={{display:'inline-block',marginRight:9,color:f>=toFrame(w.start)&&f<toFrame(w.end)?ORANGE:CREAM}}>{w.text}</span>)}
  </div>;
}
function Panel({kind}: {kind:typeof SCENES[number]['kind']}) {
  const frame=useCurrentFrame();
  const scene=SCENES.find(s=>s.kind===kind)!;
  // Panel receives global frames; word cues remain on the unmodified audio clock.
  const local=frame-scene.start;
  const service=SERVICES.filter(s=>frame>=toFrame(s.at)).at(-1)??SERVICES[0];
  return <AbsoluteFill style={{overflow:'hidden'}}>
    <div data-layout style={{position:'absolute',left:86,right:86,top:365}}>
      {kind==='cost'&&<><Line size={87} words={[["PERSONEL",cue("personel")],["MAAŞI",cue("maaşı")]]}/><Line words={[["SİGORTA",cue("sigorta"),true]]}/><Line words={[["YEMEK",cue("yemek")],["+ YOL",cue("yol")]]}/></>}
      {kind==='question'&&<><Line words={[["DİJİTALDE",cue("dijitalde")]]}/><Line words={[["BÜYÜTMEK",cue("büyütmek"),true]]}/><Line words={[["İÇİN...",cue("için")]]}/></>}
      {kind==='reassure'&&<><Line words={[["ARTIK",cue("Artık")]]}/><Line words={[["GEREK",cue("gerek"),true],["YOK.",cue("yok"),true]]}/></>}
      {kind==='brand'&&<><Line words={[["KATLA",cue("Katla")],["WORKS",cue("Works"),true]]}/><Line size={61} words={[["DİJİTAL",cue("dijital")],["YÜKÜNÜ",cue("yükünü")]]}/><Line size={66} words={[["ÜSTLENİYORUZ.",cue("üstleniyoruz"),true]]}/></>}
      {kind==='services'&&<><div data-layout style={{fontSize:25,letterSpacing:4,color:ORANGE,marginBottom:32}}>TEK EKİP / DİJİTAL HİZMETLER</div>{service.kind==='web'&&<><Line size={90} words={[["WEB",cue("web"),true],["SİTESİ",cue("sitesi"),true]]}/><Line size={49} words={[["KURULUM",cue("kurulumu")],["+ YÖNETİM",cue("yönetimi")]]}/></>}
      {service.kind==='meta'&&<Line size={76} words={[["META",cue("Meta"),true],["REKLAMLARI",cue("reklamları"),true]]}/>}
      {service.kind==='social'&&<><Line size={86} words={[["SOSYAL",cue("Sosyal"),true],["MEDYA",cue("medya"),true]]}/><Line size={49} words={[["İÇERİK",cue("içerik")],["ÜRETİMİ",cue("üretimi")]]}/></>}
      {service.kind==='commerce'&&<><Line size={94} words={[["E-TİCARET",cue("e-ticaret"),true]]}/><Line size={49} words={[["OPERASYONLARI",cue("operasyonları")]]}/></>}</>}
      {kind==='bundle'&&<><Line words={[["HEPSİ",cue("Hepsi")]]}/><Line words={[["TEK",cue("tek"),true],["ÇATI",cue("çatı"),true]]}/><Line words={[["ALTINDA.",cue("altında")]]}/></>}
      {kind==='focus'&&<><Line words={[["İŞLETMENİ",cue("İşletmeni",1)]]}/><Line words={[["BÜYÜTMEYE",cue("büyütmeye"),true]]}/><Line words={[["ODAKLAN.",cue("odaklan")]]}/></>}
      {kind==='cta'&&<><Line size={82} words={[["DİJİTAL",cue("Dijital",1)],["İŞLERİ",cue("İşleri")]]}/><Line words={[["BİZE",cue("Bize"),true],["BIRAK.",cue("bırak"),true]]}/></>}
    </div>
    {kind==='cost'&&<CostCounters cues={[cue("personel"),cue("sigorta"),cue("yemek"),cue("yol")].map(toFrame)}/>}
    {kind==='question'&&<div data-layout style={{position:'absolute',top:990,left:86,right:86,padding:38,border:`3px solid ${ORANGE}`,borderRadius:22}}><Line size={49} words={[["BU",cue("bu"),true],["MALİYETLERİN",cue("maliyetlerin"),true]]}/><Line size={49} words={[["ALTINA",cue("altına")],["MI",cue("mı")],["GİRECEKSİN?",cue("gireceksin")]]}/></div>}
    {kind==='brand'&&<Logo/>}
    {kind==='services'&&frame>=toFrame(service.at)&&<ServiceGraphic key={service.kind} kind={service.kind} frame={frame-toFrame(service.at)}/>}
    {kind==='bundle'&&<div data-layout style={{position:'absolute',top:990,left:86,right:86,...{padding:36,borderRadius:24,background:'#201A15'}}}><Line size={51} words={[["AYRI",cue("ayrı")],["AYRI",cue("ayrı",1)],["PERSONEL",cue("personel",1)]]}/><Line size={51} words={[["ÇALIŞTIRMANA",cue("çalıştırmana")]]}/><Line size={66} words={[["GEREK",cue("gerek",1),true],["YOK.",cue("yok",1),true]]}/></div>}
    {kind==='cta'&&<><Logo top={740} size={530} at={cue("Dijital",1)}/><div data-layout style={{position:'absolute',top:1320,left:86,right:86,padding:30,background:ORANGE,borderRadius:18,textAlign:'center',fontWeight:900,fontSize:47,opacity:frame>=toFrame(cue("Katla",1))?1:0,color:DARK}}>DM’DEN KATLA YAZ!</div></>}
    <div style={{position:'absolute',left:86,right:86,bottom:180,height:5,background:'#FFFFFF25'}}><div style={{height:5,background:ORANGE,width:`${local/(scene.end-scene.start-1)*100}%`}}/></div>
  </AbsoluteFill>;
}
function Reel() {
  const frame=useCurrentFrame();
  const scene=SCENES.find(s=>frame>=s.start&&frame<s.end)!;
  const boundary=SCENES.slice(1).find(s=>Math.abs(frame-s.start)<=2)?.start;
  const wipe=boundary===undefined?0:interpolate(frame,[boundary-2,boundary,boundary+2],[0,1,0],clamp);
  return <AbsoluteFill data-reel data-frame={frame} style={{background:DARK,color:CREAM,fontFamily:'Arial, Helvetica, sans-serif'}}>
    <AbsoluteFill style={{background:'radial-gradient(circle at 80% 26%, #402315 0%, transparent 48%)'}}/>
    <div data-layout style={{position:'absolute',top:152,left:86,right:86,display:'flex',justifyContent:'space-between',fontWeight:800,letterSpacing:4,fontSize:28,color:ORANGE}}><span>KATLA / WORKS</span><span>BURSA • DİJİTAL</span></div>
    <div style={{position:'absolute',top:270,left:86,width:120,height:9,background:ORANGE}}/>
    <Panel kind={scene.kind}/>
    <Caption/>
    {boundary!==undefined&&<AbsoluteFill data-transition={boundary} style={{background:ORANGE,opacity:wipe,pointerEvents:'none'}}/>}
    <Audio src={staticFile('audio/voiceover.mp3')}/>
  </AbsoluteFill>;
}
const Root=()=> <Composition id="KatlaWorksReels" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={DURATION}/>;
registerRoot(Root);
