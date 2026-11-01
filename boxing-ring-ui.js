/* Original 32px ring presentation. Scoped controls, no saved-world mutation. */
(function(root){'use strict';
if(typeof document==='undefined')return;
const G=root.FE_TOPDOWN_BOXING,C=root.FE_ROOM_BUILDER_CORE;
const box=document.getElementById('boxingModule');
if(!box||!C||!G)return;
const intro=box.querySelector('.boxing-head');if(!intro)return;
const el=document.createElement('section');
el.id='boxingPractice';el.className='sheet boxing-practice';
el.innerHTML='<h3>Top-Down Sparring Ring · Practice</h3>'+
'<p>WASD: move · LEFT CLICK: punch · HOLD RIGHT CLICK: block. Three rounds; stamina recovers only partly between bells.</p>'+
'<div class="boxing-practice-buttons"><button type="button" data-ring="start">Start Practice</button> <button type="button" data-ring="stop" disabled>End Practice</button></div>'+
'<div class="boxing-practice-stats" aria-live="off"><span id="ringRound">NO BOUT</span><span id="ringSeconds">00:00</span><span id="ringHealth">HEALTH 100</span><span id="ringStamina">STAMINA 100</span><span id="ringOpponent">OPPONENT 100</span></div>'+
'<div class="boxing-practice-viewport"><canvas id="ringCanvas" width="448" height="320" tabindex="0" aria-label="Top-down boxing ring. Use WASD, left click to punch, hold right click to block."></canvas></div>'+
'<p id="ringMessage" role="status" aria-live="polite">Practice only. No money, championship, health or game-time changes.</p>';
intro.after(el);
const canvas=el.querySelector('canvas'),ctx=canvas.getContext('2d');
const start=el.querySelector('[data-ring="start"]'),stop=el.querySelector('[data-ring="stop"]');
const v=id=>el.querySelector('#'+id);
const art=new Image();art.src='assets/artwork/spritesheet.png';
let s=null,raf=0,last=0,block=false;const held=new Set();
const visible=()=>!document.hidden&&!box.hidden&&box.getClientRects().length>0;
function drawSprite(id,x,y){
 const a=C.asset(id);
 if(!a||!art.complete||!art.naturalWidth)return;
 const [sx,sy,sw,sh]=a.atlas_rect;
 ctx.drawImage(art,sx,sy,sw,sh,x*32,y*32,32,32);
}
function draw(){
 ctx.imageSmoothingEnabled=false;ctx.fillStyle='#8b7b5b';ctx.fillRect(0,0,448,320);
 for(let y=0;y<10;y++)for(let x=0;x<14;x++)drawSprite(x===0||x===13||y===0||y===9?'floor_stone':'floor_ochre',x,y);
 for(let n=0;n<3;n++){ctx.strokeStyle=n===1?'#d9c8ad':'#953d33';ctx.lineWidth=4;ctx.strokeRect(40+n*5,40+n*5,368-n*10,240-n*10);}
 if(!s)return;
 drawSprite('laborer_'+s.opponent.face,s.opponent.x,s.opponent.y);
 drawSprite('worker_'+s.player.face,s.player.x,s.player.y);
 if(s.ai.windup){ctx.lineWidth=3;ctx.strokeStyle='#db1717';ctx.strokeRect(s.opponent.x*32+3,s.opponent.y*32+3,26,26);}
 if(s.blocking){ctx.lineWidth=4;ctx.strokeStyle='#38789e';ctx.strokeRect(s.player.x*32+2,s.player.y*32+2,28,28);}
 if(s.phase==='break'||s.phase==='finished'){
  ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(64,120,320,80);
  ctx.fillStyle='#f8ebca';ctx.font='bold 18px monospace';ctx.textAlign='center';
  ctx.fillText(s.phase==='break'?'ROUND '+s.round+' COMPLETE':'BOUT COMPLETE',224,151);
  ctx.font='14px monospace';ctx.fillText(s.phase==='break'?'Next bell: '+Math.ceil(s.breakMs/1000)+'s':s.final,224,180);
  ctx.textAlign='start';
 }
}
function stats(){
 if(!s)return;
 v('ringRound').textContent='ROUND '+s.round+' / 3';
 v('ringSeconds').textContent=s.phase==='break'?'REST '+Math.ceil(s.breakMs/1000)+'s':s.phase==='finished'?'FINAL':Math.ceil(s.roundMs/1000)+'s';
 v('ringHealth').textContent='HEALTH '+Math.ceil(s.player.health);
 v('ringStamina').textContent='STAMINA '+Math.floor(s.player.stamina)+' / '+s.player.maxStamina;
 v('ringOpponent').textContent='OPPONENT '+Math.ceil(s.opponent.health);
 v('ringMessage').textContent=s.message;
 stop.disabled=s.phase==='finished';
}
function cancel(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;held.clear();block=false;}
function tick(now){
 raf=0;
 if(!s||s.phase==='finished'){stats();draw();return;}
 if(!visible()){last=0;return;}
 const dt=last?Math.min(now-last,100):0;last=now;
 const focus=document.activeElement===canvas;
 G.step(s,dt,{dx:focus?(Number(held.has('d'))-Number(held.has('a'))):0,
  dy:focus?(Number(held.has('s'))-Number(held.has('w'))):0,block:focus&&block});
 stats();draw();
 if(s.phase!=='finished')raf=requestAnimationFrame(tick);
}
function resume(){if(s&&s.phase!=='finished'&&!raf&&visible()){last=0;raf=requestAnimationFrame(tick);}}
start.addEventListener('click',()=>{
 cancel();s=G.create(80);start.textContent='Restart Practice';stop.disabled=false;
 canvas.focus();stats();draw();resume();
});
stop.addEventListener('click',()=>{
 cancel();s=null;stop.disabled=true;start.textContent='Start Practice';
 v('ringRound').textContent='NO BOUT';v('ringSeconds').textContent='00:00';
 v('ringHealth').textContent='HEALTH 100';v('ringStamina').textContent='STAMINA 100';
 v('ringOpponent').textContent='OPPONENT 100';v('ringMessage').textContent='Practice ended; career and wagers unchanged.';draw();
});
canvas.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if('wasd'.includes(k)&&k.length===1){e.preventDefault();held.add(k);}});
canvas.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
canvas.addEventListener('pointerdown',e=>{
 if(!s||s.phase!=='fighting')return;
 canvas.focus();
 if(e.button===0){e.preventDefault();G.punch(s);stats();draw();}
 if(e.button===2){e.preventDefault();block=true;G.step(s,0,{block:true});stats();draw();}
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
root.addEventListener('pointerup',e=>{if(e.button===2)block=false;});
root.addEventListener('blur',()=>{held.clear();block=false;last=0;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){held.clear();block=false;}else resume();});
new MutationObserver(()=>{if(visible())resume();else cancel();}).observe(box,{attributes:true,attributeFilter:['hidden','style','class']});
art.addEventListener('load',draw);draw();
})(window);
