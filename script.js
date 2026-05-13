/* =====================================================
   NIHON MURA RUNNER — script.js v5
   日本村ランナー — AAA Mobile Overhaul
   Created by rlzckyardnsyh
   ===================================================== */
'use strict';

// =====================================================
// § 1  CONFIG
// =====================================================
const CFG = {
  GROUND_Y_RATIO: 0.80,
  GRAVITY: 0.58,
  JUMP_FORCE: -14.5,
  DOUBLE_JUMP_FORCE: -12.0,
  DASH_SPEED: 13,
  DASH_DURATION: 160,
  DASH_COOLDOWN: 1000,
  SLIDE_DURATION: 550,
  BASE_SPEED: 5.2,
  SPEED_INC: 0.00022,
  MAX_SPEED: 13,
  SCORE_PER_FRAME: 0.14,
  COMBO_TIMEOUT: 3000,
  OBS_SPAWN_BASE: 130,
  ENM_SPAWN_BASE: 200,
  PWR_SPAWN_BASE: 480,
  COIN_SPAWN_BASE: 60,
  PLAYER_HP: 100,
  PLAYER_W: 34,
  PLAYER_H: 50,
  BULLET_SPD: 16,
  BULLET_DMG: 32,
  SHOOT_CD: 280,
  PARALLAX: [0.03, 0.08, 0.18, 0.32, 0.55],
};

const DIFF = {
  easy:   { spd:0.88, spawn:0.60, dmg:0.55, enmSpd:0.65 },
  medium: { spd:1.10, spawn:1.00, dmg:0.90, enmSpd:1.00 },
  hard:   { spd:1.45, spawn:1.55, dmg:1.50, enmSpd:1.45 },
};

// =====================================================
// § 2  CHARACTERS
// =====================================================
const CHARS = [
  { id:'kenji', name:'KENJI', role:'STREET OPS', rarity:'RARE',
    desc:'Ex-police officer turned village guardian. Balanced all-rounder with reliable accuracy.',
    spd:5, atk:5, hp:5, weapon:'Beretta M9',
    bodyColor:'#e8a855', jacketColor:'#2a4a6a', accentColor:'#f5c842', trailColor:'#f5c842',
    skillName:'STEADY AIM', skillDesc:'+15% bullet damage' },
  { id:'yuki', name:'YUKI', role:'CYBER NINJA', rarity:'EPIC',
    desc:'Former shinobi with enhanced reflexes. Fastest agent, razor-sharp evasion.',
    spd:9, atk:4, hp:3, weapon:'Compact SMG',
    bodyColor:'#f0c0c0', jacketColor:'#1a1a3a', accentColor:'#00d4ff', trailColor:'#00d4ff',
    skillName:'BLUR STEP', skillDesc:'Double dash distance' },
  { id:'ryu', name:'RYU', role:'HEAVY BREACHER', rarity:'RARE',
    desc:'Military-grade samurai. Slow but nothing can stop him.',
    spd:3, atk:8, hp:9, weapon:'Desert Eagle',
    bodyColor:'#c8a090', jacketColor:'#3a3020', accentColor:'#ff6b1a', trailColor:'#ff6b1a',
    skillName:'IRON SKIN', skillDesc:'-40% damage taken' },
  { id:'hana', name:'HANA', role:'RECON AGENT', rarity:'EPIC',
    desc:'Kunoichi specializing in evasion. Triple jump, agile under pressure.',
    spd:7, atk:5, hp:4, weapon:'Glock 17',
    bodyColor:'#e8b0d8', jacketColor:'#2a1a3a', accentColor:'#ff7fb8', trailColor:'#ff88cc',
    skillName:'SAKURA JUMP', skillDesc:'+1 extra jump' },
  { id:'kai', name:'KAI', role:'CYBER ENFORCER', rarity:'LEGENDARY',
    desc:'Augmented cyber-soldier. Blazing speed, plasma destruction.',
    spd:9, atk:7, hp:3, weapon:'Plasma Pistol',
    bodyColor:'#a0c8e8', jacketColor:'#0a1a2a', accentColor:'#00d4ff', trailColor:'#00aaff',
    skillName:'OVERCLOCK', skillDesc:'+30% speed burst on dash' },
  { id:'taro', name:'TARO', role:'IRON GUARDIAN', rarity:'RARE',
    desc:'Full tactical armor. Starts with shield. Slow, but invincible.',
    spd:2, atk:7, hp:10, weapon:'Heavy Revolver',
    bodyColor:'#b0a098', jacketColor:'#252015', accentColor:'#ff9a40', trailColor:'#ff8020',
    skillName:'FORTRESS', skillDesc:'Start with permanent shield' },
];

// =====================================================
// § 3  ENVIRONMENTS
// =====================================================
const ENVS = [
  { id:'spring', name:'SPRING DAY', icon:'🌸', jp:'春の昼',
    desc:'Cherry blossoms drift under a brilliant blue sky. Mt. Fuji gleams in crystal-clear air.',
    sky:['#1a88e8','#3aabf0','#70ccff','#99ddff','#c0eeff'],
    sun:'#ffffff', petal:'#ffb7c5', fogTint:'rgba(180,230,255,0.02)',
    roofColor:'#4a3828', wallColor:'rgba(218,188,132,0.92)',
    roadColor:'#b8a898', roadDark:'#807060', isBright:true,
    lamp:'rgba(255,220,130,0.75)', win:(r)=>`rgba(255,${235+r*15|0},${175+r*30|0},0.28)`,
    stars:false, moonSize:0,
    mountCol:['rgba(195,215,235,0.98)','rgba(138,165,198,0.95)','rgba(92,125,162,0.90)','rgba(68,92,128,0.78)'],
    cloudCol:'#ffffff', cloudAlpha:0.92 },
  { id:'night', name:'NIGHT VILLAGE', icon:'🌙', jp:'夜の村',
    desc:'Lantern light flickers along the stone path. Stars shimmer over the mountain silhouette.',
    sky:['#000510','#010820','#030f30','#060c22','#040010'],
    sun:'#c8e0ff', petal:'#ffccaa', fogTint:'rgba(5,10,30,0.22)',
    roofColor:'#2a1a0a', wallColor:'rgba(50,35,15,0.92)',
    roadColor:'#1a1008', roadDark:'#0a0804', isBright:false,
    lamp:'rgba(255,180,60,0.90)', win:(r)=>`rgba(255,${160+r*60|0},${60+r*60|0},0.55)`,
    stars:true, moonSize:38,
    mountCol:['rgba(15,18,32,0.95)','rgba(10,12,24,0.92)','rgba(8,10,18,0.95)','rgba(5,7,14,0.98)'],
    cloudCol:'rgba(30,40,80,1)', cloudAlpha:0.28 },
  { id:'rain', name:'RAINY VILLAGE', icon:'🌧', jp:'雨の村',
    desc:'Rain patters on tiled rooftops. The path glistens under paper lanterns.',
    sky:['#0a0f18','#121820','#1a2030','#1e2638','#202840'],
    sun:'#8899aa', petal:'#aaccee', fogTint:'rgba(20,35,60,0.25)', rain:true,
    roofColor:'#1e1410', wallColor:'rgba(60,45,25,0.88)',
    roadColor:'#0e0c08', roadDark:'#060504', isBright:false,
    lamp:'rgba(200,180,120,0.80)', win:(r)=>`rgba(200,${160+r*50|0},${80+r*40|0},0.38)`,
    stars:false, moonSize:22,
    mountCol:['rgba(25,32,45,0.88)','rgba(18,24,36,0.85)','rgba(14,18,28,0.90)','rgba(10,14,22,0.95)'],
    cloudCol:'rgba(30,40,60,1)', cloudAlpha:0.55 },
  { id:'morning', name:'DAWN VILLAGE', icon:'🌄', jp:'朝の村',
    desc:'Dawn mist rolls through the valley. Cherry blossoms drift on the spring breeze.',
    sky:['#200a3a','#5a1a5a','#e06028','#f0a030','#ffe070'],
    sun:'#fff0a0', petal:'#ffccaa', fogTint:'rgba(255,180,60,0.06)',
    roofColor:'#6a3a12', wallColor:'rgba(190,150,70,0.85)',
    roadColor:'#4a3212', roadDark:'#241808', isBright:false,
    lamp:'rgba(255,220,100,0.55)', win:(r)=>`rgba(255,${210+r*30|0},${90+r*80|0},0.28)`,
    stars:false, moonSize:18,
    mountCol:['rgba(120,80,40,0.82)','rgba(90,55,22,0.85)','rgba(65,35,10,0.88)','rgba(45,22,5,0.92)'],
    cloudCol:'rgba(255,180,100,1)', cloudAlpha:0.45 },
  { id:'cyber', name:'CYBER VILLAGE', icon:'💜', jp:'サイバー村',
    desc:'Ancient village meets dystopian neon. Tradition and cyber-punk collide.',
    sky:['#020008','#080018','#100030','#060018','#030008'],
    sun:'#ff00ff', petal:'#cc44ff', fogTint:'rgba(100,0,200,0.14)',
    roofColor:'#1a0028', wallColor:'rgba(40,0,60,0.9)',
    roadColor:'#0a0018', roadDark:'#04000c', isBright:false,
    lamp:'rgba(180,40,255,0.80)', win:(r)=>`rgba(${180+r*70|0},0,255,0.42)`,
    stars:true, moonSize:0,
    mountCol:['rgba(60,0,100,0.85)','rgba(40,0,70,0.88)','rgba(25,0,50,0.92)','rgba(15,0,32,0.96)'],
    cloudCol:'rgba(80,0,160,1)', cloudAlpha:0.35 },
];

// =====================================================
// § 4  SETTINGS
// =====================================================
const Settings = {
  musicVol:70, sfxVol:85, difficulty:'medium', particles:'high',
  charId:'kenji', envId:'spring', masterVol:100,
  _prevScreen:'menu',
  load(){
    try{
      const s=JSON.parse(localStorage.getItem('nmr_v5')||'{}');
      Object.keys(s).forEach(k=>{ if(this[k]!==undefined&&k[0]!=='_') this[k]=s[k]; });
    }catch(e){}
  },
  save(){
    try{
      localStorage.setItem('nmr_v5',JSON.stringify({
        musicVol:this.musicVol, sfxVol:this.sfxVol, masterVol:this.masterVol,
        difficulty:this.difficulty, particles:this.particles,
        charId:this.charId, envId:this.envId,
      }));
    }catch(e){}
  },
};
Settings.load();

// =====================================================
// § 5  STATE
// =====================================================
const S = {
  screen:'loading',
  score:0, hs:0, combo:0, maxCombo:0, comboTimer:0,
  speed:CFG.BASE_SPEED, frame:0, startTime:0, playTime:0,
  obsTimer:0, enmTimer:0, pwrTimer:0, coinTimer:0,
  diff:1, shakeX:0, shakeY:0, shakeDur:0, shakeMag:0,
  mx:400, my:300,
};

// =====================================================
// § 6  CANVAS
// =====================================================
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
let W=0, H=0, GY=0;
function resizeCanvas(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
  GY=H*CFG.GROUND_Y_RATIO;
  if(S.screen==='playing'||S.screen==='paused') genBG();
}
window.addEventListener('resize',resizeCanvas);
canvas.addEventListener('mousemove',e=>{ const r=canvas.getBoundingClientRect(); S.mx=e.clientX-r.left; S.my=e.clientY-r.top; });
canvas.addEventListener('click',e=>{ if(S.screen==='playing'){ const r=canvas.getBoundingClientRect(); S.mx=e.clientX-r.left; S.my=e.clientY-r.top; K.shoot=true; if(!aCtx)initAudio(); } });

// =====================================================
// § 7  INPUT
// =====================================================
const K={up:0,down:0,left:0,right:0,shift:0,jump:0,dash:0,slide:0,shoot:0};
const KMAP={'ArrowUp':'up','w':'up','W':'up','ArrowDown':'down','s':'down','S':'down','ArrowLeft':'left','a':'left','A':'left','ArrowRight':'right','d':'right','D':'right',' ':'up','Shift':'shift','ShiftLeft':'shift','ShiftRight':'shift'};
document.addEventListener('keydown',e=>{
  if(e.repeat) return;
  const k=KMAP[e.key];
  if(k){ if(!K[k]&&k==='up')K.jump=1; if(!K[k]&&k==='shift')K.dash=1; if(!K[k]&&k==='down')K.slide=1; K[k]=1; }
  if(e.key==='Escape'||e.key==='p'||e.key==='P'){ if(S.screen==='playing')pauseGame(); else if(S.screen==='paused')resumeGame(); }
  // Hanya block default untuk game keys — tidak block Ctrl+R, Ctrl+C, F5, dsb.
  if(k||(e.key==='Escape'&&S.screen==='playing')||(e.key==='p'&&S.screen==='playing')||(e.key==='P'&&S.screen==='playing')) e.preventDefault();
},{passive:false});
document.addEventListener('keyup',e=>{ const k=KMAP[e.key]; if(k)K[k]=0; });
function clearTrig(){ K.jump=0; K.dash=0; K.slide=0; K.shoot=0; }

