export const FPS = 30;
export const DURATION = 1095; // 36.5 seconds: 36.4408s audio fits
export const SCENES = [
  {start:0, end:155, title:'MALİYETLER', kind:'cost'},
  {start:155, end:300, title:'DAHA FAZLA MASRAF?', kind:'question'},
  {start:300, end:445, title:'ARTIK GEREK YOK', kind:'brand'},
  {start:445, end:700, title:'DİJİTAL HİZMETLER', kind:'services'},
  {start:700, end:900, title:'TEK ÇATI ALTINDA', kind:'bundle'},
  {start:900, end:1095, title:'DİJİTAL İŞLERİ BİZE BIRAK', kind:'cta'},
] as const;
