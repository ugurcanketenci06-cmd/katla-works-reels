export const FPS = 30;
export const DURATION = 1095;
// Cuts are centered in measured pauses. Orange wipe: boundary ±2 frames.
export const SCENES = [
  {start:0, end:154, title:'MALİYETLER', kind:'cost'},
  {start:154, end:284, title:'DAHA FAZLA MASRAF?', kind:'question'},
  {start:284, end:326, title:'ARTIK GEREK YOK', kind:'reassure'},
  {start:326, end:465, title:'KATLA WORKS', kind:'brand'},
  {start:465, end:690, title:'DİJİTAL HİZMETLER', kind:'services'},
  {start:690, end:858, title:'TEK ÇATI ALTINDA', kind:'bundle'},
  {start:858, end:912, title:'İŞLETMENİ BÜYÜT', kind:'focus'},
  {start:912, end:1095, title:'DİJİTALİ BİZE BIRAK', kind:'cta'},
] as const;
export const PAUSES = [
  {start:4.870295, end:5.415805},
  {start:9.276576, end:9.683810},
  {start:10.676780, end:11.040408},
  {start:15.330907, end:15.627868},
  {start:18.080272, end:18.320204},
  {start:19.339932, end:19.524898},
  {start:22.869048, end:23.125578},
  {start:24.660930, end:24.913651},
  {start:28.441587, end:28.751882},
  {start:30.296372, end:30.489546},
  {start:31.869524, end:32.117029},
  {start:33.996712, end:34.239206},
] as const;
export const SERVICES = [
  {kind:'web', at:15.6279, title:'WEB SİTESİ', detail:'KURULUM + YÖNETİM'},
  {kind:'meta', at:18.3202, title:'META REKLAMLARI', detail:'DOĞRU KİTLEYE ULAŞ'},
  {kind:'social', at:19.5249, title:'SOSYAL MEDYA', detail:'İÇERİK ÜRETİMİ'},
  {kind:'commerce', at:21.31, title:'E-TİCARET', detail:'OPERASYON YÖNETİMİ'},
] as const;