// =====================================================
// § 8  AUDIO
// =====================================================
let aCtx=null, masterGain=null, musicGain=null, sfxGain=null;
function initAudio(){
  if(aCtx) return;
  try{
    aCtx=new(window.AudioContext||window.webkitAudioContext)();
    masterGain=aCtx.createGain(); masterGain.connect(aCtx.destination);
    musicGain=aCtx.createGain(); musicGain.connect(masterGain);
    sfxGain=aCtx.createGain(); sfxGain.connect(masterGain);
    applyVolumes();
    if(S.screen!=='playing') startMenuMusic();
  }catch(e){}
}
function applyVolumes(){
  if(!aCtx) return;
  const mt=Settings.masterVol/100;
  masterGain.gain.setTargetAtTime(mt,aCtx.currentTime,0.05);
  musicGain.gain.setTargetAtTime(Settings.musicVol/100*0.45*mt,aCtx.currentTime,0.05);
  sfxGain.gain.setTargetAtTime(Settings.sfxVol/100*0.9*mt,aCtx.currentTime,0.05);
}
function tone(freq,type='sine',dur=0.1,vol=0.15,delay=0,dest=null){
  if(!aCtx) return; const d=dest||(sfxGain||masterGain); if(!d) return;
  try{
    const o=aCtx.createOscillator(), g=aCtx.createGain();
    o.connect(g); g.connect(d); o.type=type;
    o.frequency.setValueAtTime(freq,aCtx.currentTime+delay);
    g.gain.setValueAtTime(Math.min(1,vol),aCtx.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(0.0001,aCtx.currentTime+delay+dur);
    o.start(aCtx.currentTime+delay); o.stop(aCtx.currentTime+delay+dur+0.02);
  }catch(e){}
}
function noise(dur=0.08,vol=0.1,freq=800,bw=200,delay=0){
  if(!aCtx||!sfxGain) return;
  try{
    const buf=aCtx.createBuffer(1,aCtx.sampleRate*dur,aCtx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    const src=aCtx.createBufferSource(), flt=aCtx.createBiquadFilter(), g=aCtx.createGain();
    flt.type='bandpass'; flt.frequency.value=freq; flt.Q.value=bw/freq;
    g.gain.setValueAtTime(vol,aCtx.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(0.0001,aCtx.currentTime+delay+dur);
    src.buffer=buf; src.connect(flt); flt.connect(g); g.connect(sfxGain);
    src.start(aCtx.currentTime+delay); src.stop(aCtx.currentTime+delay+dur+0.01);
  }catch(e){}
}
const SFX={
  jump:()=>{tone(420,'sine',0.09,0.2);tone(640,'sine',0.06,0.14,0.05);},
  dash:()=>{noise(0.1,0.18,600,300);tone(520,'sawtooth',0.1,0.1);},
  hurt:()=>{noise(0.15,0.28,200,150);tone(140,'sawtooth',0.18,0.2,0.05);},
  kill:()=>{tone(440,'sine',0.05,0.18);tone(660,'sine',0.05,0.16,0.06);tone(880,'sine',0.09,0.2,0.12);},
  coin:()=>{tone(900,'sine',0.04,0.16);tone(1200,'sine',0.04,0.13,0.03);},
  heart:()=>{tone(560,'sine',0.08,0.2);tone(700,'sine',0.07,0.18,0.06);},
  pickup:()=>{tone(680,'sine',0.1,0.2);tone(900,'sine',0.09,0.18,0.08);tone(1200,'sine',0.1,0.22,0.16);},
  shoot:()=>{noise(0.05,0.22,2000,800);tone(800,'sawtooth',0.04,0.12);},
  land:()=>{noise(0.05,0.14,300,200);},
  combo:()=>{tone(560,'sine',0.05,0.16);tone(780,'sine',0.05,0.14,0.05);},
  ui:()=>{tone(480,'sine',0.06,0.12);},
  go:()=>{tone(200,'sawtooth',0.3,0.22);tone(140,'sawtooth',0.25,0.2,0.18);},
  enemyHit:()=>{noise(0.06,0.18,400,200);tone(280,'square',0.06,0.14,0.02);},
  enemyShoot:()=>{noise(0.05,0.14,1500,600);tone(600,'sawtooth',0.04,0.1);},
  step:()=>{noise(0.03,0.06,150,100);},
  explosion:()=>{noise(0.18,0.3,150,200);tone(80,'sawtooth',0.3,0.25,0.05);},
};

let musicInt=null, mStep=0, stepTimer=0;
const M_NOTES=[293,329,370,440,493,440,370,329,293,247,220,247,329,370,440];
const M_BASS=[73,73,98,73,65,65,73,98];
const M_HI=[880,1047,880,784,880,784,660,880];
function startMusic(){
  if(!aCtx) return; stopMusic(); mStep=0;
  musicInt=setInterval(()=>{
    if(S.screen!=='playing') return;
    const n=M_NOTES[mStep%M_NOTES.length], b=M_BASS[mStep%M_BASS.length];
    tone(n,'sine',0.38,0.32,0,musicGain); tone(b,'sawtooth',0.5,0.16,0,musicGain);
    if(mStep%2===0) tone(M_HI[mStep%M_HI.length],'sine',0.12,0.08,0.18,musicGain);
    if(mStep%8===0) tone(b*0.5,'sine',0.5,0.12,0.1,musicGain);
    mStep++;
  },320);
}
function startMenuMusic(){
  if(!aCtx) return; stopMusic(); mStep=0;
  musicInt=setInterval(()=>{
    if(S.screen==='playing') return;
    const n=M_NOTES[mStep%M_NOTES.length];
    tone(n,'sine',0.65,0.13,0,musicGain);
    if(mStep%5===0) tone(n*0.5,'sine',0.7,0.07,0.25,musicGain);
    if(mStep%7===0) tone(n*3,'sine',0.18,0.05,0.12,musicGain);
    mStep++;
  },460);
}
function stopMusic(){ if(musicInt){clearInterval(musicInt);musicInt=null;} }
function maybeStep(){
  if(!Player.onGround||S.screen!=='playing') return;
  stepTimer++;
  const iv=Math.max(8,16-Math.floor(S.speed*0.8));
  if(stepTimer>=iv){stepTimer=0;SFX.step();}
}

// =====================================================
// § 9  PARTICLES
// =====================================================
let P_pool=[];
function emit(x,y,col,n=8,o={}){
  const lim=Settings.particles==='low'?Math.ceil(n*0.5):n;
  for(let i=0;i<lim;i++){
    const a=Math.random()*Math.PI*2, spd=(o.spd||3)*(0.5+Math.random());
    P_pool.push({ x,y, vx:Math.cos(a)*spd, vy:Math.sin(a)*spd-(o.up||0), col,
      alpha:1, sz:(o.sz||3)*(0.6+Math.random()*0.8), life:o.life||40, maxLife:o.life||40,
      glow:o.glow!==false, grav:o.grav!==false, shape:o.shape||'c',
      rot:Math.random()*Math.PI*2, rotSpd:(Math.random()-0.5)*0.1 });
  }
}
function emitExplosion(x,y,col='#ff8820'){
  if(Settings.particles==='low') return;
  emit(x,y,col,18,{spd:6,sz:4,up:2,life:30});
  emit(x,y,'#ffe080',8,{spd:3,sz:2,life:18,grav:false});
  SFX.explosion(); shake(5,250);
}
let sakTimer=0;
function emitSakura(){
  if(Math.random()<0.2){ const env=getEnv();
    P_pool.push({ x:Math.random()*W, y:-10,
      vx:(Math.random()-0.5)*1.4-S.speed*0.12, vy:0.55+Math.random()*0.85,
      col:env.petal, alpha:0.55+Math.random()*0.4, sz:2.5+Math.random()*4.5,
      life:260+Math.random()*200, maxLife:460, glow:false, grav:false,
      shape:'s', rot:Math.random()*Math.PI*2, rotSpd:(Math.random()-0.5)*0.06 }); }
}
function emitDust(x,y){
  if(Settings.particles==='low'||Math.random()>0.3) return;
  P_pool.push({ x:x+(-5+Math.random()*10), y,
    vx:(Math.random()-0.5)*1.0-0.4, vy:-0.3-Math.random()*0.7,
    col:'rgba(160,130,80,0.45)', alpha:0.4, sz:2+Math.random()*3,
    life:28+Math.random()*18, maxLife:46, glow:false, grav:false, shape:'c', rot:0, rotSpd:0 });
}
function updateP(){
  for(let i=P_pool.length-1;i>=0;i--){
    const p=P_pool[i]; p.x+=p.vx; p.y+=p.vy;
    if(p.grav) p.vy+=0.2; if(p.shape!=='s') p.vx*=0.95;
    if(p.rot!==undefined) p.rot+=p.rotSpd;
    p.life--; p.alpha=p.life/p.maxLife;
    if(p.life<=0||P_pool.length>400) P_pool.splice(i,1);
  }
}
function drawP(){
  for(const p of P_pool){
    ctx.save(); ctx.globalAlpha=p.alpha;
    if(p.glow){ctx.shadowBlur=p.sz*3;ctx.shadowColor=p.col;}
    ctx.fillStyle=p.col;
    if(p.shape==='s'){
      ctx.translate(p.x,p.y); ctx.rotate(p.rot||0);
      ctx.beginPath(); ctx.ellipse(0,0,p.sz,p.sz*0.5,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(p.sz*0.5,-p.sz*0.3,p.sz*0.55,p.sz*0.28,0.8,0,Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
}

// =====================================================
// § 10  FLOATING TEXTS
// =====================================================
let FT=[];
function floatText(x,y,txt,col='#f5c842',sz=18){
  FT.push({x,y,txt,col,sz,alpha:1,vy:-2.5,life:70});
}
function updateFT(){
  for(let i=FT.length-1;i>=0;i--){
    const t=FT[i]; t.y+=t.vy; t.vy*=0.92; t.life--; t.alpha=t.life/70;
    if(t.life<=0) FT.splice(i,1);
  }
}
function drawFT(){
  for(const t of FT){
    ctx.save(); ctx.globalAlpha=t.alpha;
    ctx.font=`bold ${t.sz}px 'Orbitron',sans-serif`;
    ctx.fillStyle=t.col; ctx.shadowBlur=12; ctx.shadowColor=t.col;
    ctx.textAlign='center'; ctx.fillText(t.txt,t.x,t.y); ctx.restore();
  }
}

// =====================================================
// § 11  TERRAIN
// =====================================================
let platforms=[], terrOff=0, nextTerrX=0;
function initTerrain(){
  platforms=[]; terrOff=0; nextTerrX=900;
  for(let i=0;i<14;i++){
    const pw=70+Math.random()*105;
    platforms.push({x:450+i*310+Math.random()*110, y:GY-(82+Math.random()*88), w:pw, h:14});
  }
}
function updateTerrain(){
  terrOff+=S.speed;
  for(let i=platforms.length-1;i>=0;i--){
    if(platforms[i].x-terrOff+platforms[i].w<-80) platforms.splice(i,1);
  }
  while(nextTerrX-terrOff<W+600){
    const pw=70+Math.random()*110;
    platforms.push({x:nextTerrX, y:GY-(80+Math.random()*90), w:pw, h:14});
    nextTerrX+=270+Math.random()*230;
  }
}
function checkPlatColl(){
  if(Player.onGround||Player.vy<=0) return;
  for(const p of platforms){
    const px=p.x-terrOff;
    const bot=Player.y+Player.h, prevBot=bot-Player.vy;
    if(Player.x+Player.w>px&&Player.x<px+p.w&&prevBot<=p.y&&bot>=p.y){
      Player.y=p.y-Player.h; Player.vy=0; Player.onGround=true; Player.jumping=false; SFX.land();
    }
  }
}

// =====================================================
// § 12  BACKGROUND — Stable, no flicker
// =====================================================
let bgLayers=[], clouds=[], raindrops=[], worldOff=0;
function getEnv(){ return ENVS.find(e=>e.id===Settings.envId)||ENVS[0]; }

function genBG(){
  bgLayers=[]; clouds=[];
  const env=getEnv();
  // Mountains
  const mts=[]; let mx=0;
  while(mx<W*4+600){
    const mw=110+Math.random()*200, mh=(0.07+Math.random()*0.17)*H;
    mts.push({x:mx, y:GY-mh, w:mw, h:mh, snow:mh>H*0.12}); mx+=mw-18;
  }
  bgLayers.push({items:mts, off:0, spd:CFG.PARALLAX[0]});
  // Mid buildings
  const mid=[]; let bx=0;
  while(bx<W*4+600){
    const bw=48+Math.random()*105, bh=(0.10+Math.random()*0.30)*H;
    mid.push({x:bx, y:GY-bh, w:bw, h:bh,
      wc:env.win(Math.random()), rc:env.roofColor, wall:env.wallColor,
      sign:Math.random()<0.4,
      signTxt:['居酒屋','茶屋','和食','旅館','酒屋','薬局','魚屋','神社','書店','花屋','蕎麦','銭湯'][Math.floor(Math.random()*12)],
      cables:Math.random()<0.5, hasSakura:Math.random()<0.25});
    bx+=bw+6+Math.random()*28;
  }
  bgLayers.push({items:mid, off:0, spd:CFG.PARALLAX[1]});
  // Near buildings
  const near=[]; bx=0;
  while(bx<W*4+600){
    const bw=55+Math.random()*115, bh=(0.18+Math.random()*0.40)*H;
    near.push({x:bx, y:GY-bh, w:bw, h:bh,
      wc:env.win(Math.random()), rc:env.roofColor, wall:env.wallColor,
      sign:Math.random()<0.5,
      signTxt:['ラーメン','うどん','すし','天ぷら','カフェ','酒場','食堂'][Math.floor(Math.random()*7)],
      cableFrom:Math.random()<0.6, hasSakura:Math.random()<0.2});
    bx+=bw+10+Math.random()*42;
  }
  bgLayers.push({items:near, off:0, spd:CFG.PARALLAX[2]});
  // Clouds
  for(let i=0;i<9;i++) clouds.push({x:Math.random()*W*2, y:H*(0.03+Math.random()*0.18), w:60+Math.random()*160, h:14+Math.random()*36, a:0.07+Math.random()*0.14, type:Math.floor(Math.random()*2)});
  // Rain
  const env2=getEnv();
  if(env2.rain){ raindrops=[]; for(let i=0;i<170;i++) raindrops.push({x:Math.random()*W, y:Math.random()*H, len:7+Math.random()*13, spd:9+Math.random()*7, a:0.06+Math.random()*0.1}); }
}
function updateBG(){
  worldOff+=S.speed;
  bgLayers.forEach(l=>{
    l.off+=S.speed*l.spd;
    l.items.forEach(b=>{
      if(b.x-l.off+b.w<-120){
        const rm=l.items.reduce((m,b2)=>Math.max(m,b2.x),0);
        b.x=rm+b.w+Math.random()*40;
      }
    });
  });
  clouds.forEach(c=>{ c.x-=0.14*S.speed*0.12; if(c.x+c.w<-80) c.x=W+80; });
  sakTimer++; if(sakTimer%3===0) emitSakura();
  if(Player.onGround&&S.screen==='playing') emitDust(Player.x+Player.w*0.5,GY);
  const env=getEnv();
  if(env.rain) raindrops.forEach(r=>{ r.y+=r.spd; r.x-=2.5; if(r.y>H){r.y=-10;r.x=Math.random()*W;} if(r.x<0)r.x=W; });
}

function drawJpBuilding(c,b,bx,env){
  const by=b.y, bw=b.w, bh=b.h;
  const wg=c.createLinearGradient(bx,by,bx+bw,by+bh);
  wg.addColorStop(0,b.wall||'rgba(190,150,70,0.8)'); wg.addColorStop(1,'rgba(0,0,0,0.7)');
  c.fillStyle=wg; c.fillRect(bx,by,bw,bh);
  c.strokeStyle='rgba(60,35,5,0.3)'; c.lineWidth=1;
  for(let wi=1;wi<4;wi++){ const wx=bx+bw*wi/4; c.beginPath(); c.moveTo(wx,by); c.lineTo(wx,by+bh); c.stroke(); }
  const wr=Math.floor(bh/22), wc_=Math.floor(bw/20);
  for(let row=0;row<wr;row++) for(let col=0;col<wc_;col++){
    if(((row*wc_+col)*1237+17)%100<44){
      const wx=bx+col*20+4, wy=by+row*22+5;
      c.fillStyle=b.wc||'rgba(255,180,60,0.25)'; c.fillRect(wx,wy,14,15);
      c.strokeStyle='rgba(80,50,10,0.5)'; c.lineWidth=0.5; c.strokeRect(wx,wy,14,15);
      c.beginPath(); c.moveTo(wx+7,wy); c.lineTo(wx+7,wy+15); c.stroke();
      c.beginPath(); c.moveTo(wx,wy+7); c.lineTo(wx+14,wy+7); c.stroke();
    }
  }
  const roofH=Math.max(12,bh*0.2);
  c.fillStyle=b.rc||'#7a3a10'; c.shadowBlur=0;
  c.beginPath(); c.moveTo(bx-5,by); c.lineTo(bx+bw/2,by-roofH); c.lineTo(bx+bw+5,by); c.closePath(); c.fill();
  c.fillStyle='rgba(50,25,5,0.85)'; c.fillRect(bx-5,by-2,bw+10,4);
  if(b.sign&&b.signTxt){
    c.fillStyle='rgba(190,50,15,0.9)'; c.shadowBlur=5; c.shadowColor='rgba(230,60,15,0.5)';
    rRect(c,bx+bw*0.22,by+bh*0.1,bw*0.56,bh*0.12,3); c.fill(); c.shadowBlur=0;
    c.font=`bold ${Math.min(11,bw*0.2)}px 'Noto Serif JP',serif`;
    c.fillStyle='#fffde0'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText(b.signTxt,bx+bw*0.5,by+bh*0.16);
    for(let ni=0;ni<4;ni++){
      const nx=bx+bw*0.22+ni*(bw*0.56/4);
      c.fillStyle=`rgba(${170+ni*10},${40+ni*5},${10+ni*5},0.85)`;
      c.fillRect(nx+1,by+bh*0.24,bw*0.56/4-2,bh*0.1);
    }
  }
  if(b.cables&&bw>50){
    c.strokeStyle='rgba(20,15,10,0.48)'; c.lineWidth=0.8;
    c.beginPath(); c.moveTo(bx,by+bh*0.28); c.quadraticCurveTo(bx+bw*0.5,by+bh*0.34,bx+bw,by+bh*0.28); c.stroke();
  }
  if(b.hasSakura){
    c.fillStyle='rgba(255,183,197,0.72)'; c.shadowBlur=5; c.shadowColor='rgba(255,180,200,0.5)';
    c.beginPath(); c.arc(bx+bw/2,by-roofH-8,10,0,Math.PI*2); c.fill(); c.shadowBlur=0;
  }
}

function drawBG(){
  const env=getEnv(), sc=env.sky;
  // ── SKY GRADIENT ──
  const sg=ctx.createLinearGradient(0,0,0,GY);
  sc.forEach((c,i)=>sg.addColorStop(i/(sc.length-1),c));
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,GY);

  // ── STARS (night / cyber) ──
  if(env.stars){
    ctx.save();
    for(let si=0;si<120;si++){
      const sx2=((si*137+worldOff*0.01)%W+W)%W;
      const sy2=((si*89+11)%Math.round(GY*0.75));
      const sa=0.4+0.5*Math.sin(Date.now()*0.0008+si);
      const sr=si%7===0?1.8:0.9;
      ctx.globalAlpha=sa*(env.id==='cyber'?0.8:1);
      ctx.fillStyle=env.id==='cyber'?['#ff88ff','#88ffff','#ffff88','#ffffff'][si%4]:'#ffffff';
      ctx.shadowBlur=env.id==='cyber'?8:3; ctx.shadowColor=ctx.fillStyle;
      ctx.beginPath(); ctx.arc(sx2,sy2,sr,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // ── MOON (night/rain) ──
  if(env.moonSize>0){
    const mx2=W*0.78, my2=GY*0.18;
    ctx.save();
    const mHalo=ctx.createRadialGradient(mx2,my2,0,mx2,my2,env.moonSize*3);
    mHalo.addColorStop(0,'rgba(200,220,255,0.18)'); mHalo.addColorStop(1,'transparent');
    ctx.fillStyle=mHalo; ctx.fillRect(mx2-env.moonSize*3,my2-env.moonSize*3,env.moonSize*6,env.moonSize*6);
    ctx.beginPath(); ctx.arc(mx2,my2,env.moonSize,0,Math.PI*2);
    const mg=ctx.createRadialGradient(mx2-env.moonSize*0.3,my2-env.moonSize*0.3,0,mx2,my2,env.moonSize);
    mg.addColorStop(0,'#eef4ff'); mg.addColorStop(0.6,'#c8dcf8'); mg.addColorStop(1,'rgba(180,200,240,0.7)');
    ctx.fillStyle=mg; ctx.shadowBlur=40; ctx.shadowColor='rgba(180,210,255,0.7)'; ctx.fill();
    ctx.restore();
  }

  // ── SUN / DAWN GLOW ──
  if(env.id!=='night'&&env.id!=='rain'){
    const isCyber=env.id==='cyber';
    const sx=W*0.72, sy=GY*(env.id==='morning'?0.32:0.20);
    const sHalo=ctx.createRadialGradient(sx,sy,0,sx,sy,isCyber?100:180);
    sHalo.addColorStop(0,isCyber?'rgba(255,0,255,0.28)':'rgba(255,252,210,0.32)');
    sHalo.addColorStop(1,'transparent');
    ctx.fillStyle=sHalo; ctx.fillRect(sx-200,sy-200,400,400);
    if(env.id!=='morning'||(env.id==='morning')){
      ctx.save(); ctx.beginPath(); ctx.arc(sx,sy,env.id==='morning'?28:42,0,Math.PI*2);
      const sd2=ctx.createRadialGradient(sx,sy,0,sx,sy,42);
      if(isCyber){ sd2.addColorStop(0,'#ff88ff'); sd2.addColorStop(1,'#aa00ff'); }
      else if(env.id==='morning'){ sd2.addColorStop(0,'#fffce0'); sd2.addColorStop(1,'#ffcc44'); }
      else { sd2.addColorStop(0,'#ffffff'); sd2.addColorStop(0.4,'#fffce0'); sd2.addColorStop(1,'#ffe060'); }
      ctx.fillStyle=sd2; ctx.shadowBlur=60; ctx.shadowColor=env.sun; ctx.fill(); ctx.restore();
    }
  }

  // ── CYBER NEON GRID ──
  if(env.id==='cyber'){
    ctx.save(); ctx.strokeStyle='rgba(180,0,255,0.12)'; ctx.lineWidth=1;
    for(let gx2=(worldOff*0.05)%60;gx2<W;gx2+=60){ ctx.beginPath(); ctx.moveTo(gx2,0); ctx.lineTo(gx2,GY); ctx.stroke(); }
    for(let gy2=0;gy2<GY;gy2+=40){ ctx.beginPath(); ctx.moveTo(0,gy2); ctx.lineTo(W,gy2); ctx.stroke(); }
    ctx.restore();
  }

  // ── ANIME CLOUDS ──
  function drawCloud(cx2,cy2,cw2,ch2,alpha,col){
    ctx.save(); ctx.globalAlpha=alpha;
    ctx.fillStyle='rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(cx2+cw2/2,cy2+ch2*0.88,cw2*0.44,ch2*0.18,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=col;
    const np=Math.max(3,Math.ceil(cw2/28));
    for(let pi=0;pi<np;pi++){
      const px2=cx2+pi*(cw2/(np-0.5));
      const pr2=ch2*(0.52+0.26*Math.sin(pi*2.1+1));
      ctx.beginPath(); ctx.arc(px2,cy2+ch2*0.26,pr2*0.70,0,Math.PI*2); ctx.fill();
    }
    ctx.beginPath(); ctx.ellipse(cx2+cw2/2,cy2+ch2*0.66,cw2*0.46,ch2*0.36,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  clouds.forEach(c=>drawCloud(c.x,c.y,c.w,c.h,env.cloudAlpha??0.88,env.cloudCol??'#ffffff'));

  // ── MT. FUJI / MOUNTAIN ──
  const fjX=W*0.60, fjBase=GY*0.98, fjW=W*0.56, fjH=GY*0.74;
  const mc=env.mountCol||['rgba(140,150,165,0.90)','rgba(100,115,138,0.88)','rgba(72,85,110,0.88)','rgba(50,62,85,0.82)'];
  ctx.save();
  // Haze layer
  const haze=ctx.createLinearGradient(fjX,fjBase-fjH*0.6,fjX,fjBase);
  haze.addColorStop(0,mc[0].replace(/[\d.]+\)$/,'0.15)')); haze.addColorStop(1,'transparent');
  ctx.fillStyle=haze;
  ctx.beginPath(); ctx.moveTo(fjX-fjW*0.63,fjBase); ctx.lineTo(fjX-fjW*0.11,fjBase-fjH*0.52); ctx.lineTo(fjX,fjBase-fjH); ctx.lineTo(fjX+fjW*0.14,fjBase-fjH*0.48); ctx.lineTo(fjX+fjW*0.63,fjBase); ctx.closePath(); ctx.fill();
  // Main body
  const fjG=ctx.createLinearGradient(fjX,fjBase-fjH,fjX,fjBase);
  fjG.addColorStop(0,mc[0]); fjG.addColorStop(0.22,mc[1]); fjG.addColorStop(0.60,mc[2]); fjG.addColorStop(1,mc[3]);
  ctx.fillStyle=fjG;
  ctx.beginPath(); ctx.moveTo(fjX-fjW*0.62,fjBase); ctx.lineTo(fjX-fjW*0.13,fjBase-fjH*0.54); ctx.lineTo(fjX,fjBase-fjH); ctx.lineTo(fjX+fjW*0.16,fjBase-fjH*0.50); ctx.lineTo(fjX+fjW*0.62,fjBase); ctx.closePath(); ctx.fill();
  // Right-shadow
  ctx.globalAlpha=0.20; ctx.fillStyle='rgba(0,0,30,1)';
  ctx.beginPath(); ctx.moveTo(fjX+fjW*0.06,fjBase-fjH*0.60); ctx.lineTo(fjX+fjW*0.62,fjBase); ctx.lineTo(fjX,fjBase); ctx.closePath(); ctx.fill();
  ctx.globalAlpha=1;
  // Snow cap (only for bright/dawn envs)
  if(env.id==='spring'||env.id==='morning'||env.id==='rain'){
    ctx.fillStyle=env.id==='rain'?'rgba(200,215,230,0.80)':'rgba(248,253,255,0.97)';
    ctx.beginPath(); ctx.moveTo(fjX-fjW*0.10,fjBase-fjH*0.72); ctx.bezierCurveTo(fjX-fjW*0.05,fjBase-fjH*0.83,fjX-fjW*0.01,fjBase-fjH*0.90,fjX,fjBase-fjH); ctx.bezierCurveTo(fjX+fjW*0.03,fjBase-fjH*0.87,fjX+fjW*0.08,fjBase-fjH*0.77,fjX+fjW*0.12,fjBase-fjH*0.67); ctx.lineTo(fjX+fjW*0.04,fjBase-fjH*0.58); ctx.lineTo(fjX,fjBase-fjH*0.64); ctx.lineTo(fjX-fjW*0.04,fjBase-fjH*0.57); ctx.closePath(); ctx.fill();
    ctx.globalAlpha=0.55; ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.moveTo(fjX-fjW*0.02,fjBase-fjH*0.90); ctx.lineTo(fjX,fjBase-fjH); ctx.lineTo(fjX+fjW*0.025,fjBase-fjH*0.88); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
  }
  // Night: glowing summit
  if(env.id==='night'){ ctx.strokeStyle='rgba(120,160,220,0.25)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(fjX-fjW*0.62,fjBase); ctx.lineTo(fjX,fjBase-fjH); ctx.lineTo(fjX+fjW*0.62,fjBase); ctx.stroke(); }
  // Cyber: neon outline
  if(env.id==='cyber'){ ctx.strokeStyle='rgba(200,0,255,0.45)'; ctx.lineWidth=2; ctx.shadowBlur=12; ctx.shadowColor='#ff00ff'; ctx.beginPath(); ctx.moveTo(fjX-fjW*0.62,fjBase); ctx.lineTo(fjX,fjBase-fjH); ctx.lineTo(fjX+fjW*0.62,fjBase); ctx.stroke(); ctx.shadowBlur=0; }
  ctx.restore();

  // ── GREEN HILLS (spring/morning only) ──
  if(env.isBright||env.id==='morning'){
    ctx.save(); ctx.globalAlpha=env.id==='morning'?0.50:0.68;
    const hG=ctx.createLinearGradient(0,GY*0.52,0,GY*0.80);
    hG.addColorStop(0,'rgba(68,138,48,0.88)'); hG.addColorStop(1,'rgba(44,98,22,0.60)');
    ctx.fillStyle=hG; ctx.beginPath(); ctx.moveTo(-10,GY*0.80);
    const hOff2=(worldOff*0.04)%W;
    for(let hx=-hOff2;hx<=W+W;hx+=W/14) ctx.lineTo(hx,GY*(0.52+0.09*Math.sin(hx*0.016+0.8)));
    ctx.lineTo(W+10,GY*0.80); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  // ── TREELINE ──
  ctx.save(); ctx.globalAlpha=env.isBright?0.65:0.40;
  const tOff3=(worldOff*0.10)%90;
  for(let ti=0;ti<Math.ceil(W/38)+3;ti++){
    const tx=ti*38-tOff3;
    const th=22+((ti*7)%18);
    const tr=env.id==='cyber'?`rgba(80,0,160,0.80)`:env.id==='night'?`rgba(12,18,30,0.90)`:`rgba(38,${100+((ti*9)%40)|0},22,0.82)`;
    ctx.fillStyle=tr;
    ctx.beginPath(); ctx.arc(tx,GY*0.79,th*0.52,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // ── BG BUILDINGS (mid + near layers) ──
  const mL=bgLayers[1];
  if(mL) mL.items.forEach(b=>{
    const bx=b.x-mL.off; if(bx+b.w<-5||bx>W+5) return;
    ctx.save(); ctx.globalAlpha=0.60; drawJpBuilding(ctx,b,bx,env); ctx.restore();
  });
  const nL=bgLayers[2];
  if(nL) nL.items.forEach(b=>{
    const bx=b.x-nL.off; if(bx+b.w<-5||bx>W+5) return;
    ctx.save(); ctx.globalAlpha=0.92; drawJpBuilding(ctx,b,bx,env); ctx.restore();
  });

  drawRoad(); drawVillageDecos();

  ctx.fillStyle=env.fogTint; ctx.fillRect(0,0,W,H);
  const fg=ctx.createLinearGradient(0,GY-12,0,GY+22);
  fg.addColorStop(0,'transparent'); fg.addColorStop(1,'rgba(6,3,1,0.28)');
  ctx.fillStyle=fg; ctx.fillRect(0,GY-12,W,34);

  // ── RAIN ──
  if(env.rain){
    ctx.save(); ctx.strokeStyle='rgba(180,220,255,0.70)'; ctx.lineWidth=0.8;
    raindrops.forEach(r=>{ctx.globalAlpha=r.a;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-2.5,r.y+r.len);ctx.stroke();});
    ctx.restore();
  }
  // ── CYBER NEON SCAN LINE ──
  if(env.id==='cyber'){
    const scanY=(Date.now()*0.04)%(H);
    const scanG=ctx.createLinearGradient(0,scanY-30,0,scanY+30);
    scanG.addColorStop(0,'transparent'); scanG.addColorStop(0.5,'rgba(180,0,255,0.06)'); scanG.addColorStop(1,'transparent');
    ctx.fillStyle=scanG; ctx.fillRect(0,scanY-30,W,60);
  }
}

function drawRoad(){
  const env=getEnv();
  ctx.fillStyle=env.roadColor||'#5a4020'; ctx.fillRect(0,GY,W,H-GY);
  ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=0.8;
  const coff=(worldOff%30)|0;
  for(let cx=-coff;cx<W+30;cx+=30){
    for(let cy=GY+3;cy<GY+38;cy+=13) ctx.strokeRect(cx+(cy%26===3?0:15),cy,26,10);
  }
  ctx.strokeStyle='rgba(180,140,60,0.38)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();
  ctx.fillStyle='rgba(55,110,15,0.65)'; ctx.fillRect(0,GY,W,4);
  platforms.forEach(p=>{
    const px=p.x-terrOff; if(px+p.w<-5||px>W+5) return;
    ctx.save();
    const pg=ctx.createLinearGradient(px,p.y,px,p.y+p.h);
    pg.addColorStop(0,'#a07040'); pg.addColorStop(1,'#5a3010');
    ctx.fillStyle=pg; rRect(ctx,px,p.y,p.w,p.h,3); ctx.fill();
    ctx.fillStyle='rgba(60,120,15,0.8)'; ctx.fillRect(px,p.y,p.w,4);
    ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=1;
    for(let bx=px+16;bx<px+p.w;bx+=16){ctx.beginPath();ctx.moveTo(bx,p.y);ctx.lineTo(bx,p.y+p.h);ctx.stroke();}
    ctx.globalAlpha=0.14; ctx.fillStyle='#000'; ctx.fillRect(px+3,p.y+p.h,p.w-3,4);
    ctx.restore();
  });
}

// Village decorations — stable, no flicker
let villageDecos=[];
function initVillageDecos(){
  villageDecos=[];
  const types=['sakura','lantern','lantern','fence','barrel','vending','shrine_gate','bamboo','sign','pole','well','cart'];
  let accum=0;
  for(let i=0;i<30;i++){
    accum+=220+Math.floor(Math.random()*380);
    villageDecos.push({type:types[Math.floor(Math.random()*types.length)], worldX:accum});
  }
}
function drawVillageDecos(){
  const env=getEnv();
  villageDecos.forEach(dec=>{
    const raw=dec.worldX-worldOff*0.92;
    const span=W*3+3000;
    const dx=((raw%span)+span)%span-200;
    if(dx<-80||dx>W+80) return;
    ctx.save();
    switch(dec.type){
      case 'sakura':      dSakura(ctx,dx,GY,env); break;
      case 'lantern':     dLantern(ctx,dx,GY,env); break;
      case 'fence':       dFence(ctx,dx,GY); break;
      case 'barrel':      dBarrel(ctx,dx,GY); break;
      case 'vending':     dVending(ctx,dx,GY,env); break;
      case 'shrine_gate': dShrineGate(ctx,dx,GY,env); break;
      case 'bamboo':      dBamboo(ctx,dx,GY); break;
      case 'sign':        dSign(ctx,dx,GY,dec.signIdx||(dec.signIdx=Math.floor(Math.random()*6))); break;
      case 'pole':        dPole(ctx,dx,GY); break;
      case 'well':        dWell(ctx,dx,GY); break;
      case 'cart':        dCart(ctx,dx,GY,env); break;
    }
    ctx.restore();
  });
}

function dSakura(c,x,y,env){
  c.fillStyle='#6a3a10'; c.fillRect(x-4,y-120,8,120);
  c.strokeStyle='#6a3a10'; c.lineWidth=3;
  c.beginPath();c.moveTo(x,y-80);c.lineTo(x-32,y-118);c.stroke();
  c.beginPath();c.moveTo(x,y-100);c.lineTo(x+26,y-128);c.stroke();
  [[x,y-142,36],[x-32,y-118,24],[x+26,y-128,20],[x-16,y-152,18],[x+12,y-146,16]].forEach(([bx,by,br])=>{
    c.globalAlpha=0.82; c.fillStyle=env.petal||'#ffb7c5'; c.shadowBlur=10; c.shadowColor='rgba(255,160,180,0.4)';
    c.beginPath(); c.arc(bx,by,br,0,Math.PI*2); c.fill();
    c.globalAlpha=0.42; c.fillStyle='rgba(255,200,210,0.6)';
    c.beginPath(); c.arc(bx-3,by-5,br*0.55,0,Math.PI*2); c.fill();
    c.globalAlpha=1; c.shadowBlur=0;
  });
}
function dLantern(c,x,y,env){
  const ph=135;
  c.strokeStyle='rgba(70,45,15,0.95)'; c.lineWidth=5;
  c.beginPath();c.moveTo(x,y);c.lineTo(x,y-ph);c.stroke();
  c.lineWidth=3; c.beginPath();c.moveTo(x,y-ph);c.lineTo(x+24,y-ph+8);c.stroke();
  const glg=c.createRadialGradient(x+24,y-ph+22,0,x+24,y-ph+22,52);
  glg.addColorStop(0,env.lamp||'rgba(255,190,60,0.7)'); glg.addColorStop(1,'transparent');
  c.fillStyle=glg; c.fillRect(x-28,y-ph-30,104,104);
  c.shadowBlur=20; c.shadowColor='rgba(255,180,60,0.9)'; c.fillStyle='#ffe880';
  c.beginPath();c.ellipse(x+24,y-ph+22,10,16,0,0,Math.PI*2);c.fill();
  c.strokeStyle='rgba(100,60,10,0.55)'; c.lineWidth=0.8;
  for(let ri=-12;ri<=12;ri+=6){c.beginPath();c.moveTo(x+24,y-ph+10);c.lineTo(x+24+ri,y-ph+22);c.lineTo(x+24,y-ph+34);c.stroke();}
  c.fillStyle='rgba(100,60,10,0.9)'; c.shadowBlur=0;
  c.fillRect(x+17,y-ph+8,16,4); c.fillRect(x+17,y-ph+34,16,4);
  c.strokeStyle='rgba(180,40,30,0.7)'; c.lineWidth=1.5;
  c.beginPath();c.moveTo(x+24,y-ph+38);c.lineTo(x+24,y-ph+50);c.stroke();
}
function dFence(c,x,y){
  const fw=75; c.fillStyle='rgba(100,65,20,0.88)';
  c.fillRect(x,y-42,fw,5); c.fillRect(x,y-22,fw,5);
  for(let i=0;i<=4;i++){
    const px=x+i*(fw/4); c.fillStyle='rgba(90,55,15,0.92)'; c.fillRect(px-3,y-54,6,58);
    c.fillStyle='rgba(110,70,20,0.88)'; c.beginPath();c.moveTo(px-4,y-54);c.lineTo(px,y-63);c.lineTo(px+4,y-54);c.closePath();c.fill();
  }
}
function dBarrel(c,x,y){
  const g=c.createLinearGradient(x,0,x+28,0);
  g.addColorStop(0,'#7a4a1a');g.addColorStop(0.4,'#aa6a30');g.addColorStop(1,'#5a3008');
  c.fillStyle=g; rRect(c,x,y-42,28,42,4); c.fill();
  c.fillStyle='rgba(40,20,0,0.5)'; c.fillRect(x,y-32,28,5); c.fillRect(x,y-16,28,5);
  c.font=`bold 9px 'Noto Serif JP',serif`; c.fillStyle='rgba(255,220,100,0.8)';
  c.textAlign='center'; c.textBaseline='middle'; c.fillText('酒',x+14,y-21);
}
function dVending(c,x,y,env){
  const vg=c.createLinearGradient(x,0,x+34,0);
  vg.addColorStop(0,'#cc2020'); vg.addColorStop(1,'#992010');
  c.fillStyle=vg; rRect(c,x,y-88,34,88,3); c.fill();
  c.fillStyle='rgba(255,255,255,0.1)'; c.fillRect(x+3,y-80,28,52);
  for(let row=0;row<3;row++) for(let col=0;col<2;col++){
    c.fillStyle=`hsl(${col*60+row*40},80%,55%)`; c.fillRect(x+5+col*13,y-78+row*16,11,13);
  }
  c.fillStyle=env.lamp||'rgba(255,200,80,0.3)'; c.shadowBlur=8; c.shadowColor='rgba(255,200,80,0.5)';
  c.fillRect(x+3,y-24,28,14); c.shadowBlur=0;
  c.fillStyle='rgba(255,240,200,0.8)'; c.font=`bold 5px 'Noto Serif JP',serif`;
  c.textAlign='center'; c.textBaseline='middle'; c.fillText('自動販売',x+17,y-17);
  c.fillStyle='#333'; c.fillRect(x,y-3,34,5);
}
function dShrineGate(c,x,y,env){
  const gh=168; c.fillStyle='rgba(180,40,20,0.94)'; c.shadowBlur=5; c.shadowColor='rgba(200,50,20,0.35)';
  c.fillRect(x-44,y-gh,10,gh); c.fillRect(x+34,y-gh,10,gh);
  c.fillRect(x-57,y-gh,114,10); c.fillRect(x-51,y-gh+13,102,8); c.shadowBlur=0;
  c.strokeStyle='rgba(200,180,80,0.8)'; c.lineWidth=4;
  c.beginPath();
  for(let si=0;si<=40;si++){const sx=x-50+si*2.5,sy=y-gh+26+Math.sin(si*0.5)*6;si===0?c.moveTo(sx,sy):c.lineTo(sx,sy);}
  c.stroke();
  for(let zi=0;zi<5;zi++){c.fillStyle='rgba(240,230,200,0.8)';c.fillRect(x-38+zi*20,y-gh+25,3,18);}
}
function dBamboo(c,x,y){
  for(let bi=0;bi<3;bi++){
    const bx=x+bi*14-14, bh=78+bi*8;
    const bg=c.createLinearGradient(bx,0,bx+8,0);
    bg.addColorStop(0,'#5a8a20'); bg.addColorStop(0.5,'#7aaa30'); bg.addColorStop(1,'#4a7010');
    c.fillStyle=bg; c.fillRect(bx,y-bh,8,bh);
    c.fillStyle='rgba(60,100,15,0.8)';
    for(let j=18;j<bh;j+=22) c.fillRect(bx-1,y-j,10,4);
    c.fillStyle='rgba(80,140,20,0.82)';
    c.beginPath(); c.ellipse(bx-11,y-bh+6,17,5,-0.4,0,Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(bx+14,y-bh+13,15,4,0.4,0,Math.PI*2); c.fill();
  }
}
function dSign(c,x,y,idx){
  const texts=['東京まで →','↑ お寺','← 温泉','神社 ↑','市場 →','← 駅'];
  const t=texts[idx%texts.length];
  c.fillStyle='rgba(80,50,15,0.9)'; c.fillRect(x-2,y-92,5,92);
  c.fillStyle='rgba(200,160,60,0.92)'; c.shadowBlur=4; c.shadowColor='rgba(0,0,0,0.3)';
  rRect(c,x-34,y-98,70,24,4); c.fill(); c.shadowBlur=0;
  c.strokeStyle='rgba(100,65,15,0.45)'; c.lineWidth=1; c.strokeRect(x-32,y-96,66,20);
  c.font=`bold 8px 'Noto Serif JP',serif`; c.fillStyle='#3a2008';
  c.textAlign='center'; c.textBaseline='middle'; c.fillText(t,x+1,y-86);
}
function dPole(c,x,y){
  c.fillStyle='rgba(60,40,15,0.9)'; c.fillRect(x-3,y-180,6,180); c.fillRect(x-20,y-155,40,5);
  c.strokeStyle='rgba(20,15,10,0.55)'; c.lineWidth=0.8;
  c.beginPath();c.moveTo(x-20,y-152);c.quadraticCurveTo(x,y-148,x+80,y-155);c.stroke();
  c.fillStyle='rgba(255,200,80,0.6)';
  c.beginPath();c.arc(x-18,y-152,3,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+18,y-152,3,0,Math.PI*2);c.fill();
}
function dWell(c,x,y){
  c.fillStyle='#888'; c.fillRect(x-16,y-22,32,22); c.fillRect(x-18,y-22,36,6);
  c.fillStyle='#7a4a10'; c.fillRect(x-14,y-54,4,35); c.fillRect(x+10,y-54,4,35);
  c.strokeStyle='#5a3008'; c.lineWidth=2;
  c.beginPath();c.moveTo(x-18,y-54);c.lineTo(x,y-70);c.lineTo(x+18,y-54);c.stroke();
  c.strokeStyle='rgba(150,110,50,0.8)'; c.lineWidth=2;
  c.beginPath();c.moveTo(x,y-66);c.lineTo(x,y-30);c.stroke();
  c.fillStyle='#8a5a20'; c.fillRect(x-5,y-30,10,12);
}
function dCart(c,x,y,env){
  c.fillStyle='rgba(180,120,40,0.9)'; c.fillRect(x-26,y-62,52,42);
  c.fillStyle=env.roofColor||'#8a3a10';
  c.beginPath();c.moveTo(x-33,y-62);c.lineTo(x,y-84);c.lineTo(x+33,y-62);c.closePath();c.fill();
  c.shadowBlur=8; c.shadowColor='rgba(255,180,60,0.7)'; c.fillStyle='#ffdd60';
  c.beginPath();c.ellipse(x-15,y-66,6,9,0,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse(x+15,y-66,6,9,0,0,Math.PI*2);c.fill();
  c.shadowBlur=0; c.fillStyle='rgba(200,60,20,0.9)'; rRect(c,x-18,y-60,36,16,2); c.fill();
  c.fillStyle='#fff'; c.font=`bold 7px 'Noto Serif JP',serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText('屋台',x,y-52);
  c.fillStyle='#5a3010';
  c.beginPath();c.arc(x-16,y-2,9,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+16,y-2,9,0,Math.PI*2);c.fill();
  c.fillStyle='rgba(0,0,0,0.5)';
  c.beginPath();c.arc(x-16,y-2,4,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x+16,y-2,4,0,Math.PI*2);c.fill();
}

// =====================================================
// § 13  PLAYER — Smooth movement
// =====================================================
const Player={
  x:0,y:0,vx:0,vy:0,
  w:CFG.PLAYER_W,h:CFG.PLAYER_H,
  hp:CFG.PLAYER_HP,maxHp:CFG.PLAYER_HP,
  onGround:false,jumping:false,dblJump:false,_jumpCount:0,
  sliding:false,slideTimer:0,
  dashing:false,dashTimer:0,dashCooldown:0,
  inv:false,invTimer:0,hurtTimer:0,
  shield:false,shieldTimer:0,
  powerup:null,powerupTimer:0,
  animState:'run',animFrame:0,animTimer:0,
  trail:[],shootCooldown:0,aimAngle:0,_vxTarget:0,
  init(){
    this.x=W*0.18; this.y=GY-this.h;
    this.vx=0;this.vy=0;this.hp=this.maxHp;
    this.onGround=true;this.jumping=false;this.dblJump=false;this._jumpCount=0;
    this.sliding=false;this.slideTimer=0;
    this.dashing=false;this.dashTimer=0;this.dashCooldown=0;
    this.inv=false;this.invTimer=0;this.hurtTimer=0;
    this.shield=false;this.shieldTimer=0;
    this.powerup=null;this.powerupTimer=0;
    this.animFrame=0;this.animTimer=0;this.trail=[];this.shootCooldown=0;this._vxTarget=0;
    stepTimer=0;
    if(getChar().id==='taro'){this.shield=true;this.shieldTimer=99999;}
  },
  update(dt){
    if(this.invTimer>0){this.invTimer-=dt;if(this.invTimer<=0)this.inv=false;}
    if(this.hurtTimer>0) this.hurtTimer-=dt;
    if(this.dashTimer>0){this.dashTimer-=dt;if(this.dashTimer<=0)this.dashing=false;}
    if(this.dashCooldown>0) this.dashCooldown-=dt;
    if(this.slideTimer>0){this.slideTimer-=dt;if(this.slideTimer<=0){this.sliding=false;this.h=CFG.PLAYER_H;}}
    if(this.shieldTimer>0){this.shieldTimer-=dt;if(this.shieldTimer<=0)this.shield=false;}
    if(this.powerupTimer>0){this.powerupTimer-=dt;if(this.powerupTimer<=0)this.powerup=null;}
    if(this.shootCooldown>0) this.shootCooldown-=dt;
    if(K.shoot&&this.shootCooldown<=0) this.shoot();
    const ch=getChar();
    if(K.dash&&!this.dashing&&this.dashCooldown<=0){
      this.dashing=true; this.dashTimer=CFG.DASH_DURATION;
      this.dashCooldown=CFG.DASH_COOLDOWN;
      SFX.dash(); shake(3,140);
      emit(this.x+this.w/2,this.y+this.h/2,ch.trailColor,12,{spd:4,sz:3,up:0.5});
    }
    if(K.slide&&this.onGround&&!this.sliding){
      this.sliding=true;this.slideTimer=CFG.SLIDE_DURATION;this.h=CFG.PLAYER_H*0.52;
    }
    const maxJumps=ch.id==='hana'?3:2;
    if(K.jump){
      if(this.onGround&&!this.sliding){
        this.vy=CFG.JUMP_FORCE;this.onGround=false;this.jumping=true;this._jumpCount=1;SFX.jump();
        emit(this.x+this.w/2,this.y+this.h,getEnv().petal,8,{spd:2.5,up:0.5,grav:false,shape:'s'});
      } else if(this.jumping&&this._jumpCount<maxJumps){
        this.vy=CFG.DOUBLE_JUMP_FORCE;this._jumpCount++;SFX.jump();
        emit(this.x+this.w/2,this.y+this.h/2,getEnv().petal,14,{spd:3.5,up:1,grav:false,shape:'s'});
      }
    }
    const spdM=0.6+ch.spd*0.09;
    const dir=(K.left?-1:0)+(K.right?1:0);
    if(this.dashing){
      this.vx=ch.id==='kai'?CFG.DASH_SPEED*1.3:CFG.DASH_SPEED;
    } else if(dir!==0){
      this._vxTarget=dir*4.2*spdM;
      this.vx+=(this._vxTarget-this.vx)*0.38;
    } else {
      this.vx*=0.72;
    }
    if(!this.onGround) this.vy+=CFG.GRAVITY;
    this.x+=this.vx; this.y+=this.vy;
    const effGY=GY-this.h;
    if(this.y>=effGY){
      if(!this.onGround)SFX.land();
      this.y=effGY;this.vy=0;this.onGround=true;this.jumping=false;this._jumpCount=0;
    } else { if(this.y+this.h<GY)this.onGround=false; }
    if(this.y<0){this.y=0;this.vy=0;}
    checkPlatColl();
    this.x=Math.max(20,Math.min(W*0.55,this.x));
    this.aimAngle=Math.atan2(S.my-(this.y+this.h*0.35),S.mx-(this.x+this.w));
    if(this.hurtTimer>0) this.animState='hurt';
    else if(this.dashing)  this.animState='dash';
    else if(this.sliding)  this.animState='slide';
    else if(!this.onGround)this.animState='jump';
    else                   this.animState='run';
    this.animTimer++;
    const aSpd=Math.max(4,8-Math.floor(S.speed*0.4));
    if(this.animTimer>=aSpd){this.animTimer=0;this.animFrame=(this.animFrame+1)%4;}
    if(this.dashing||this.powerup==='speed'){
      this.trail.unshift({x:this.x+this.w/2,y:this.y+this.h/2,a:0.6});
      if(this.trail.length>10)this.trail.pop();
    } else this.trail=[];
    maybeStep();
  },
  shoot(){
    const ch=getChar();
    const dmg=Math.round(CFG.BULLET_DMG*(0.7+ch.atk*0.06));
    const px=this.x+this.w*0.9, py=this.y+this.h*0.35;
    bullets.push({x:px,y:py,vx:Math.cos(this.aimAngle)*CFG.BULLET_SPD,vy:Math.sin(this.aimAngle)*CFG.BULLET_SPD,w:11,h:5,dmg,life:85,angle:this.aimAngle,col:ch.accentColor,fromPlayer:true});
    this.shootCooldown=CFG.SHOOT_CD*(ch.id==='yuki'?0.7:1);
    SFX.shoot();
    emit(px,py,ch.accentColor,8,{spd:5,sz:3.5,life:7,grav:false});
    emit(px,py,'#fffde0',4,{spd:3,sz:2.5,life:5,grav:false});
  },
  takeDmg(amt){
    if(this.inv) return false;
    if(this.shield){
      this.shield=false;this.shieldTimer=0;
      emit(this.x+this.w/2,this.y+this.h/2,'#88ccff',16,{spd:5,sz:4});
      floatText(this.x+this.w/2,this.y-10,'BLOCKED!','#88ccff',16);
      shake(4,180); return false;
    }
    const dp=DIFF[Settings.difficulty];
    const ch=getChar();
    const defM=ch.id==='ryu'?0.6:(1-(ch.hp-5)*0.025);
    const dmg=Math.round(amt*dp.dmg*defM);
    this.hp=Math.max(0,this.hp-dmg);
    this.inv=true;this.invTimer=1100;this.hurtTimer=380;
    SFX.hurt();shake(8,350);
    emit(this.x+this.w/2,this.y+this.h/2,'#e63946',14,{spd:4.5,sz:3});
    floatText(this.x+this.w/2,this.y-10,`-${dmg}`,'#e63946',20);
    showDamageFlash();updateHUD();return true;
  },
  heal(amt){
    this.hp=Math.min(this.maxHp,this.hp+amt);
    emit(this.x+this.w/2,this.y+this.h/2,'#2ecc71',12,{spd:3,sz:3,up:2});
    floatText(this.x+this.w/2,this.y-10,`+${amt} HP`,'#2ecc71',16);
    updateHUD();
  },
  draw(){
    ctx.save();
    const ch=getChar();
    this.trail.forEach((t,i)=>{
      ctx.globalAlpha=t.a*(1-i/this.trail.length)*0.35;
      ctx.fillStyle=ch.trailColor;
      ctx.beginPath();ctx.ellipse(t.x,t.y,this.w*0.42,this.h*0.32,0,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=this.inv?0.5+0.5*Math.sin(Date.now()*0.022):1;
    if(this.hurtTimer>0) ctx.filter='saturate(3) brightness(1.6)';
    drawGunnerSprite(ctx,this.x,this.y,this.w,this.h,this.animState,this.animFrame,this.dashing,this.sliding,this.jumping,this.onGround,ch,this.aimAngle);
    ctx.filter='none'; // Fix: selalu reset filter agar tidak bocor ke elemen lain
    if(this.shield){
      ctx.globalAlpha=0.5+0.28*Math.sin(Date.now()*0.007);
      ctx.strokeStyle='#88ccff';ctx.lineWidth=2.5;ctx.shadowBlur=14;ctx.shadowColor='#88ccff';
      ctx.beginPath();ctx.arc(this.x+this.w/2,this.y+this.h/2,this.w*0.74,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  },
};

let damageFlashAlpha=0;
function showDamageFlash(){damageFlashAlpha=0.38;}
function drawDamageFlash(){
  if(damageFlashAlpha<=0) return;
  ctx.save();ctx.globalAlpha=damageFlashAlpha;
  const dg=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.85);
  dg.addColorStop(0,'transparent');dg.addColorStop(1,'rgba(230,50,50,0.8)');
  ctx.fillStyle=dg;ctx.fillRect(0,0,W,H);ctx.restore();
  damageFlashAlpha=Math.max(0,damageFlashAlpha-0.022);
}

function drawGunnerSprite(c,x,y,w,h,state,frame,dashing,sliding,jumping,onGround,ch,aimAngle){
  const bc=ch.bodyColor,jc=ch.jacketColor,ac=ch.accentColor,cx=x+w/2;
  if(sliding){y+=h*0.45;h=h*0.55;}
  const ls=state==='run'?Math.sin(frame*Math.PI/2)*9:0;
  c.fillStyle=jc;c.fillRect(cx-w*0.32,y+h*0.52,w*0.28,h*0.26+ls);c.fillRect(cx+w*0.04,y+h*0.52,w*0.28,h*0.26-ls);
  c.fillStyle='#1a1a1a';c.fillRect(cx-w*0.34,y+h*0.76+ls,w*0.32,h*0.13);c.fillRect(cx+w*0.02,y+h*0.76-ls,w*0.32,h*0.13);
  c.fillStyle=jc;c.shadowBlur=8;rRect(c,cx-w*0.42,y+h*0.22,w*0.84,h*0.33,4);c.fill();
  c.fillStyle=ac;c.globalAlpha=0.52;c.fillRect(cx-w*0.12,y+h*0.25,w*0.24,h*0.12);c.globalAlpha=1;
  c.fillStyle='#2a1a0a';c.fillRect(cx-w*0.42,y+h*0.52,w*0.84,h*0.05);
  c.fillStyle=ac;c.fillRect(cx-w*0.05,y+h*0.52,w*0.1,h*0.05);
  const aSw=state==='run'?Math.cos(frame*Math.PI/2)*7:0;
  c.fillStyle=jc;c.shadowBlur=10;c.fillRect(cx-w*0.52,y+h*0.24+aSw,w*0.14,h*0.26);
  const gl=w*0.34,gx=cx+w*0.28,gy=y+h*0.3;
  c.save();c.translate(gx,gy);c.rotate(Math.max(-Math.PI*0.5,Math.min(Math.PI*0.3,aimAngle)));
  c.fillStyle=jc;c.fillRect(0,-w*0.07,gl,w*0.14);
  c.fillStyle='#222';c.fillRect(gl-4,-w*0.08,w*0.1,w*0.16);
  c.fillStyle='#1a1a1a';c.shadowBlur=6;c.shadowColor='rgba(0,212,255,0.35)';
  rRect(c,gl+2,-h*0.08,h*0.16,h*0.08,2);c.fill();c.fillRect(gl+5,0,h*0.1,h*0.12);
  c.fillStyle=ac;c.globalAlpha=0.6;c.fillRect(gl+3,-h*0.09,h*0.04,h*0.04);c.globalAlpha=1;c.restore();
  c.fillStyle=bc;c.shadowBlur=8;c.shadowColor='rgba(240,200,160,0.38)';
  rRect(c,cx-w*0.26,y+h*0.03,w*0.52,h*0.21,4);c.fill();
  c.fillStyle=jc;c.fillRect(cx-w*0.28,y+h*0.04,w*0.56,h*0.06);
  c.fillStyle=ac;c.globalAlpha=0.52;c.fillRect(cx-w*0.22,y+h*0.1,w*0.44,h*0.07);c.globalAlpha=1;
  c.fillStyle='rgba(0,212,255,0.88)';
  c.beginPath();c.arc(cx-w*0.1,y+h*0.135,2.5,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(cx+w*0.1,y+h*0.135,2.5,0,Math.PI*2);c.fill();
  c.fillStyle='#555';c.fillRect(cx-w*0.26,y+h*0.12,4,8);c.fillStyle=ac;c.fillRect(cx-w*0.26,y+h*0.12,4,4);
  if(state==='dash'){
    c.save();c.strokeStyle=ch.trailColor;c.lineWidth=2;c.shadowColor=ch.trailColor;c.shadowBlur=14;c.globalAlpha=0.7;
    for(let i=0;i<4;i++){const ly=y+h*(0.1+i*0.25);c.beginPath();c.moveTo(cx-w*1.3,ly);c.lineTo(cx-w*0.55,ly);c.stroke();}
    c.restore();
  }
  if(state==='jump'){
    c.save();c.fillStyle='rgba(255,180,60,0.2)';c.shadowColor=ch.accentColor;c.shadowBlur=15;
    c.beginPath();c.ellipse(cx,y+h,w*0.36,6,0,0,Math.PI*2);c.fill();c.restore();
  }
}

function rRect(c,x,y,w,h,r){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);
  c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);
  c.lineTo(x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);
  c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();
}
function getChar(){return CHARS.find(c=>c.id===Settings.charId)||CHARS[0];}

// =====================================================
// § 14  BULLETS
// =====================================================
let bullets=[];
function updateBullets(){
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];b.x+=b.vx;b.y+=b.vy;b.life--;
    if(b.life<=0||b.x>W+20||b.x<-20||b.y<-20||b.y>H+20){bullets.splice(i,1);continue;}
    // If enemy bullet's owner is dead, remove bullet immediately (no damage)
    if(!b.fromPlayer && b.ownerId!=null){
      const ownerAlive=enemies.some(e=>e._id===b.ownerId);
      if(!ownerAlive){bullets.splice(i,1);continue;}
    }
    if(b.fromPlayer){
      let hit=false;
      for(let j=enemies.length-1;j>=0;j--){
        const e=enemies[j];
        if(b.x+b.w>e.x&&b.x<e.x+e.w&&b.y+b.h>e.y&&b.y<e.y+e.h){
          const dead=e.takeDmg(b.dmg);SFX.enemyHit();
          if(dead){addScore(e.pts);incCombo();SFX.kill();emitExplosion(e.x+e.w/2,e.y+e.h/2,e.col);floatText(e.x+e.w/2,e.y-15,`+${e.pts}`,'#f5c842',22);enemies.splice(j,1);}
          else{addScore(15);e.hitFlash=8;emit(e.x+e.w/2,e.y+e.h/2,'#e63946',8,{spd:3,sz:2.5,life:12});}
          emit(b.x,b.y,b.col||'#ffd580',8,{spd:3,sz:2.5,life:12,grav:false});
          hit=true;break;
        }
      }
      if(hit)bullets.splice(i,1);
    } else {
      if(!Player.inv&&b.x+b.w>Player.x&&b.x<Player.x+Player.w&&b.y+b.h>Player.y&&b.y<Player.y+Player.h){
        Player.takeDmg(b.dmg);emit(b.x,b.y,'#ff4400',8,{spd:3,sz:2.5,life:12,grav:false});bullets.splice(i,1);
      }
    }
  }
}
function drawBullets(){
  bullets.forEach(b=>{
    ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.rotate(b.angle);
    ctx.fillStyle=b.col||'#f5c842';ctx.shadowBlur=14;ctx.shadowColor=b.col||'#ffd580';
    ctx.beginPath();ctx.ellipse(0,0,b.w,b.h/2,0,0,Math.PI*2);ctx.fill();
    const tg=ctx.createLinearGradient(-b.w,0,0,0);
    tg.addColorStop(0,'transparent');tg.addColorStop(1,(b.col||'#f5c842')+'80');
    ctx.fillStyle=tg;ctx.fillRect(-b.w*2,-b.h/2,b.w*2,b.h);ctx.restore();
  });
}

// =====================================================
// § 15  COINS & HEARTS
// =====================================================
let coins=[], hearts=[];
function mkCoin(x,y){return{x,y,w:20,h:20,phase:Math.random()*Math.PI*2,spin:Math.random()*Math.PI*2,baseY:y,val:10};}
function spawnCoinGroup(){
  if(coins.length>50) return;
  const bx=W+40, by=GY-58;
  const n=4+Math.floor(Math.random()*5);
  const p=Math.floor(Math.random()*3);
  if(p===0)for(let i=0;i<n;i++)coins.push(mkCoin(bx+i*28,by));
  else if(p===1)for(let i=0;i<n;i++){const t=i/(n-1||1);coins.push(mkCoin(bx+i*26,by-Math.sin(t*Math.PI)*58));}
  else for(let i=0;i<n;i++)coins.push(mkCoin(bx+i*26,by-i*18));
  platforms.forEach(p=>{
    const px=p.x-terrOff;
    if(px>W&&px<W+350&&Math.random()<0.5)
      for(let j=0;j<2+Math.floor(Math.random()*3);j++) coins.push(mkCoin(p.x-terrOff+10+j*24,p.y-28));
  });
}
function updateCoins(){
  for(let i=coins.length-1;i>=0;i--){
    const c=coins[i];c.x-=S.speed;c.phase+=0.08;c.spin+=0.07;c.y=c.baseY+Math.sin(c.phase)*5.5;
    if(c.x+c.w>Player.x&&c.x<Player.x+Player.w&&c.y+c.h>Player.y&&c.y<Player.y+Player.h){
      addScore(c.val*Math.max(1,Math.floor(S.combo/3)));incCombo();SFX.coin();
      emit(c.x+c.w/2,c.y+c.h/2,'#f5c842',8,{spd:3,sz:2.5,life:16,grav:false});
      floatText(c.x+c.w/2,c.y-10,`+${c.val}`,'#f5c842',14);coins.splice(i,1);continue;
    }
    if(c.x+c.w<-20)coins.splice(i,1);
  }
}
function drawCoins(){
  coins.forEach(c=>{
    ctx.save();ctx.translate(c.x+c.w/2,c.y+c.h/2);
    ctx.globalAlpha=0.28+0.14*Math.sin(c.phase*2);ctx.fillStyle='#f5c842';ctx.shadowBlur=18;ctx.shadowColor='rgba(245,200,66,0.8)';
    ctx.beginPath();ctx.arc(0,0,c.w*0.72,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    const sx=Math.abs(Math.cos(c.spin));ctx.scale(Math.max(0.1,sx),1);
    ctx.strokeStyle='#c89a00';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,c.w*0.44,0,Math.PI*2);
    ctx.fillStyle='#f5c842';ctx.shadowBlur=10;ctx.shadowColor='#f5c842';ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffd040';ctx.beginPath();ctx.arc(0,0,c.w*0.28,0,Math.PI*2);ctx.fill();
    ctx.scale(1/Math.max(0.1,sx),1);
    if(sx>0.4){ctx.font=`bold ${c.w*0.38}px 'Noto Serif JP',serif`;ctx.fillStyle='#8b6000';ctx.shadowBlur=0;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('¥',0,1);}
    ctx.restore();
  });
}
function spawnHeart(x,y){hearts.push({x,y,w:24,h:24,phase:Math.random()*Math.PI*2,heal:28});}
function updateHearts(){
  for(let i=hearts.length-1;i>=0;i--){
    const h=hearts[i];h.x-=S.speed;h.phase+=0.055;h.y+=Math.sin(h.phase)*0.5;
    if(h.x+h.w>Player.x&&h.x<Player.x+Player.w&&h.y+h.h>Player.y&&h.y<Player.y+Player.h){
      Player.heal(h.heal);SFX.heart();emit(h.x+h.w/2,h.y+h.h/2,'#e63946',12,{spd:4,sz:3.5,up:2,grav:false});
      floatText(h.x+h.w/2,h.y-15,'❤ +HP','#ff4466',18);hearts.splice(i,1);continue;
    }
    if(h.x+h.w<-20)hearts.splice(i,1);
  }
}
function drawHearts(){
  hearts.forEach(h=>{
    ctx.save();ctx.translate(h.x+h.w/2,h.y+h.h/2);
    const sc=1+0.12*Math.sin(h.phase*2.5);ctx.scale(sc,sc);
    ctx.globalAlpha=0.28+0.14*Math.sin(h.phase*2);ctx.fillStyle='#e63946';ctx.shadowBlur=20;ctx.shadowColor='rgba(230,57,70,0.7)';
    ctx.beginPath();ctx.arc(0,0,h.w*0.68,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    const s=h.w*0.42;ctx.fillStyle='#ff3355';ctx.shadowBlur=12;ctx.shadowColor='#ff4466';
    ctx.beginPath();ctx.moveTo(0,s*0.3);ctx.bezierCurveTo(0,-s*0.3,-s,-s*0.3,-s,s*0.1);ctx.bezierCurveTo(-s,s*0.5,0,s*0.9,0,s*0.9);ctx.bezierCurveTo(0,s*0.9,s,s*0.5,s,s*0.1);ctx.bezierCurveTo(s,-s*0.3,0,-s*0.3,0,s*0.3);ctx.closePath();ctx.fill();
    ctx.restore();
  });
}

// =====================================================
// § 16  OBSTACLES
// =====================================================
let obstacles=[];
const OBS_TYPES=[
  {id:'barrel',w:30,h:42,dmg:14,t:'ground',draw(c,x,y,w,h){const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#7a4a1a');g.addColorStop(0.4,'#aa6a30');g.addColorStop(1,'#5a2e0a');c.fillStyle=g;rRect(c,x,y,w,h,5);c.fill();c.fillStyle='#3d1f00';c.fillRect(x,y+h*0.25,w,h*0.07);c.fillRect(x,y+h*0.62,w,h*0.07);c.fillStyle='rgba(255,200,80,0.72)';c.font=`bold ${w*0.35}px 'Noto Serif JP',serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('酒',x+w/2,y+h/2);}},
  {id:'crate',w:38,h:38,dmg:14,t:'ground',draw(c,x,y,w,h){c.fillStyle='#9a7030';rRect(c,x,y,w,h,3);c.fill();c.strokeStyle='#5a3a10';c.lineWidth=2;c.strokeRect(x+2,y+2,w-4,h-4);c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y+h);c.stroke();c.beginPath();c.moveTo(x+w,y);c.lineTo(x,y+h);c.stroke();c.fillStyle='rgba(200,160,60,0.6)';c.font=`bold 8px 'Noto Serif JP',serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('木箱',x+w/2,y+h/2);}},
  {id:'stone',w:44,h:28,dmg:12,t:'ground',draw(c,x,y,w,h){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#8a7560');g.addColorStop(0.5,'#6b5c48');g.addColorStop(1,'#4a3d30');c.fillStyle=g;c.shadowBlur=5;c.shadowColor='rgba(60,40,20,0.4)';c.beginPath();c.moveTo(x+w*0.15,y);c.lineTo(x+w*0.85,y);c.lineTo(x+w,y+h*0.4);c.lineTo(x+w*0.9,y+h);c.lineTo(x+w*0.1,y+h);c.lineTo(x,y+h*0.5);c.closePath();c.fill();c.shadowBlur=0;}},
  {id:'cart',w:64,h:36,dmg:16,t:'ground',draw(c,x,y,w,h){c.fillStyle='#8a5a20';rRect(c,x,y,w,h-12,4);c.fill();c.fillStyle='#5a3010';c.beginPath();c.arc(x+12,y+h-8,9,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+w-12,y+h-8,9,0,Math.PI*2);c.fill();c.fillStyle='rgba(60,40,10,0.5)';c.beginPath();c.arc(x+12,y+h-8,4,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+w-12,y+h-8,4,0,Math.PI*2);c.fill();c.fillStyle='rgba(180,140,60,0.7)';c.font=`bold 7px 'Noto Serif JP',serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('荷車',x+w/2,y+h*0.4);}},
  {id:'bamboogate',w:68,h:18,dmg:8,t:'high',yOff:0.52,draw(c,x,y,w,h){c.strokeStyle='#5a8a20';c.lineWidth=h*0.5;c.shadowBlur=4;c.shadowColor='rgba(60,140,20,0.35)';c.beginPath();c.moveTo(x,y+h/2);c.quadraticCurveTo(x+w/2,y+h*0.82,x+w,y+h/2);c.stroke();c.fillStyle='#4a7010';c.fillRect(x-4,y-22,8,h+26);c.fillRect(x+w-4,y-22,8,h+26);c.fillStyle='rgba(100,160,30,0.88)';c.shadowColor='rgba(80,160,20,0.5)';c.shadowBlur=7;c.fillRect(x+w*0.35,y-16,10,18);c.fillRect(x+w*0.6,y-16,10,18);c.shadowBlur=0;}},
  {id:'lowbar',w:65,h:16,dmg:8,t:'high',yOff:0.46,draw(c,x,y,w,h){c.strokeStyle='#8b6914';c.lineWidth=h*0.5;c.shadowBlur=4;c.shadowColor='rgba(140,100,0,0.4)';c.beginPath();c.moveTo(x,y+h/2);c.quadraticCurveTo(x+w/2,y+h*0.75,x+w,y+h/2);c.stroke();c.fillStyle='#5a3a00';c.fillRect(x-4,y-22,8,h+26);c.fillRect(x+w-4,y-22,8,h+26);}},
];
function spawnObs(){
  const t=OBS_TYPES[Math.floor(Math.random()*OBS_TYPES.length)];
  const o=Object.create(t);
  o.x=W+30; o.y=t.t==='high'?GY-(t.h||18)-(GY*(t.yOff||0.46)):GY-t.h;
  obstacles.push(o);
}
function updateObs(){
  for(let i=obstacles.length-1;i>=0;i--){
    const o=obstacles[i];o.x-=S.speed;
    if(!Player.inv&&Player.x<o.x+o.w&&Player.x+Player.w>o.x&&Player.y<o.y+o.h&&Player.y+Player.h>o.y){
      Player.takeDmg(o.dmg);emit(Player.x+Player.w/2,Player.y+Player.h/2,'#ff6b1a',10,{spd:4,sz:3});obstacles.splice(i,1);continue;
    }
    if(o.x+o.w<-30)obstacles.splice(i,1);
  }
}
function drawObs(){
  const t=Date.now();
  obstacles.forEach(o=>{
    ctx.save();
    // Strong red glow behind obstacle
    ctx.shadowBlur=22; ctx.shadowColor='rgba(230,57,70,0.85)';
    o.draw(ctx,o.x,o.y,o.w,o.h);
    ctx.shadowBlur=0;

    // Flashing red border (blinks every 400ms)
    const blink=Math.sin(t*0.008)>0;
    if(blink){
      ctx.strokeStyle='rgba(255,40,55,0.9)'; ctx.lineWidth=2;
      ctx.shadowBlur=10; ctx.shadowColor='rgba(255,40,55,0.9)';
      ctx.strokeRect(o.x-3,o.y-3,o.w+6,o.h+6);
      ctx.shadowBlur=0;
    }

    // Big red X above — unmistakably "DANGER"
    const cx=o.x+o.w/2, topY=o.y-8;
    ctx.font=`bold 13px 'Orbitron',sans-serif`;
    ctx.fillStyle='#ff2233'; ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.shadowBlur=12; ctx.shadowColor='rgba(255,0,30,0.9)';
    ctx.fillText('✕ DANGER',cx,topY);
    ctx.shadowBlur=0;

    // Red diagonal stripes on ground shadow to warn of area
    ctx.globalAlpha=0.18;
    ctx.fillStyle='rgba(230,57,70,0.6)';
    ctx.beginPath();ctx.ellipse(o.x+o.w/2,GY,o.w*0.55,6,0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
    ctx.restore();
  });
}

// =====================================================
// § 17  ENEMIES — 4 types, aggressive, no fleeing
// =====================================================
let enemies=[];
const EBase={
  updateAI(dt){
    const dp=DIFF[Settings.difficulty];
    const dx=Player.x-this.x, dist=Math.abs(dx);
    this.animTimer=(this.animTimer||0)+1;
    if(this.animTimer>=6){this.animTimer=0;this.animFrame=(this.animFrame+1)%4;}
    if((this.hitFlash||0)>0) this.hitFlash--;
    if((this.atkTimer||0)>0) this.atkTimer-=dt;

    // ── FLYING enemies (Tengu) ──
    if(this.type==='flying'){
      switch(this.aiState){
        case 'approach':
          this.vx = (dx<0?-1:1)*this.speed*dp.enmSpd - S.speed*0.9;
          const flyTargetY = Player.y - 80 + Math.sin(Date.now()*0.0018)*30;
          this.y += (flyTargetY - this.y) * 0.055;
          this.vy = 0;
          // Immediately enter range attack — always try to shoot
          this.aiState='rangeAttack';
          break;
        case 'rangeAttack':
          // Drift left with the world — stay visible on screen
          if(dist < 300){
            // Too close: back off a little
            this.vx = this.speed*0.5 - S.speed*0.88;
          } else {
            // Approach slowly while shooting
            this.vx = (dx<0?-1:1)*this.speed*dp.enmSpd*0.6 - S.speed*0.88;
          }
          // Hover above player
          const flyHoverY = Player.y - 95 + Math.sin(Date.now()*0.0022)*28;
          this.y += (flyHoverY - this.y)*0.055;
          // SHOOT whenever cooldown ready — no distance limit for flying
          if((this.atkTimer||0)<=0){ this.shootBullet(); this.atkTimer=this.atkCd; }
          if(dist < 70) this.aiState='swoop';
          break;
        case 'swoop':
          this.vy = (this.vy||0) + 1.2;
          this.vx = (dx<0?-1:1)*this.speed*2.5 - S.speed*0.9;
          if(dist<55){ Player.takeDmg(this.dmg); shake(4,200); }
          if(this.y > GY-this.h-8){
            this.vy=-13; this.aiState='rangeAttack';
            emit(this.x+this.w/2,this.y,'#4040aa',12,{spd:4,sz:3});
          }
          // Still shoot while swooping
          if((this.atkTimer||0)<=0){ this.shootBullet(); this.atkTimer=this.atkCd*0.7; }
          break;
      }
      // Clamp flying Y
      this.y += this.vy||0; this.vy=(this.vy||0)*0.88;
      const minFY=GY*0.12, maxFY=GY-this.h-8;
      if(this.y<minFY){this.y=minFY;this.vy=Math.max(0,this.vy||0);}
      if(this.y>maxFY){this.y=maxFY;this.vy=Math.min(0,this.vy||0);}
      this.x+=this.vx;
      this.x=Math.max(Player.x-120,Math.min(W+220,this.x));
      if(this.y<0){this.y=0;}
      return;
    }

    // ── GROUND enemies ──
    switch(this.aiState){
      case 'approach':
        // Move toward player AND subtract world scroll so enemy catches player
        this.vx = (dx<0?-1:1)*this.speed*dp.enmSpd - S.speed*0.88;
        if(this.type==='melee'  && dist<72) this.aiState='attack';
        if(this.type==='ranged' && dist<300) this.aiState='rangeAttack';
        if(this.type==='fast'   && dist<95) this.aiState='dashAtk';
        break;
      case 'attack':
        this.vx = (dx<0?-1:1)*this.speed*0.4 - S.speed*0.88;
        if((this.atkTimer||0)<=0){
          if(dist<88){ Player.takeDmg(this.dmg); shake(3,160); }
          this.atkTimer=this.atkCd;
          emit(this.x+this.w/2,this.y+this.h/2,this.col,10,{spd:4,sz:3});
        }
        if(dist>110) this.aiState='approach';
        break;
      case 'rangeAttack':
        this.vx = -S.speed*0.88; // drift with world
        if((this.atkTimer||0)<=0){ this.shootBullet(); this.atkTimer=this.atkCd; }
        if(dist>360) this.aiState='approach';
        if(dist<75)  this.aiState='backOff';
        break;
      case 'backOff':
        this.vx = this.speed*0.55; // move away from player
        if(dist>130) this.aiState='rangeAttack';
        break;
      case 'dashAtk':
        this.vx = (dx<0?-1:1)*this.speed*3.8 - S.speed*0.88;
        if(dist<58){ Player.takeDmg(this.dmg); shake(3,160); this.aiState='approach'; this.atkTimer=this.atkCd; emit(this.x+this.w/2,this.y+this.h/2,this.col,10,{spd:5,sz:3}); }
        if(dist>200) this.aiState='approach';
        break;
    }
    // Ground physics
    this.vy=(this.vy||0)+CFG.GRAVITY*0.55;
    this.y+=this.vy; this.x+=this.vx;
    if(this.y>=GY-this.h){this.y=GY-this.h;this.vy=0;}
    if(this.y<0){this.y=0;this.vy=0;}
    this.x=Math.max(Player.x-120,Math.min(W+220,this.x));
  },
  shootBullet(){
    if(!this.canShoot)return;SFX.enemyShoot();
    const bx=this.x;
    const by=this.y+this.h*0.35;
    // Aim horizontally at player — keep vy small so bullet travels mostly left/straight
    const dx=Player.x+Player.w/2-bx;
    // Only a tiny vertical lead — aim at player torso but mostly horizontal
    const dy=(Player.y+Player.h*0.4-by)*0.25;
    const dist=Math.sqrt(dx*dx+dy*dy)||1;
    const vx=(dx/dist)*CFG.BULLET_SPD;
    const vy=(dy/dist)*CFG.BULLET_SPD;
    // Tag bullet with this enemy's id so it dies if the enemy dies
    bullets.push({x:bx,y:by,vx,vy,w:10,h:5,dmg:this.dmg*0.7,life:90,angle:Math.atan2(dy,dx),col:'#ff3300',fromPlayer:false,ownerId:this._id});
    emit(bx,by,'#ff3300',5,{spd:3,sz:2,life:8,grav:false});
  },
  takeDmg(amt){
    this.hp-=amt;emit(this.x+this.w/2,this.y+this.h/2,'#e63946',10,{spd:3.5,sz:3});
    floatText(this.x+this.w/2,this.y-8,`-${amt}`,'#e63946',14);this.hitFlash=10;return this.hp<=0;
  },
};

const EDEFS={
  kitsune:{w:34,h:48,hp:28,dmg:14,speed:2.5,col:'#e07b39',atkCd:680,pts:120,type:'melee',
    draw(c,x,y,w,h,fr,col,state,hf){
      if(hf>0)c.filter='brightness(3.5)';const ls=Math.sin(fr*Math.PI/2)*7;c.shadowBlur=10;c.shadowColor=col;
      for(let t=0;t<3;t++){c.fillStyle=t%2===0?'#f5c842':'#e07b39';c.globalAlpha=0.8-t*0.15;c.beginPath();c.moveTo(x+w*0.8,y+h*0.3+t*5);c.quadraticCurveTo(x+w*(1.5+t*0.2),y+h*(0.0+t*0.1),x+w*(1.2+t*0.15),y+h*(0.55+t*0.1));c.quadraticCurveTo(x+w*1.0,y+h*0.7,x+w*0.8,y+h*(0.5+t*0.05));c.closePath();c.fill();}
      c.globalAlpha=1;c.fillStyle=col;c.fillRect(x+w*0.1,y+h*0.58,w*0.25,h*0.42+ls);c.fillRect(x+w*0.62,y+h*0.58,w*0.25,h*0.42-ls);
      rRect(c,x+w*0.05,y+h*0.24,w*0.9,h*0.37,5);c.fill();rRect(c,x+w*0.1,y,w*0.7,h*0.28,5);c.fill();
      c.beginPath();c.moveTo(x+w*0.15,y);c.lineTo(x+w*0.04,y-h*0.14);c.lineTo(x+w*0.32,y);c.closePath();c.fill();
      c.beginPath();c.moveTo(x+w*0.55,y);c.lineTo(x+w*0.8,y-h*0.14);c.lineTo(x+w*0.66,y);c.closePath();c.fill();
      c.fillStyle='#ff4400';c.shadowColor='#ff4400';c.shadowBlur=18;
      c.beginPath();c.ellipse(x+w*0.26,y+h*0.1,5,3.5,0,0,Math.PI*2);c.fill();
      c.beginPath();c.ellipse(x+w*0.58,y+h*0.1,5,3.5,0,0,Math.PI*2);c.fill();
      c.shadowBlur=0;
      if(state==='attack'){c.strokeStyle='#ff6600';c.lineWidth=2;c.globalAlpha=0.5+0.3*Math.sin(Date.now()*0.012);c.beginPath();c.arc(x+w/2,y+h/2,w*0.7,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
      c.filter='none';
    }},
  oni:{w:44,h:54,hp:65,dmg:24,speed:1.3,col:'#c03030',atkCd:1000,pts:220,type:'melee',
    draw(c,x,y,w,h,fr,col,state,hf){
      if(hf>0)c.filter='brightness(3.5)';const bob=Math.sin(fr*Math.PI/2)*4;c.shadowBlur=12;c.shadowColor=col;
      c.fillStyle='#ff8800';c.beginPath();c.moveTo(x+w*0.25,y);c.lineTo(x+w*0.18,y-h*0.22);c.lineTo(x+w*0.35,y);c.closePath();c.fill();
      c.beginPath();c.moveTo(x+w*0.65,y);c.lineTo(x+w*0.72,y-h*0.22);c.lineTo(x+w*0.82,y);c.closePath();c.fill();
      c.fillStyle=col;rRect(c,x+w*0.02,y+h*0.22,w*0.96,h*0.42,6);c.fill();rRect(c,x+w*0.08,y,w*0.84,h*0.26,8);c.fill();
      c.fillStyle='#331111';c.fillRect(x+w*0.25,y+h*0.62,w*0.5,h*0.28);
      c.fillStyle='#aa2020';const ls=Math.sin(fr*Math.PI/2)*8;
      c.fillRect(x+w*0.08,y+h*0.58+bob,w*0.3,h*0.42-ls);c.fillRect(x+w*0.62,y+h*0.58+bob,w*0.3,h*0.42+ls);
      c.fillStyle='#ffff00';c.shadowColor='#ffff00';c.shadowBlur=20;
      c.beginPath();c.ellipse(x+w*0.3,y+h*0.1,6,4,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(x+w*0.68,y+h*0.1,6,4,0,0,Math.PI*2);c.fill();
      c.fillStyle='#000';c.beginPath();c.ellipse(x+w*0.3,y+h*0.1,3,3,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(x+w*0.68,y+h*0.1,3,3,0,0,Math.PI*2);c.fill();
      c.shadowBlur=0;c.fillStyle='#5a3010';c.fillRect(x+w*0.88,y+h*0.15,8,h*0.55);c.fillStyle='#7a4010';rRect(c,x+w*0.84,y+h*0.14,16,22,3);c.fill();
      if(state==='attack'){c.strokeStyle='#ff2200';c.lineWidth=3;c.globalAlpha=0.6+0.4*Math.sin(Date.now()*0.015);c.beginPath();c.arc(x+w/2,y+h/2,w*0.85,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
      c.filter='none';
    }},
  tengu:{w:36,h:44,hp:32,dmg:12,speed:2.2,col:'#4040aa',atkCd:650,pts:180,type:'flying',canShoot:true,
    draw(c,x,y,w,h,fr,col,state,hf){
      if(hf>0)c.filter='brightness(3.5)';const wa=Math.sin(fr*Math.PI/2)*0.55;
      // Wing flap — big dramatic wings
      c.fillStyle='rgba(35,35,115,0.88)';c.shadowBlur=10;c.shadowColor=col;
      c.save();c.translate(x+w*0.08,y+h*0.32);c.rotate(-wa-0.18);c.beginPath();c.ellipse(0,0,w*0.72,h*0.18,-0.25,0,Math.PI*2);c.fill();c.restore();
      c.save();c.translate(x+w*0.92,y+h*0.32);c.rotate(wa+0.18);c.beginPath();c.ellipse(0,0,w*0.72,h*0.18,0.25,0,Math.PI*2);c.fill();c.restore();
      // Second wing layer
      c.globalAlpha=0.50;
      c.save();c.translate(x+w*0.10,y+h*0.34);c.rotate(-wa*1.5-0.38);c.beginPath();c.ellipse(0,0,w*0.92,h*0.11,-0.42,0,Math.PI*2);c.fill();c.restore();
      c.save();c.translate(x+w*0.90,y+h*0.34);c.rotate(wa*1.5+0.38);c.beginPath();c.ellipse(0,0,w*0.92,h*0.11,0.42,0,Math.PI*2);c.fill();c.restore();
      c.globalAlpha=1;
      c.fillStyle=col;rRect(c,x+w*0.08,y+h*0.22,w*0.84,h*0.40,6);c.fill();
      c.fillStyle='#3a3a8a';rRect(c,x+w*0.14,y,w*0.72,h*0.25,6);c.fill();
      c.fillStyle='#cc2020';c.beginPath();c.moveTo(x+w*0.86,y+h*0.12);c.lineTo(x+w*1.30,y+h*0.10);c.lineTo(x+w*0.90,y+h*0.22);c.closePath();c.fill();
      c.fillStyle='#ffcc00';c.shadowColor='#ffcc00';c.shadowBlur=12;
      c.beginPath();c.arc(x+w*0.30,y+h*0.10,4,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(x+w*0.60,y+h*0.10,4,0,Math.PI*2);c.fill();c.shadowBlur=0;
      c.fillStyle='#2a2a6a';c.fillRect(x+w*0.28,y+h*0.60,w*0.20,h*0.28);c.fillRect(x+w*0.52,y+h*0.60,w*0.20,h*0.28);
      // Ground shadow
      c.save();c.globalAlpha=0.18;c.fillStyle='rgba(0,0,60,0.6)';c.beginPath();c.ellipse(x+w/2,GY,w*0.52,7,0,0,Math.PI*2);c.fill();c.restore();
      if(state==='swoop'){c.strokeStyle='#0055ff';c.lineWidth=2.5;c.globalAlpha=0.65+0.3*Math.sin(Date.now()*0.018);c.beginPath();c.arc(x+w/2,y+h/2,w*0.92,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
      if(state==='rangeAttack'||state==='approach'){c.strokeStyle='#6060ff';c.lineWidth=1.5;c.globalAlpha=0.35+0.22*Math.sin(Date.now()*0.014);c.beginPath();c.arc(x+w/2,y+h/2,w*0.88,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
      c.filter='none';
    }},
  ninja:{w:28,h:44,hp:20,dmg:10,speed:3.8,col:'#00d4ff',atkCd:400,pts:160,type:'fast',
    draw(c,x,y,w,h,fr,col,state,hf){
      if(hf>0)c.filter='brightness(3.5)';c.shadowBlur=14;c.shadowColor=col;
      if(state==='dashAtk'){c.strokeStyle=col;c.lineWidth=2;c.globalAlpha=0.55;for(let i=0;i<4;i++){c.beginPath();c.moveTo(x-w*0.5,y+h*(0.1+i*0.25));c.lineTo(x+w*0.4,y+h*(0.1+i*0.25));c.stroke();}c.globalAlpha=1;}
      const ls=Math.sin(fr*Math.PI/2)*8;
      c.fillStyle='#0a1a2a';rRect(c,x+w*0.05,y+h*0.2,w*0.9,h*0.45,4);c.fill();
      c.fillStyle=col;c.globalAlpha=0.5;c.fillRect(x+w*0.15,y+h*0.24,w*0.7,h*0.08);c.globalAlpha=1;
      c.fillStyle='#1a2a3a';c.fillRect(x+w*0.1,y+h*0.62,w*0.3,h*0.38+ls);c.fillRect(x+w*0.6,y+h*0.62,w*0.3,h*0.38-ls);
      c.fillStyle='#0d0d1a';rRect(c,x+w*0.1,y,w*0.8,h*0.24,5);c.fill();
      c.fillStyle=col;c.shadowBlur=15;c.fillRect(x+w*0.12,y+h*0.06,w*0.76,h*0.07);
      c.beginPath();c.arc(x+w*0.3,y+h*0.1,3.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+w*0.62,y+h*0.1,3.5,0,Math.PI*2);c.fill();
      c.shadowBlur=0;c.filter='none';
    }},
};

function spawnEnemy(){
  const dp=DIFF[Settings.difficulty];
  const types=Object.keys(EDEFS);
  const flyingN=enemies.filter(e=>e.type==='flying').length;
  const groundN=enemies.filter(e=>e.type!=='flying').length;
  // Max 4 flying (tengu), max 4 ground enemies at once
  let pool=types;
  if(flyingN>=4) pool=pool.filter(t=>EDEFS[t].type!=='flying');
  if(groundN>=4) pool=pool.filter(t=>EDEFS[t].type==='flying');
  if(!pool.length) pool=types;
  // 60% chance to force tengu if fewer than 4 flying — heavily biased toward flying
  if(flyingN<4 && Math.random()<0.60) pool=['tengu'];
  // If only flying allowed left, use tengu
  if(pool.length===0) pool=['tengu'];
  const key=pool[Math.floor(Math.random()*pool.length)];
  const def=EDEFS[key];
  const e=Object.create(EBase);
  Object.assign(e,{
    w:def.w, h:def.h,
    hp:Math.round(def.hp*(0.85+S.diff*0.18)*dp.enmSpd),
    maxHp:Math.round(def.hp*(0.85+S.diff*0.18)*dp.enmSpd),
    dmg:def.dmg, speed:def.speed, col:def.col,
    atkCd:def.atkCd, pts:def.pts, type:def.type, canShoot:def.canShoot||false,
    _id: ++spawnEnemy._uid,
  });
  e.draw=def.draw;
  // Flying enemies spawn higher, off to the right — shoot almost immediately
  e.x=W+80;
  e.y=def.type==='flying' ? GY*0.28 : GY-e.h;
  e.vy=0; e.vx=-def.speed;
  e.aiState=def.type==='flying'?'rangeAttack':'approach';
  e.atkTimer=def.type==='flying'?200:def.atkCd*0.4; // flying: shoot after 200ms delay
  e.animFrame=0; e.animTimer=0; e.hitFlash=0;
  enemies.push(e);
}
function updateEnemies(dt){enemies.forEach(e=>e.updateAI(dt));}
spawnEnemy._uid=0;
function drawEnemies(){
  enemies.forEach(e=>{
    ctx.save();
    e.draw(ctx,e.x,e.y,e.w,e.h,e.animFrame,e.col,e.aiState,e.hitFlash||0);
    const bW=e.w+16,bX=e.x-8,bY=e.y-16;
    ctx.fillStyle='rgba(0,0,0,0.65)';rRect(ctx,bX,bY,bW,7,3);ctx.fill();
    const hr=e.hp/e.maxHp;
    ctx.fillStyle=hr>0.5?'#e63946':hr>0.25?'#ff6b1a':'#cc1111';
    ctx.shadowBlur=5;ctx.shadowColor=ctx.fillStyle;rRect(ctx,bX,bY,bW*hr,7,3);ctx.fill();
    ctx.restore();
  });
}

// =====================================================
// § 18  POWER-UPS
// =====================================================
let powerups=[];
const PTYPES=[
  {id:'heal',lbl:'ONIGIRI',col:'#2ecc71',emoji:'🍙',use(p){p.heal(35);SFX.pickup();floatText(p.x+p.w/2,p.y-20,'体力 +35','#2ecc71',17);}},
  {id:'shield',lbl:'TALISMAN',col:'#88ccff',emoji:'🧧',use(p){p.shield=true;p.shieldTimer=9000;SFX.pickup();floatText(p.x+p.w/2,p.y-20,'護符！','#88ccff',17);}},
  {id:'speed',lbl:'RAMEN',col:'#ffd580',emoji:'🍜',use(p){p.powerup='speed';p.powerupTimer=5500;S.speed=Math.min(S.speed*1.32,CFG.MAX_SPEED);SFX.pickup();floatText(p.x+p.w/2,p.y-20,'速度 UP！','#ffd580',17);}},
  {id:'score',lbl:'SAKURA',col:'#ffb7c5',emoji:'🌸',use(p){S.score+=600;incCombo();SFX.pickup();floatText(p.x+p.w/2,p.y-20,'+600！','#ffb7c5',22);}},
];
function spawnPwr(){
  const t=PTYPES[Math.floor(Math.random()*PTYPES.length)];
  const o=Object.create(t);o.x=W+20;o.y=GY-55-Math.random()*70;o.w=30;o.h=30;o.phase=Math.random()*Math.PI*2;o.spin=0;
  powerups.push(o);
}
function updatePwrs(){
  for(let i=powerups.length-1;i>=0;i--){
    const p=powerups[i];p.x-=S.speed;p.phase+=0.06;p.spin+=0.04;p.y+=Math.sin(p.phase)*0.5;
    if(Player.x<p.x+p.w&&Player.x+Player.w>p.x&&Player.y<p.y+p.h&&Player.y+Player.h>p.y){
      p.use(Player);emit(p.x+p.w/2,p.y+p.h/2,p.col,16,{spd:4,sz:4,up:2,shape:'s'});powerups.splice(i,1);updateHUD();continue;
    }
    if(p.x+p.w<-30)powerups.splice(i,1);
  }
}
function drawPwrs(){
  const t=Date.now();
  powerups.forEach(p=>{
    ctx.save();

    // ── Outer rotating dashed ring (clearly GREEN = safe/good) ──
    ctx.translate(p.x+p.w/2, p.y+p.h/2);
    ctx.save();
    ctx.rotate(t*0.0022);
    ctx.strokeStyle='#00ff88'; ctx.lineWidth=2.2;
    ctx.shadowBlur=18; ctx.shadowColor='rgba(0,255,136,0.9)';
    ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.arc(0,0,p.w*0.88,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Pulsing inner glow
    const pulse=0.3+0.2*Math.sin(p.phase*2.5);
    ctx.globalAlpha=pulse;
    ctx.fillStyle='rgba(0,255,136,0.22)';
    ctx.beginPath();ctx.arc(0,0,p.w*0.8,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;

    // The item emoji
    ctx.shadowBlur=20; ctx.shadowColor=p.col;
    ctx.font=`${p.w*0.72}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(p.emoji,0,1);

    // ── "★ PICKUP" label clearly above — GREEN, distinct from red DANGER ──
    ctx.font=`bold 10px 'Orbitron',sans-serif`;
    ctx.fillStyle='#00ff88'; ctx.shadowBlur=10; ctx.shadowColor='rgba(0,255,136,1)';
    ctx.textBaseline='alphabetic'; ctx.textAlign='center';
    ctx.fillText('★ '+p.lbl, 0, -p.h*0.9);
    ctx.shadowBlur=0;

    ctx.restore();

    // Green ground glow (vs red for obstacles)
    ctx.save();
    ctx.globalAlpha=0.18+0.08*Math.sin(p.phase*2);
    ctx.fillStyle='rgba(0,255,136,0.55)';
    ctx.beginPath();ctx.ellipse(p.x+p.w/2,GY,p.w*0.5,5,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

// =====================================================
// § 19  SCORE & COMBO
// =====================================================
function incCombo(){S.combo++;S.comboTimer=CFG.COMBO_TIMEOUT;if(S.combo>S.maxCombo)S.maxCombo=S.combo;if(S.combo>1)SFX.combo();updateHUD();}
function addScore(pts){const m=Math.max(1,Math.floor(S.combo/3));S.score+=pts*m;if(S.score>S.hs)S.hs=S.score;updateHUD();}

// =====================================================
// § 20  CAMERA SHAKE
// =====================================================
function shake(mag,dur){if(mag>S.shakeMag){S.shakeDur=dur;S.shakeMag=mag;}}
function updateShake(dt){
  if(S.shakeDur>0){S.shakeDur-=dt;const p=Math.max(0,S.shakeDur/350),m=S.shakeMag*p;S.shakeX=(Math.random()-0.5)*m;S.shakeY=(Math.random()-0.5)*m;}
  else{S.shakeX=0;S.shakeY=0;S.shakeMag=0;}
}

// =====================================================
// § 21  HUD
// =====================================================
const $hFill=document.getElementById('healthBar');
const $hNum=document.getElementById('healthText');
const $shld=document.getElementById('shieldIcon');
const $scr=document.getElementById('scoreDisplay');
const $cmbo=document.getElementById('comboDisplay');
const $hsD=document.getElementById('hsDisplay');
const $spdD=document.getElementById('speedDisplay');
function updateHUD(){
  const pct=(Player.hp/Player.maxHp)*100;
  $hFill.style.width=pct+'%';
  const hc=pct>50?'#2ecc71':pct>25?'#f5a623':'#e63946';
  $hFill.style.background=hc;$hFill.style.boxShadow=`0 0 8px ${hc}`;
  $hNum.textContent=Math.ceil(Player.hp);
  $shld.classList.toggle('hidden',!Player.shield);
  $scr.textContent=String(Math.floor(S.score)).padStart(6,'0');
  $hsD.textContent=String(Math.floor(S.hs)).padStart(6,'0');
  $cmbo.textContent=S.combo>=3?`× ${S.combo} COMBO`:'';
  $spdD.textContent=(S.speed/CFG.BASE_SPEED).toFixed(1)+'×';
}

// =====================================================
// § 22  SPAWN MANAGER
// =====================================================
function updateSpawns(){
  S.obsTimer++;S.enmTimer++;S.pwrTimer++;S.coinTimer++;
  const dp=DIFF[Settings.difficulty];
  const obR=Math.max(55,CFG.OBS_SPAWN_BASE-S.diff*14*dp.spawn);
  const enR=Math.max(140,CFG.ENM_SPAWN_BASE-S.diff*30*dp.spawn);
  const pwR=Math.max(300,CFG.PWR_SPAWN_BASE-S.diff*20);
  const coR=Math.max(24,CFG.COIN_SPAWN_BASE-S.diff*3);
  if(S.obsTimer>=obR){if(obstacles.length<5)spawnObs();S.obsTimer=0;}
  if(S.enmTimer>=enR){if(enemies.length<7+Math.floor(S.diff*0.8))spawnEnemy();S.enmTimer=0;}
  if(S.pwrTimer>=pwR){if(powerups.length<3)spawnPwr();S.pwrTimer=0;}
  if(S.coinTimer>=coR){spawnCoinGroup();S.coinTimer=0;}
  if(S.frame%580===0&&Player.hp<Player.maxHp*0.65)spawnHeart(W+35,GY-55-Math.random()*55);
  if(S.frame%780===0&&Math.random()<0.4)spawnHeart(W+55,GY-55-Math.random()*80);
}

// =====================================================
// § 23  POST-FX
// =====================================================
function drawVignette(){
  const vg=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.88);
  vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(4,1,10,0.42)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(Settings.envId==='cyber'||Settings.envId==='night'){ctx.fillStyle='rgba(0,0,0,0.022)';for(let sy=0;sy<H;sy+=4)ctx.fillRect(0,sy,W,2);}
}

// =====================================================
// § 24  GAME LOOP
// =====================================================
let lastT=0, rafId=null;
function gameLoop(ts){
  if(S.screen!=='playing') return;
  const dt=Math.min(ts-lastT,50);lastT=ts;S.frame++;
  const dp=DIFF[Settings.difficulty];
  S.speed=Math.min((CFG.BASE_SPEED+S.frame*CFG.SPEED_INC)*dp.spd,CFG.MAX_SPEED*dp.spd);
  S.diff=1+S.frame/3200;
  S.score+=CFG.SCORE_PER_FRAME*S.diff;
  if(S.score>S.hs){S.hs=S.score;try{localStorage.setItem('nmr_hs',Math.floor(S.hs));}catch(e){}}
  if(S.combo>0){S.comboTimer-=dt;if(S.comboTimer<=0){S.combo=0;updateHUD();}}
  updateBG();updateTerrain();updateShake(dt);updateSpawns();
  Player.update(dt);updateBullets();updateEnemies(dt);
  updateObs();updatePwrs();updateCoins();updateHearts();
  updateP();updateFT();
  $scr.textContent=String(Math.floor(S.score)).padStart(6,'0');
  $spdD.textContent=(S.speed/CFG.BASE_SPEED).toFixed(1)+'×';
  ctx.save();ctx.translate(S.shakeX,S.shakeY);
  drawBG();drawObs();drawBullets();drawPwrs();drawCoins();drawHearts();drawEnemies();Player.draw();drawP();drawFT();
  ctx.restore();drawVignette();drawDamageFlash();
  clearTrig();
  if(Player.hp<=0){gameOver();return;}
  rafId=requestAnimationFrame(gameLoop);
}

// =====================================================
// § 25  MENU BACKGROUND — Infinite, stable
// =====================================================
let menuBGFrame=0, menuBGSakura=[], menuBGBldgs=[], menuBGMountains=[];
function initMenuBG(){
  const env=getEnv(); menuBGSakura=[];
  for(let i=0;i<42;i++) menuBGSakura.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,vx:(Math.random()-0.5)*0.65-0.38,vy:0.5+Math.random()*0.85,sz:2+Math.random()*5,rot:Math.random()*Math.PI*2,rotSpd:(Math.random()-0.5)*0.055,alpha:0.4+Math.random()*0.5});
  menuBGBldgs=[];let bx=0;
  while(bx<window.innerWidth*3+400){
    const bw=42+Math.random()*108,bh=(0.1+Math.random()*0.34)*window.innerHeight;
    menuBGBldgs.push({x:bx,w:bw,h:bh,wc:env.win(Math.random()),rc:env.roofColor,wall:env.wallColor,sign:Math.random()<0.42,signTxt:['居酒屋','茶屋','和食','旅館','酒屋','書店','花屋'][Math.floor(Math.random()*7)]});
    bx+=bw+6+Math.random()*28;
  }
  menuBGMountains=[];
  for(let i=0;i<12;i++) menuBGMountains.push({x:i*(window.innerWidth*3/10)+Math.random()*150,w:100+Math.random()*200,h:(0.06+Math.random()*0.17)*window.innerHeight});
}

function animateMenuBG(mc){
  if(!mc)return;
  mc.width=window.innerWidth; mc.height=window.innerHeight;
  const mCtx=mc.getContext('2d');
  const W2=mc.width, H2=mc.height, env=getEnv();
  menuBGFrame++; const spd=1.5;
  mCtx.clearRect(0,0,W2,H2);

  // Sky gradient — uses env sky colors
  const sc=env.sky;
  const skyG=mCtx.createLinearGradient(0,0,0,H2*0.82);
  sc.forEach((c,i)=>skyG.addColorStop(i/(sc.length-1),c));
  mCtx.fillStyle=skyG; mCtx.fillRect(0,0,W2,H2*0.82);

  // Stars for night/cyber
  if(env.stars){
    for(let si=0;si<100;si++){
      const sx2=((si*137+menuBGFrame*0.02)%W2+W2)%W2;
      const sy2=(si*89+11)%Math.round(H2*0.7);
      mCtx.save(); mCtx.globalAlpha=(0.4+0.5*Math.sin(Date.now()*0.0008+si))*(env.id==='cyber'?0.8:1);
      mCtx.fillStyle=env.id==='cyber'?['#ff88ff','#88ffff','#ffffff'][si%3]:'#ffffff';
      mCtx.shadowBlur=env.id==='cyber'?7:2; mCtx.shadowColor=mCtx.fillStyle;
      mCtx.beginPath(); mCtx.arc(sx2,sy2,si%9===0?1.6:0.8,0,Math.PI*2); mCtx.fill();
      mCtx.restore();
    }
  }

  // Moon
  if(env.moonSize>0){
    const mx2=W2*0.78, my2=H2*0.16;
    mCtx.save();
    const mH=mCtx.createRadialGradient(mx2,my2,0,mx2,my2,env.moonSize*3);
    mH.addColorStop(0,'rgba(200,220,255,0.18)'); mH.addColorStop(1,'transparent');
    mCtx.fillStyle=mH; mCtx.fillRect(mx2-env.moonSize*3,my2-env.moonSize*3,env.moonSize*6,env.moonSize*6);
    mCtx.beginPath(); mCtx.arc(mx2,my2,env.moonSize,0,Math.PI*2);
    const mg2=mCtx.createRadialGradient(mx2-env.moonSize*0.3,my2-env.moonSize*0.3,0,mx2,my2,env.moonSize);
    mg2.addColorStop(0,'#eef4ff'); mg2.addColorStop(1,'rgba(180,200,240,0.7)');
    mCtx.fillStyle=mg2; mCtx.shadowBlur=35; mCtx.shadowColor='rgba(180,210,255,0.7)'; mCtx.fill();
    mCtx.restore();
  }

  // Sun / glow
  if(!env.stars||env.id==='morning'){
    const sunX=W2*0.72, sunY=H2*(env.id==='morning'?0.32:0.18);
    const sH=mCtx.createRadialGradient(sunX,sunY,0,sunX,sunY,160);
    sH.addColorStop(0,env.id==='cyber'?'rgba(255,0,255,0.25)':'rgba(255,252,210,0.28)'); sH.addColorStop(1,'transparent');
    mCtx.fillStyle=sH; mCtx.fillRect(sunX-160,sunY-160,320,320);
    mCtx.save(); mCtx.beginPath(); mCtx.arc(sunX,sunY,env.id==='morning'?24:38,0,Math.PI*2);
    mCtx.fillStyle=env.sun; mCtx.shadowBlur=55; mCtx.shadowColor=env.sun; mCtx.fill(); mCtx.restore();
  }

  // Mt. Fuji (fixed, env-colored)
  const fX=W2*0.58, fBase=H2*0.82, fW=W2*0.50, fH=H2*0.70;
  const mc2=env.mountCol||['rgba(140,150,165,0.90)','rgba(100,115,138,0.88)','rgba(72,85,110,0.88)','rgba(50,62,85,0.82)'];
  mCtx.save();
  const fjG=mCtx.createLinearGradient(fX,fBase-fH,fX,fBase);
  fjG.addColorStop(0,mc2[0]); fjG.addColorStop(0.22,mc2[1]); fjG.addColorStop(0.60,mc2[2]); fjG.addColorStop(1,mc2[3]);
  mCtx.fillStyle=fjG;
  mCtx.beginPath(); mCtx.moveTo(fX-fW*0.60,fBase); mCtx.lineTo(fX-fW*0.13,fBase-fH*0.54); mCtx.lineTo(fX,fBase-fH); mCtx.lineTo(fX+fW*0.16,fBase-fH*0.50); mCtx.lineTo(fX+fW*0.60,fBase); mCtx.closePath(); mCtx.fill();
  mCtx.globalAlpha=0.18; mCtx.fillStyle='rgba(0,0,30,1)'; mCtx.beginPath(); mCtx.moveTo(fX+fW*0.05,fBase-fH*0.58); mCtx.lineTo(fX+fW*0.60,fBase); mCtx.lineTo(fX,fBase); mCtx.closePath(); mCtx.fill(); mCtx.globalAlpha=1;
  if(env.id==='spring'||env.id==='morning'||env.id==='rain'){
    mCtx.fillStyle=env.id==='rain'?'rgba(190,205,225,0.75)':'rgba(248,253,255,0.96)';
    mCtx.beginPath(); mCtx.moveTo(fX-fW*0.10,fBase-fH*0.72); mCtx.bezierCurveTo(fX-fW*0.05,fBase-fH*0.83,fX,fBase-fH*0.90,fX,fBase-fH); mCtx.bezierCurveTo(fX+fW*0.03,fBase-fH*0.87,fX+fW*0.08,fBase-fH*0.77,fX+fW*0.12,fBase-fH*0.67); mCtx.lineTo(fX+fW*0.04,fBase-fH*0.57); mCtx.lineTo(fX,fBase-fH*0.64); mCtx.lineTo(fX-fW*0.04,fBase-fH*0.56); mCtx.closePath(); mCtx.fill();
  }
  if(env.id==='cyber'){ mCtx.strokeStyle='rgba(200,0,255,0.50)'; mCtx.lineWidth=2; mCtx.shadowBlur=14; mCtx.shadowColor='#ff00ff'; mCtx.beginPath(); mCtx.moveTo(fX-fW*0.60,fBase); mCtx.lineTo(fX,fBase-fH); mCtx.lineTo(fX+fW*0.60,fBase); mCtx.stroke(); mCtx.shadowBlur=0; }
  mCtx.restore();

  // Clouds (env-colored, seamlessly loop)
  const clOff=(menuBGFrame*spd*0.35)%(W2+300);
  for(let ci=0;ci<7;ci++){
    const cx3=((ci*W2/5.5+120)-clOff+W2*2)%(W2+ci*30+120)-ci*15-60;
    const cy3=H2*(0.06+ci%3*0.05);
    const cw3=75+ci*20, ch3=28+ci*8;
    mCtx.save(); mCtx.globalAlpha=env.cloudAlpha??0.88;
    mCtx.fillStyle=env.cloudCol??'#ffffff';
    const np=Math.max(3,Math.ceil(cw3/28));
    for(let pi=0;pi<np;pi++){ mCtx.beginPath(); mCtx.arc(cx3+pi*(cw3/(np-0.5)),cy3+ch3*0.28,(ch3*(0.52+0.24*Math.sin(pi*2+1)))*0.70,0,Math.PI*2); mCtx.fill(); }
    mCtx.beginPath(); mCtx.ellipse(cx3+cw3/2,cy3+ch3*0.66,cw3*0.46,ch3*0.35,0,0,Math.PI*2); mCtx.fill();
    mCtx.restore();
  }

  // Scrolling hills (spring/morning only)
  if(env.isBright||env.id==='morning'){
    mCtx.save(); mCtx.globalAlpha=env.id==='morning'?0.48:0.65;
    const hG3=mCtx.createLinearGradient(0,H2*0.54,0,H2*0.82);
    hG3.addColorStop(0,'rgba(68,138,48,0.88)'); hG3.addColorStop(1,'rgba(44,98,22,0.55)');
    mCtx.fillStyle=hG3; mCtx.beginPath(); mCtx.moveTo(-10,H2*0.82);
    const hOff3=(menuBGFrame*spd*0.18)%W2;
    for(let hx3=-hOff3;hx3<=W2+W2;hx3+=W2/14) mCtx.lineTo(hx3,H2*(0.54+0.08*Math.sin(hx3*0.014+0.6)));
    mCtx.lineTo(W2+10,H2*0.82); mCtx.closePath(); mCtx.fill(); mCtx.restore();
  }

  // Buildings — TRUE seamless loop: compute totalWidth, draw at [x, x+total, x-total]
  const totalBW=menuBGBldgs.reduce((s,b)=>s+b.w+6,0)||W2;
  const scrollOff=(menuBGFrame*spd)%totalBW;
  menuBGBldgs.forEach(b=>{
    const baseX=b.x-scrollOff;
    [-totalBW, 0, totalBW].forEach(offset=>{
      const bx2=baseX+offset;
      if(bx2+b.w<-5||bx2>W2+5) return;
      const by2=H2*0.82-b.h;
      const wg=mCtx.createLinearGradient(bx2,by2,bx2,by2+b.h);
      wg.addColorStop(0,b.wall||env.wallColor||'rgba(210,175,110,0.90)'); wg.addColorStop(1,'rgba(0,0,0,0.65)');
      mCtx.fillStyle=wg; mCtx.fillRect(bx2,by2,b.w,b.h);
      // Roof
      mCtx.fillStyle=b.rc||env.roofColor||'#5a3820';
      mCtx.beginPath(); mCtx.moveTo(bx2-4,by2); mCtx.lineTo(bx2+b.w/2,by2-b.h*0.19); mCtx.lineTo(bx2+b.w+4,by2); mCtx.closePath(); mCtx.fill();
      mCtx.fillStyle='rgba(20,10,3,0.85)'; mCtx.fillRect(bx2-4,by2-2,b.w+8,3);
      // Windows
      const wr2=Math.floor(b.h/22),wc2=Math.floor(b.w/20);
      for(let row=0;row<wr2;row++) for(let col=0;col<wc2;col++){
        if(((row*wc2+col)*1237+17)%100<40){ mCtx.fillStyle=b.wc||env.win(Math.random()); mCtx.fillRect(bx2+col*20+4,by2+row*22+5,13,14); }
      }
      if(b.sign){
        mCtx.fillStyle='rgba(190,50,15,0.90)'; rRect(mCtx,bx2+b.w*0.18,by2+b.h*0.10,b.w*0.64,b.h*0.12,3); mCtx.fill();
        mCtx.font=`bold ${Math.min(10,b.w*0.22)}px 'Noto Serif JP',serif`;
        mCtx.fillStyle='#fffde0'; mCtx.textAlign='center'; mCtx.textBaseline='middle';
        mCtx.fillText(b.signTxt,bx2+b.w*0.5,by2+b.h*0.165);
      }
    });
  });

  // Cobblestone ground
  const gg=mCtx.createLinearGradient(0,H2*0.82,0,H2);
  gg.addColorStop(0,env.roadColor||'#b8a898'); gg.addColorStop(0.3,'#907868'); gg.addColorStop(1,'#605040');
  mCtx.fillStyle=gg; mCtx.fillRect(0,H2*0.82,W2,H2*0.18);
  mCtx.fillStyle='rgba(70,155,40,0.82)'; mCtx.fillRect(0,H2*0.82,W2,4);
  mCtx.strokeStyle='rgba(60,45,28,0.22)'; mCtx.lineWidth=1;
  const cobOff2=(menuBGFrame*spd*0.55)%44|0;
  for(let cy2=H2*0.82+4;cy2<H2;cy2+=17){
    const rOff=((Math.floor((cy2-H2*0.82)/17))%2===0)?0:22;
    for(let cx2=-cobOff2+rOff-44;cx2<W2+44;cx2+=44){
      mCtx.fillStyle=`rgba(${175+((cx2+cy2)%18-9)|0},${158+((cx2+cy2)%10-5)|0},130,0.55)`;
      rRect(mCtx,cx2+1,cy2,40,14,2); mCtx.fill();
      rRect(mCtx,cx2+1,cy2,40,14,2); mCtx.stroke();
    }
  }

  // Sakura petals
  menuBGSakura.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotSpd;
    if(p.y>H2+12){p.y=-12;p.x=Math.random()*W2;}
    if(p.x<-12) p.x=W2+12; if(p.x>W2+12) p.x=-12;
    mCtx.save(); mCtx.translate(p.x,p.y); mCtx.rotate(p.rot);
    mCtx.globalAlpha=p.alpha; mCtx.fillStyle=env.petal||'#ffb7c5';
    mCtx.beginPath(); mCtx.ellipse(0,0,p.sz,p.sz*0.5,0,0,Math.PI*2); mCtx.fill();
    mCtx.restore();
  });

  // Fog tint
  mCtx.fillStyle=env.fogTint||'rgba(0,0,0,0.04)'; mCtx.fillRect(0,0,W2,H2);
  // Vignette
  const vg=mCtx.createRadialGradient(W2/2,H2/2,H2*0.22,W2/2,H2/2,H2*0.85);
  vg.addColorStop(0,'transparent'); vg.addColorStop(1,'rgba(2,1,8,0.48)');
  mCtx.fillStyle=vg; mCtx.fillRect(0,0,W2,H2);
}

let menuAnimId=null;
function startMenuBGLoop(){
  if(menuAnimId)cancelAnimationFrame(menuAnimId);menuAnimId=null;
  const mc=document.getElementById('menuCanvas');if(!mc)return;
  function frame(){
    if(!['menu','charselect','envselect','howto','settings'].includes(S.screen)){menuAnimId=null;return;}
    animateMenuBG(mc);menuAnimId=requestAnimationFrame(frame);
  }
  menuAnimId=requestAnimationFrame(frame);
}

// =====================================================
// § 26  GAME STATES
// =====================================================
function startGame(){
  if(!aCtx)initAudio();else applyVolumes();
  S.score=0;S.combo=0;S.maxCombo=0;S.comboTimer=0;
  S.speed=CFG.BASE_SPEED*DIFF[Settings.difficulty].spd;
  S.frame=0;S.startTime=performance.now();S.diff=1;
  S.obsTimer=0;S.enmTimer=0;S.pwrTimer=0;S.coinTimer=0;
  obstacles=[];enemies=[];powerups=[];bullets=[];coins=[];hearts=[];P_pool=[];FT=[];
  worldOff=0;sakTimer=0;damageFlashAlpha=0;stepTimer=0;
  Player.init();resizeCanvas();genBG();initTerrain();initVillageDecos();
  showScreen(null);
  document.getElementById('hud').classList.remove('hidden');
  const isMobile=('ontouchstart' in window)||navigator.maxTouchPoints>0||window.innerWidth<900;
  if(isMobile){
    document.getElementById('mobileControls').classList.remove('hidden');
  }
  updateHUD();startMusic();S.screen='playing';lastT=performance.now();
  rafId=requestAnimationFrame(gameLoop);
}
function pauseGame(){
  if(S.screen!=='playing')return;S.screen='paused';stopMusic();
  if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  document.getElementById('pauseScreen').classList.remove('hidden');
}
function resumeGame(){
  if(S.screen!=='paused')return;
  document.getElementById('pauseScreen').classList.add('hidden');
  S.screen='playing';startMusic();lastT=performance.now();rafId=requestAnimationFrame(gameLoop);
}
function gameOver(){
  S.screen='gameover';stopMusic();if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  SFX.go();S.playTime=(performance.now()-S.startTime)/1000;
  try{localStorage.setItem('nmr_hs',Math.floor(S.hs));}catch(e){}
  document.getElementById('goScore').textContent=String(Math.floor(S.score)).padStart(6,'0');
  document.getElementById('goHighScore').textContent=String(Math.floor(S.hs)).padStart(6,'0');
  const m=Math.floor(S.playTime/60),sec=Math.floor(S.playTime%60);
  document.getElementById('goTime').textContent=`${m}:${String(sec).padStart(2,'0')}`;
  document.getElementById('goCombo').textContent=`${S.maxCombo}x`;
  const prev=parseInt((()=>{try{return localStorage.getItem('nmr_hs_prev')||'0';}catch(e){return '0';}})());
  document.getElementById('newRecord').classList.toggle('hidden',Math.floor(S.score)<=prev);
  try{localStorage.setItem('nmr_hs_prev',Math.floor(S.hs));}catch(e){}
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('mobileControls').classList.add('hidden');
  showScreen('gameOverScreen');
}
function goMenu(){
  Settings.save();S.screen='menu';stopMusic();
  if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('mobileControls').classList.add('hidden');
  S.hs=Math.max(S.hs,parseInt(localStorage.getItem('nmr_hs')||'0'));
  document.getElementById('menuHighScore').textContent=String(Math.floor(S.hs)).padStart(6,'0');
  showScreen('mainMenu');
  if(!aCtx)initAudio();else applyVolumes();
  initMenuBG();startMenuBGLoop();startMenuMusic();
}
function showScreen(id){
  ['mainMenu','charSelectScreen','envSelectScreen','howToPlay','settingsScreen','pauseScreen','gameOverScreen']
    .forEach(s=>document.getElementById(s).classList.add('hidden'));
  if(id)document.getElementById(id).classList.remove('hidden');
}

// =====================================================
// § 27  CHARACTER SELECT
// =====================================================
let charIdx=0, charAnimId=null;
function openCharSelect(){
  charIdx=Math.max(0,CHARS.findIndex(c=>c.id===Settings.charId));
  S.screen='charselect';showScreen('charSelectScreen');
  buildCharDots();updateCharUI();startCharPreview();
  if(!aCtx)initAudio();
}
function buildCharDots(){
  const d=document.getElementById('charDots');d.innerHTML='';
  CHARS.forEach((_,i)=>{
    const dot=document.createElement('div');dot.className='cs-dot'+(i===charIdx?' active':'');
    dot.addEventListener('click',()=>{charIdx=i;updateCharUI();buildCharDots();SFX.ui();});d.appendChild(dot);
  });
}
function updateCharUI(){
  const ch=CHARS[charIdx];
  document.getElementById('csCharName').textContent=ch.name;
  document.getElementById('csCharRole').textContent=ch.role;
  document.getElementById('csCharDesc').textContent=ch.desc;
  document.getElementById('csWeapon').textContent=ch.weapon;
  // Rarity badge
  const rarityEl=document.getElementById('csRarityBadge');
  if(rarityEl){
    rarityEl.textContent='◆ '+(ch.rarity||'RARE');
    rarityEl.className='cs-rarity-badge cs-rarity-'+(ch.rarity||'RARE').toLowerCase();
  }
  // Legacy fallback
  const rarityEl2=document.getElementById('csRarity');
  if(rarityEl2){rarityEl2.textContent=ch.rarity||'RARE';rarityEl2.style.color=ch.rarity==='LEGENDARY'?'#f5c842':ch.rarity==='EPIC'?'#b060ff':'#4ab0ff';}
  // Skill block
  const skillBlock=document.getElementById('csSkillBlock');
  if(skillBlock){
    skillBlock.innerHTML=`<div class="cs-skill-tag"><span class="cs-skill-name" style="color:${ch.accentColor}">${ch.skillName||''}</span><span class="cs-skill-desc">${ch.skillDesc||''}</span></div>`;
  }
  const skillEl=document.getElementById('csSkill');
  if(skillEl)skillEl.innerHTML=`<span style="color:${ch.accentColor}">${ch.skillName||''}</span> — ${ch.skillDesc||''}`;
  document.getElementById('csStats').innerHTML=[['SPEED',ch.spd],['ATTACK',ch.atk],['DEFENSE',ch.hp]].map(([l,v])=>`<div class="cs-stat-row"><div class="cs-stat-label">${l}</div><div class="cs-stat-track"><div class="cs-stat-fill" style="width:${v*10}%;background:linear-gradient(90deg,${ch.accentColor},${ch.accentColor}cc);box-shadow:0 0 8px ${ch.accentColor}88"></div></div><div class="cs-stat-num">${v}</div></div>`).join('');
  // Update selected tag
  const stag=document.getElementById('csSelectedTag');
  if(stag){ const cur=CHARS.find(c=>c.id===Settings.charId); stag.textContent=cur?`ACTIVE: ${cur.name}`:''; }
}
function startCharPreview(){
  if(charAnimId)cancelAnimationFrame(charAnimId);
  const cp=document.getElementById('charPreviewCanvas');if(!cp)return;
  cp.width=280;cp.height=340;
  const cc=cp.getContext('2d');
  let frame=0,animT=0,af=0,rotY=0,rotSpd=0.022;
  const SHADOW_COL='rgba(0,0,0,0.55)';

  function draw3DChar(ctx2,ch,rx,ry,rz,cx2,cy2,sc2,af2,t){
    // Simple fake-3D: project body parts with sin(rotY) for left/right perspective
    const sinR=Math.sin(ry), cosR=Math.cos(ry);
    const skew=sinR*0.22; // body lean
    const depthL=0.7+cosR*0.3, depthR=0.7-cosR*0.3; // limb depth cue
    const bob=Math.sin(t*0.07)*3;
    const W2=sc2*0.55, H2=sc2*1.0;
    const lx=cx2-W2/2, ty2=cy2-H2/2;

    // === SHADOW ===
    ctx2.save();
    ctx2.globalAlpha=0.35+Math.abs(sinR)*0.12;
    ctx2.fillStyle=SHADOW_COL;
    ctx2.beginPath();
    ctx2.ellipse(cx2+sinR*18,cy2+H2/2+10,W2*0.72,10,0,0,Math.PI*2);
    ctx2.fill();
    ctx2.restore();

    // === BACK ARM (depth behind body) ===
    const backArmX=cx2+sinR*W2*0.45+Math.cos(t*0.07)*8*(1-Math.abs(sinR));
    const backArmAlpha=depthL*0.75;
    ctx2.save();
    ctx2.globalAlpha=backArmAlpha;
    ctx2.fillStyle=ch.jacketColor;
    ctx2.beginPath();
    ctx2.roundRect(backArmX-W2*0.12,ty2+H2*0.25,W2*0.22,H2*0.42,4);
    ctx2.fill();
    ctx2.restore();

    // === BACK LEG ===
    const legSwing=Math.sin(t*0.07)*18;
    const backLegX=cx2+sinR*W2*0.20;
    ctx2.save();
    ctx2.globalAlpha=depthL*0.80;
    ctx2.fillStyle=ch.jacketColor;
    // Thigh
    ctx2.save(); ctx2.translate(backLegX,ty2+H2*0.64);
    ctx2.rotate((-legSwing*0.7)*Math.PI/180);
    ctx2.fillRect(-W2*0.13,0,W2*0.26,H2*0.22); ctx2.restore();
    // Shin
    ctx2.save(); ctx2.translate(backLegX,ty2+H2*0.86);
    ctx2.rotate((legSwing*0.4)*Math.PI/180);
    ctx2.fillStyle=ch.bodyColor;
    ctx2.fillRect(-W2*0.11,0,W2*0.22,H2*0.18); ctx2.restore();
    ctx2.restore();

    // === TORSO (main body) ===
    ctx2.save();
    ctx2.shadowBlur=20; ctx2.shadowColor=ch.accentColor;
    // Jacket body
    ctx2.fillStyle=ch.jacketColor;
    const tw=W2*(0.85+Math.abs(sinR)*0.08);
    const tx3=cx2-tw/2+sinR*W2*0.06;
    ctx2.beginPath(); ctx2.roundRect(tx3,ty2+H2*0.26+bob,tw,H2*0.40,6); ctx2.fill();
    // Chest stripe / detail
    ctx2.fillStyle=ch.accentColor;
    ctx2.globalAlpha=0.45;
    ctx2.fillRect(tx3+tw*0.28,ty2+H2*0.28+bob,tw*0.44,H2*0.06);
    ctx2.globalAlpha=1;
    ctx2.restore();

    // === HEAD ===
    const headX=cx2+sinR*W2*0.10;
    ctx2.save();
    ctx2.shadowBlur=18; ctx2.shadowColor=ch.accentColor;
    // Neck
    ctx2.fillStyle=ch.bodyColor;
    ctx2.fillRect(headX-W2*0.08,ty2+H2*0.18+bob,W2*0.16,H2*0.11);
    // Head
    ctx2.fillStyle=ch.bodyColor;
    ctx2.beginPath(); ctx2.roundRect(headX-W2*0.30,ty2+bob,W2*0.60,H2*0.22,8); ctx2.fill();
    // Hair / helmet
    ctx2.fillStyle=ch.jacketColor;
    ctx2.beginPath(); ctx2.roundRect(headX-W2*0.32,ty2-H2*0.04+bob,W2*0.64,H2*0.12,6); ctx2.fill();
    // Eyes
    const eyeOff=sinR*W2*0.08;
    ctx2.fillStyle=ch.accentColor; ctx2.shadowBlur=10; ctx2.shadowColor=ch.accentColor;
    const eyeY=ty2+H2*0.08+bob;
    if(cosR>-0.1){
      ctx2.beginPath(); ctx2.ellipse(headX+eyeOff+W2*0.08,eyeY,3.5*Math.max(0.1,cosR),2.5,0,0,Math.PI*2); ctx2.fill();
    }
    if(cosR<0.1){
      ctx2.beginPath(); ctx2.ellipse(headX+eyeOff-W2*0.08,eyeY,3.5*Math.max(0.1,-cosR),2.5,0,0,Math.PI*2); ctx2.fill();
    }
    if(Math.abs(cosR)>0.6){
      ctx2.beginPath(); ctx2.ellipse(headX+eyeOff,eyeY,3.5,2.5,0,0,Math.PI*2); ctx2.fill();
    }
    ctx2.shadowBlur=0;
    // Cap brim
    ctx2.fillStyle=ch.accentColor; ctx2.globalAlpha=0.7;
    ctx2.beginPath(); ctx2.roundRect(headX-W2*0.38,ty2-H2*0.01+bob,W2*0.76,H2*0.06,3); ctx2.fill();
    ctx2.globalAlpha=1;
    ctx2.restore();

    // === FRONT LEG ===
    const frontLegX=cx2-sinR*W2*0.18;
    ctx2.save();
    ctx2.globalAlpha=depthR;
    ctx2.fillStyle=ch.jacketColor;
    ctx2.save(); ctx2.translate(frontLegX,ty2+H2*0.64);
    ctx2.rotate((legSwing*0.8)*Math.PI/180);
    ctx2.fillRect(-W2*0.14,0,W2*0.28,H2*0.22); ctx2.restore();
    ctx2.fillStyle=ch.bodyColor;
    ctx2.save(); ctx2.translate(frontLegX,ty2+H2*0.86);
    ctx2.rotate((-legSwing*0.45)*Math.PI/180);
    ctx2.fillRect(-W2*0.12,0,W2*0.24,H2*0.18); ctx2.restore();
    // Shoe
    ctx2.fillStyle=ch.accentColor;
    ctx2.beginPath(); ctx2.roundRect(frontLegX-W2*0.18,ty2+H2*0.99,W2*0.36,H2*0.08,4); ctx2.fill();
    ctx2.restore();

    // === FRONT ARM ===
    const armSwing=Math.sin(t*0.07+Math.PI)*14;
    const frontArmX=cx2-sinR*W2*0.42+Math.cos(t*0.07+Math.PI)*7*(1-Math.abs(sinR));
    ctx2.save();
    ctx2.globalAlpha=depthR*0.95;
    ctx2.fillStyle=ch.jacketColor; ctx2.shadowBlur=8; ctx2.shadowColor=ch.accentColor+'66';
    ctx2.save(); ctx2.translate(frontArmX,ty2+H2*0.27);
    ctx2.rotate((armSwing)*Math.PI/180);
    ctx2.beginPath(); ctx2.roundRect(-W2*0.11,0,W2*0.22,H2*0.36,4); ctx2.fill();
    // Hand
    ctx2.fillStyle=ch.bodyColor;
    ctx2.beginPath(); ctx2.arc(0,H2*0.38,W2*0.12,0,Math.PI*2); ctx2.fill();
    ctx2.restore();
    ctx2.restore();

    // === ACCENT GLOW LINES ===
    ctx2.save();
    ctx2.globalAlpha=0.22+0.12*Math.sin(t*0.05);
    ctx2.strokeStyle=ch.accentColor; ctx2.lineWidth=1.5; ctx2.shadowBlur=8; ctx2.shadowColor=ch.accentColor;
    ctx2.beginPath(); ctx2.moveTo(tx3+tw*0.1,ty2+H2*0.32+bob); ctx2.lineTo(tx3+tw*0.1,ty2+H2*0.60+bob); ctx2.stroke();
    ctx2.beginPath(); ctx2.moveTo(tx3+tw*0.9,ty2+H2*0.32+bob); ctx2.lineTo(tx3+tw*0.9,ty2+H2*0.60+bob); ctx2.stroke();
    ctx2.restore();
  }

  function loop(){
    charAnimId=requestAnimationFrame(loop);
    if(S.screen!=='charselect'){cancelAnimationFrame(charAnimId);charAnimId=null;return;}
    const bgC=document.getElementById('charBgCanvas');
    if(bgC){bgC.width=window.innerWidth;bgC.height=window.innerHeight;animateMenuBG(bgC);}
    const cw=cp.width,ch_=cp.height,ch=CHARS[charIdx];
    rotY+=rotSpd;

    cc.clearRect(0,0,cw,ch_);
    // BG
    cc.fillStyle='rgba(2,1,8,0.96)'; cc.fillRect(0,0,cw,ch_);
    const cbg=cc.createRadialGradient(cw/2,ch_*0.5,5,cw/2,ch_*0.5,cw*0.88);
    cbg.addColorStop(0,ch.accentColor+'22'); cbg.addColorStop(0.55,'rgba(5,2,15,0.80)'); cbg.addColorStop(1,'transparent');
    cc.fillStyle=cbg; cc.fillRect(0,0,cw,ch_);
    // Vertical light beam
    const beam=cc.createLinearGradient(cw*0.3,0,cw*0.7,ch_*0.75);
    beam.addColorStop(0,ch.accentColor+'18'); beam.addColorStop(0.5,ch.accentColor+'0a'); beam.addColorStop(1,'transparent');
    cc.fillStyle=beam; cc.fillRect(cw*0.3,0,cw*0.4,ch_*0.75);
    // Rotating ring platform
    cc.save(); cc.globalAlpha=0.18+0.08*Math.sin(rotY*2); cc.strokeStyle=ch.accentColor; cc.lineWidth=1.2;
    for(let gi=0;gi<5;gi++){ cc.beginPath(); cc.ellipse(cw/2,ch_*0.87,28+gi*14,6+gi*2,0,0,Math.PI*2); cc.stroke(); }
    cc.restore();
    // Floor disc
    cc.fillStyle='rgba(0,0,0,0.55)'; cc.beginPath(); cc.ellipse(cw/2,ch_*0.87,62,14,0,0,Math.PI*2); cc.fill();
    cc.strokeStyle=ch.accentColor+'66'; cc.lineWidth=2; cc.beginPath(); cc.ellipse(cw/2,ch_*0.87,60,12,0,0,Math.PI*2); cc.stroke();

    animT++;if(animT>=6){animT=0;af=(af+1)%4;}
    draw3DChar(cc,ch,0,rotY,0,cw/2,ch_*0.82,220,af,frame);

    // Floating particles
    if(frame%5===0&&Settings.particles!=='low'){
      const px=cw*0.12+Math.random()*cw*0.76,py=ch_*0.18+Math.random()*ch_*0.62;
      cc.save();cc.globalAlpha=0.28+Math.random()*0.30;cc.fillStyle=ch.accentColor;cc.shadowBlur=8;cc.shadowColor=ch.accentColor;cc.beginPath();cc.arc(px,py,1.2+Math.random()*1.2,0,Math.PI*2);cc.fill();cc.restore();
    }
    // Role label
    cc.font=`bold 10px 'Orbitron',sans-serif`; cc.fillStyle=ch.accentColor;
    cc.shadowBlur=14; cc.shadowColor=ch.accentColor; cc.textAlign='center';
    cc.fillText(ch.role,cw/2,ch_-6); cc.shadowBlur=0;
    // Rarity badge
    const rc=ch.rarity==='LEGENDARY'?'#f5c842':ch.rarity==='EPIC'?'#b060ff':'#4ab0ff';
    cc.font=`bold 8px 'Orbitron',sans-serif`; cc.fillStyle=rc;
    cc.shadowBlur=8; cc.shadowColor=rc;
    cc.fillText(`◆ ${ch.rarity}`,cw/2,ch_-20); cc.shadowBlur=0;
    frame++;
  }
  loop();
}
document.getElementById('charPrev').addEventListener('click',()=>{charIdx=(charIdx-1+CHARS.length)%CHARS.length;updateCharUI();buildCharDots();SFX.ui();});
document.getElementById('charNext').addEventListener('click',()=>{charIdx=(charIdx+1)%CHARS.length;updateCharUI();buildCharDots();SFX.ui();});

// =====================================================
// § 28  ENV SELECT
// =====================================================
function openEnvSelect(){
  S.screen='envselect';showScreen('envSelectScreen');buildEnvCards();if(!aCtx)initAudio();
  const bg=document.getElementById('envBgCanvas');let envAnimId=null;
  function anim(){if(S.screen!=='envselect'){cancelAnimationFrame(envAnimId);return;}if(bg){bg.width=window.innerWidth;bg.height=window.innerHeight;animateMenuBG(bg);}envAnimId=requestAnimationFrame(anim);}
  envAnimId=requestAnimationFrame(anim);
}
function buildEnvCards(){
  const row=document.getElementById('envCardsRow');row.innerHTML='';
  ENVS.forEach(env=>{
    const card=document.createElement('div');card.className='env-card'+(env.id===Settings.envId?' env-selected':'');
    const sc=env.sky,grad=`linear-gradient(180deg,${sc[0]} 0%,${sc[2]||sc[1]} 50%,${sc[sc.length-1]} 100%)`;
    card.innerHTML=`<div class="ec-thumb" style="background:${grad};position:relative;overflow:hidden"><div style="position:absolute;bottom:0;left:0;right:0;height:24%;background:${env.roadColor||'#5a4020'}"></div><div style="position:absolute;top:26%;left:50%;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;background:radial-gradient(${env.sun},transparent);box-shadow:0 0 18px ${env.sun}"></div><div style="position:absolute;bottom:24%;left:12%;width:22%;height:38%;background:${env.roofColor||'#8a3a10'};clip-path:polygon(10% 100%,50% 0%,90% 100%)"></div><div style="position:absolute;bottom:24%;left:52%;width:18%;height:30%;background:${env.roofColor||'#8a3a10'};clip-path:polygon(10% 100%,50% 0%,90% 100%)"></div></div><div class="ec-info"><span class="ec-icon">${env.icon}</span><span class="ec-name">${env.name}</span><span class="ec-jp">${env.jp}</span></div>`;
    card.addEventListener('click',()=>{
      document.querySelectorAll('.env-card').forEach(c=>c.classList.remove('env-selected'));
      card.classList.add('env-selected');Settings.envId=env.id;Settings.save();
      document.getElementById('envDescPanel').textContent=`${env.jp} — ${env.desc}`;
      SFX.ui();initMenuBG();
    });
    row.appendChild(card);
    if(env.id===Settings.envId)document.getElementById('envDescPanel').textContent=`${env.jp} — ${env.desc}`;
  });
}

// =====================================================
// § 29  SETTINGS
// =====================================================
function openSettings(from){Settings._prevScreen=from||S.screen;S.screen='settings';showScreen('settingsScreen');if(!aCtx)initAudio();}
function closeSettings(){
  SFX.ui();Settings.save();applyVolumes();
  const prev=Settings._prevScreen;
  if(prev==='paused'){S.screen='paused';showScreen('pauseScreen');}
  else if(prev==='playing'){resumeGame();}
  else{goMenu();}
}

// =====================================================
// § 30  UI EVENTS
// =====================================================
document.getElementById('btnPlay').addEventListener('click',()=>{SFX.ui();startGame();});
document.getElementById('btnCharSelect').addEventListener('click',()=>{SFX.ui();openCharSelect();});
document.getElementById('btnEnvSelect').addEventListener('click',()=>{SFX.ui();openEnvSelect();});
document.getElementById('btnHowTo').addEventListener('click',()=>{SFX.ui();S.screen='howto';showScreen('howToPlay');if(!aCtx)initAudio();});
document.getElementById('btnSettings').addEventListener('click',()=>{SFX.ui();openSettings('menu');});
document.getElementById('btnCloseChar').addEventListener('click',()=>{SFX.ui();goMenu();});
document.getElementById('btnCloseEnv').addEventListener('click',()=>{SFX.ui();Settings.save();goMenu();});
document.getElementById('btnCloseHTP').addEventListener('click',()=>{SFX.ui();goMenu();});
document.getElementById('btnCloseSettings').addEventListener('click',closeSettings);
document.getElementById('btnConfirmChar').addEventListener('click',()=>{SFX.ui();Settings.charId=CHARS[charIdx].id;Settings.save();goMenu();});
document.getElementById('btnConfirmEnv').addEventListener('click',()=>{SFX.ui();Settings.save();goMenu();});
document.getElementById('btnPause').addEventListener('click',pauseGame);
document.getElementById('btnResume').addEventListener('click',()=>{SFX.ui();resumeGame();});
document.getElementById('btnRestartPause').addEventListener('click',startGame);
document.getElementById('btnPauseSettings').addEventListener('click',()=>{SFX.ui();openSettings('paused');});
document.getElementById('btnMenuPause').addEventListener('click',()=>{SFX.ui();goMenu();});
document.getElementById('btnRestartGO').addEventListener('click',startGame);
document.getElementById('btnMenuGO').addEventListener('click',()=>{SFX.ui();goMenu();});

// Volume — realtime
const $mSlide=document.getElementById('settingMusic'),
      $sSlide=document.getElementById('settingSFX'),
      $mVal=document.getElementById('musicVal'),
      $sVal=document.getElementById('sfxVal');
if($mSlide){$mSlide.value=Settings.musicVol;$mVal.textContent=Settings.musicVol;}
if($sSlide){$sSlide.value=Settings.sfxVol;$sVal.textContent=Settings.sfxVol;}
$mSlide?.addEventListener('input',()=>{Settings.musicVol=parseInt($mSlide.value);$mVal.textContent=Settings.musicVol;applyVolumes();});
$sSlide?.addEventListener('input',()=>{Settings.sfxVol=parseInt($sSlide.value);$sVal.textContent=Settings.sfxVol;if(!aCtx)initAudio();applyVolumes();SFX.ui();});
document.querySelectorAll('.seg-b[data-diff]').forEach(b=>{
  if(b.dataset.diff===Settings.difficulty)b.classList.add('seg-on');else b.classList.remove('seg-on');
  b.addEventListener('click',()=>{document.querySelectorAll('.seg-b[data-diff]').forEach(x=>x.classList.remove('seg-on'));b.classList.add('seg-on');Settings.difficulty=b.dataset.diff;SFX.ui();Settings.save();});
});
document.querySelectorAll('.seg-b[data-particles]').forEach(b=>{
  if(b.dataset.particles===Settings.particles)b.classList.add('seg-on');else b.classList.remove('seg-on');
  b.addEventListener('click',()=>{document.querySelectorAll('.seg-b[data-particles]').forEach(x=>x.classList.remove('seg-on'));b.classList.add('seg-on');Settings.particles=b.dataset.particles;SFX.ui();});
});
document.getElementById('btnFullscreen')?.addEventListener('click',()=>{
  if(!document.fullscreenElement){document.documentElement.requestFullscreen().catch(()=>{});document.getElementById('btnFullscreen').textContent='EXIT';}
  else{document.exitFullscreen();document.getElementById('btnFullscreen').textContent='ENTER';}
});

// Mobile
function mbtn(id,dn,up){
  const b=document.getElementById(id);if(!b)return;
  b.addEventListener('touchstart',e=>{e.stopPropagation();if(!aCtx)initAudio();if(dn)dn();},{passive:true});
  b.addEventListener('touchend',e=>{e.stopPropagation();if(up)up();},{passive:true});
  b.addEventListener('mousedown',()=>{if(dn)dn();});b.addEventListener('mouseup',()=>{if(up)up();});
}
// Only dash button + shoot button now; jump/slide via canvas swipe
mbtn('mbDash',()=>{K.dash=1;K.shift=1;},()=>K.shift=0);
document.getElementById('mbShoot')?.addEventListener('touchstart',e=>{
  e.stopPropagation();
  if(!aCtx)initAudio();
  if(enemies.length){const ne=enemies.reduce((a,b)=>Math.abs(a.x-Player.x)<Math.abs(b.x-Player.x)?a:b);S.mx=ne.x+ne.w/2;S.my=ne.y+ne.h/2;}
  else{S.mx=W;S.my=Player.y+Player.h*0.35;}
  K.shoot=1;
},{passive:true});

// Canvas swipe: UP = jump, DOWN = slide, RIGHT = dash
let tx0=0,ty0=0,swipeActive=false;
canvas.addEventListener('touchstart',e=>{
  tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;
  swipeActive=true;
  if(!aCtx)initAudio();
},{passive:true});
canvas.addEventListener('touchmove',e=>{
  if(!swipeActive||S.screen!=='playing') return;
  const dx=e.touches[0].clientX-tx0,dy=e.touches[0].clientY-ty0;
  // Continuous swipe up = keep jumping intent alive (for held position)
  if(dy < -40 && Math.abs(dy)>Math.abs(dx)*0.8){
    K.jump=1;
  }
},{passive:true});
canvas.addEventListener('touchend',e=>{
  if(S.screen!=='playing'){swipeActive=false;return;}
  const dx=e.changedTouches[0].clientX-tx0,dy=e.changedTouches[0].clientY-ty0;
  swipeActive=false;
  if(Math.abs(dx)<10&&Math.abs(dy)<10) return;
  if(Math.abs(dy)>Math.abs(dx)*0.7){
    if(dy<-28){K.jump=1;} // swipe up = jump
    else if(dy>28){K.slide=1;} // swipe down = slide
  } else {
    if(dx>30){K.dash=1;} // swipe right = dash
  }
},{passive:true});

function tryLandscape(){
  // Portrait mode is fully supported — no landscape lock needed
}
document.addEventListener('touchstart',()=>{ tryLandscape(); },{once:true,passive:true});
document.addEventListener('contextmenu',e=>e.preventDefault());

// Fix: Page Visibility API — pause otomatis saat tab tidak aktif
document.addEventListener('visibilitychange',()=>{
  if(document.hidden && S.screen==='playing') pauseGame();
});

// =====================================================
// § 31  LOADING
// =====================================================
const TIPS=['🏃 EASY is fun & responsive — not slow!','⚔️ Build COMBO by collecting coins rapidly','💨 DASH through obstacles safely','🎋 SLIDE under bamboo gates','🎯 Aim with mouse + CLICK to shoot','🧧 TALISMAN blocks one incoming hit','🦅 Tengu enemies shoot — keep moving!','👹 Oni hits hard — shoot from range','🥷 Ninja enemies are fast — react quick!','🌸 SAKURA = +600 bonus score','🍜 RAMEN grants speed boost!','⬆️ Jump to platforms for bonus coins'];
function runLoading(){
  const bar=document.getElementById('loadBar'),status=document.getElementById('loadStatus'),pct=document.getElementById('loadPct'),tips=document.getElementById('loadTips');
  tips.textContent=TIPS[Math.floor(Math.random()*TIPS.length)];
  const steps=[[8,'Loading village assets...'],[20,'Growing mountains...'],[35,'Building traditional houses...'],[48,'Setting up audio system...'],[60,'Placing lanterns and shrines...'],[72,'Summoning Kitsune spirits...'],[82,'Training Oni warriors...'],[90,'Calibrating Tengu archers...'],[96,'Final preparations...'],[100,'準備完了 — Ready!']];
  let i=0;
  function next(){
    if(i>=steps.length){
      setTimeout(()=>{
        const ls=document.getElementById('loadingScreen');ls.style.opacity='0';ls.style.transition='opacity 0.8s ease';
        setTimeout(()=>{
          ls.classList.add('hidden');
          S.hs=parseInt(localStorage.getItem('nmr_hs')||localStorage.getItem('ntr_hs')||'0');
          document.getElementById('menuHighScore').textContent=String(Math.floor(S.hs)).padStart(6,'0');
          resizeCanvas();genBG();S.screen='menu';showScreen('mainMenu');
          initMenuBG();startMenuBGLoop();
          const sa=()=>{if(!aCtx)initAudio();document.removeEventListener('click',sa);document.removeEventListener('touchstart',sa);document.removeEventListener('keydown',sa);};
          document.addEventListener('click',sa,{once:true});document.addEventListener('touchstart',sa,{once:true});document.addEventListener('keydown',sa,{once:true});
        },800);
      },500);return;
    }
    const[p,msg]=steps[i];bar.style.width=p+'%';status.textContent=msg;pct.textContent=p+'%';
    i++;if(i%3===0)tips.textContent=TIPS[Math.floor(Math.random()*TIPS.length)];
    setTimeout(next,140+Math.random()*190);
  }
  next();
}
window.addEventListener('load',()=>{resizeCanvas();runLoading();});