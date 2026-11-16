import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const ORANGE = '#F28A35', CREAM = '#F4EBDD', DARK = '#090A0B';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const shell: React.CSSProperties = {border: '2px solid #F28A3544', borderRadius: 28, background: '#151414', padding: 32, boxSizing: 'border-box', overflow: 'hidden'};
const label: React.CSSProperties = {fontSize: 24, letterSpacing: 3, fontWeight: 700, color: ORANGE};

export function CostCounters({cues}: {cues: readonly number[]}) {
  const frame = useCurrentFrame();
  const labels = ['MAAŞ', 'SİGORTA', 'YEMEK', 'YOL'];
  const count = cues.filter(cue => frame >= cue).length;
  return <div data-layout style={{...shell, position: 'absolute', left: 86, right: 86, top: 890}}>
    <div style={label}>İŞLETMENİN GİDERLERİ</div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 22, margin: '20px 0 34px'}}>
      <span style={{fontSize: 120, fontWeight: 900, color: ORANGE, fontVariantNumeric: 'tabular-nums'}}>{String(count).padStart(2, '0')}</span>
      <span style={{fontSize: 35, fontWeight: 800}}>GİDER KALEMİ</span>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
      {labels.map((text, i) => {
        const p = interpolate(frame, [cues[i], cues[i]+10], [0, 1], clamp);
        return <div key={text} style={{padding: 22, borderRadius: 14, background: '#24201C', opacity: 0.2+0.8*p, transform: `translateY(${(1-p)*16}px)`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800}}><span>{text}</span><span style={{color: ORANGE}}>+₺</span></div>
          <div style={{height: 6, background: '#ffffff18', marginTop: 20}}><div style={{height: '100%', background: ORANGE, width: `${p*100}%`}}/></div>
        </div>;
      })}
    </div>
  </div>;
}

export function ServiceGraphic({kind, frame}: {kind: 'web'|'meta'|'social'|'commerce'; frame: number}) {
  const p = interpolate(frame, [0, 30], [0, 1], clamp);
  return <div data-layout style={{...shell, position: 'absolute', left: 86, right: 86, top: 820, height: 625}}>
    {kind === 'web' && <>
      <div style={{display:'flex', gap:10, borderBottom:'2px solid #ffffff18', paddingBottom:22}}>{[0,1,2].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',background:i===0?ORANGE:'#6D645C'}}/>)}<div style={{fontSize:20,marginLeft:20,color:'#BDAF9C'}}>katlaworks / dijital vitrin</div></div>
      <div style={{display:'flex',gap:30,marginTop:35}}>
        <div style={{flex:1}}><div style={label}>DİJİTALDE YERİNİ AL</div><div style={{fontSize:52,fontWeight:900,marginTop:20}}>İşin burada<br/>büyür.</div><div style={{height:12,width:`${p*85}%`,background:'#F4EBDD55',margin:'22px 0'}}/><div style={{display:'inline-block',background:ORANGE,color:DARK,padding:'18px 26px',borderRadius:12,fontWeight:900,fontSize:23}}>BİZE ULAŞ →</div></div>
        <div style={{width:240,height:300,borderRadius:22,background:'linear-gradient(140deg,#F28A35,#57311B)',transform:`translateY(${(1-p)*55}px)`,display:'grid',placeItems:'center',fontSize:100}}><svg width="110" height="110" viewBox="0 0 100 100" aria-label="Büyüme oku"><path d="M20 80 L80 20 M25 20 H80 V75" fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
      </div>
      <div style={{display:'flex',gap:20,marginTop:32}}>{[0,1,2].map(i=><div key={i} style={{height:80,flex:1,background:'#F4EBDD11',borderRadius:10,transform:`translateY(${(1-p)*(20+i*12)}px)`}}/>)}</div>
    </>}
    {kind === 'meta' && <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={label}>META / REKLAM YÖNETİMİ</div><span style={{fontSize:55,color:ORANGE}}>∞</span></div>
      <div style={{fontSize:40,fontWeight:900,margin:'20px 0'}}>Doğru kitleye ulaş.</div>
      <svg viewBox="0 0 760 340" width="100%" height="340" aria-label="Hareketli temsili reklam grafiği">
        {[70,150,230,310].map(y=><path key={y} d={`M20 ${y} H740`} stroke="#ffffff18"/>)}
        {[80,185,290,395,500,605].map((x,i)=>{const h=(60+i*34)*p;return <rect key={x} x={x} y={310-h} width="55" height={h} rx="8" fill={i===5?ORANGE:'#F28A3555'}/>;})}
        <path d="M20 280 L140 250 L250 265 L370 170 L480 195 L590 100 L735 35" fill="none" stroke={CREAM} strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
      </svg>
      <div style={{...label,fontSize:20}}>KİTLE → KAMPANYA → ÖLÇÜMLEME</div>
    </>}
    {kind === 'social' && <>
      <div style={label}>SOSYAL MEDYA / İÇERİK STÜDYOSU</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:25,marginTop:32}}>
        {[0,1,2].map(i=><div key={i} style={{width:210,height:370,borderRadius:24,border:`3px solid ${i===1?ORANGE:'#514135'}`,background:i===1?'linear-gradient(150deg,#593219,#1B1511)':'#211D19',transform:`translateY(${(i===1?-12:16)*p}px)`,padding:20,boxSizing:'border-box'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:ORANGE}}/><div style={{height:140,display:'grid',placeItems:'center',fontSize:58,color:ORANGE}}>▶</div><div style={{fontSize:24,fontWeight:900,lineHeight:1.4}}>{['FİKRİNİ','DİKKATİ','MARKANI'][i]}<br/>{['ANLAT.','YAKALA.','BÜYÜT.'][i]}</div><div style={{marginTop:22,fontSize:27,color:ORANGE}}>♡ ↗ +</div>
        </div>)}
      </div>
      <div style={{height:7,background:'#ffffff18',marginTop:36}}><div style={{height:7,background:ORANGE,width:`${p*100}%`}}/></div>
    </>}
    {kind === 'commerce' && <>
      <div style={label}>E-TİCARET / OPERASYON</div>
      <div style={{display:'flex',gap:26,marginTop:40}}>
        {[0,1,2].map(i=><div key={i} style={{flex:1,padding:20,background:'#26201A',borderRadius:18,transform:`translateY(${(1-p)*(20+i*5)}px)`}}><div style={{height:155,display:'grid',placeItems:'center',fontSize:90,color:ORANGE}}>□</div><div style={{height:10,background:'#F4EBDD55',margin:'16px 0'}}/><div style={{fontSize:26,fontWeight:800}}>ÜRÜN {i+1}</div></div>)}
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:38,fontSize:25,fontWeight:900}}>{['SEPET','SİPARİŞ','KARGO'].map((x,i)=><React.Fragment key={x}><span style={{color:p>i/3?ORANGE:CREAM,transform:`scale(${p>i/3?1.04:1})`}}>{x}</span>{i<2&&<span>→</span>}</React.Fragment>)}</div>
      <div style={{marginTop:38,padding:22,borderRadius:14,background:ORANGE,color:DARK,fontSize:26,fontWeight:900,textAlign:'center',opacity:p}}>✓ SÜREÇLER TEK YERDE</div>
    </>}
  </div>;
}
