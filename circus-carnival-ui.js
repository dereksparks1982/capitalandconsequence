/* Simple rough wooden midway booths. Six games use actual clicks and saved
 * turns, never fake free prizes. No art or JS lifted from other repositories.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let ui=null,activeSave=null,startAction=null,throwAction=null,claimAction=null,waitAction=null;
function section(){
 if(ui?.isConnected)return ui;
 const holder=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!holder)return null;
 ui=document.createElement('section');ui.id='ccCircusMidway';ui.className='cc-circus-midway';ui.hidden=true;
 ui.setAttribute('aria-label','Traveling circus carnival games');
 ui.innerHTML='<h4>🎪 TRAVELING CIRCUS · MIDWAY</h4>'+
  '<p>Try your hand at the booths. Most prizes are trinkets; an occasional fine object awaits an exceptional score.</p>'+
  '<div data-midway-games class="cc-midway-games"></div>'+
  '<div data-midway-active class="cc-midway-active" hidden></div>'+
  '<div data-midway-result role="status" aria-live="polite"></div>';
 holder.prepend(ui);
 ui.addEventListener('click',e=>{
  const start=e.target.closest('[data-start-game]');
  const shot=e.target.closest('[data-midway-throw]');
  const claim=e.target.closest('[data-claim-prize]');
  const wait=e.target.closest('[data-midway-wait]');
  if(start&&typeof startAction==='function'){const r=startAction(start.dataset.startGame);show(r?.reason||r?.message||'The round has begun.');refresh();}
  else if(wait&&typeof waitAction==='function'){
   const r=waitAction();show(r?.ok?'The clockwork duck moved to lane '+r.lane+'.':r?.reason||'The target stayed still.');refresh();
  }else if(shot&&typeof throwAction==='function'){
   const r=throwAction(Number(shot.dataset.midwayThrow));
   const text=r?.finished?
    (r.tier==='none'?'No prize this time.':r.record?.prize?'Won: '+r.record.prize.name+'.':'Prize earned but awaiting room in your pockets.'):
    r?.ok?(r.hit?'Good throw! ':'Missed. ')+'+'+r.points+' points.':
    r?.reason||'No throw recorded.';
   show(text);refresh();
  }else if(claim&&typeof claimAction==='function'){
   const result=claimAction();
   show(result?.length?'Collected '+result.length+' pending prize(s).':'No prizes could be collected.');refresh();
  }
 });
 return ui;
}
function show(text){const o=ui?.querySelector('[data-midway-result]');if(o)o.textContent=String(text||'')}
function refresh(){
 if(!ui||ui.hidden||!activeSave)return;
 const engine=root.FE_CARNIVAL_GAMES,book=engine?.ensure?.(activeSave);
 const list=ui.querySelector('[data-midway-games]'),game=ui.querySelector('[data-midway-active]');
 list.replaceChildren();
 if(!book)return;
 if(book.active){
  const details=engine.preview(book.active),record=book.active;
  list.hidden=true;game.hidden=false;game.replaceChildren();
  const header=document.createElement('h5');header.textContent=details.game.name+' · '+details.game.theme;
  const stats=document.createElement('p');stats.textContent='Turn '+details.step+'/'+details.total+' · Score '+details.score;
  const help=document.createElement('p');
  help.textContent=record.key==='clockwork'?
   'The spring-driven duck is now in lane '+details.movingLane+
   '. Aim at its CURRENT position, or turn the mechanism for 30 game seconds. Up to two waits per shot.' :
   details.game.action+'. The attendant points toward the '+details.zone+' of the stall. Choose one of five positions.';
  const targets=document.createElement('div');targets.className='cc-midway-targets';
  for(let i=0;i<5;i++){
   const button=document.createElement('button');button.type='button';button.dataset.midwayThrow=String(i);
   button.textContent=record.key==='balloons'?'◯':record.key==='gallery'||record.key==='clockwork'?'♞':
    record.key==='pennies'?'▼':record.key==='bell'?'▥':record.key==='cans'?'▣':'◉';
   button.title='Aim at position '+(i+1);
   if(record.key==='clockwork'){
    button.dataset.currentTarget=String(i+1===details.movingLane);
    button.style.outline=i+1===details.movingLane?'3px solid #d9aa50':'';
   }
   button.setAttribute('aria-label','Aim at position '+(i+1));
   targets.appendChild(button);
  }
  game.append(header,stats,help,targets);
  if(record.key==='clockwork'){
   const wait=document.createElement('button');wait.type='button';wait.dataset.midwayWait='1';
   wait.textContent='Turn Clockwork · 30 Game Seconds ('+details.movesRemaining+' left)';
   wait.disabled=details.movesRemaining<=0;
   game.appendChild(wait);
  }
  return;
 }
 list.hidden=false;game.hidden=true;
 for(const [key,cfg] of Object.entries(engine.GAMES)){
  const card=document.createElement('div'),label=document.createElement('span'),btn=document.createElement('button');
  card.className='cc-midway-booth';
  label.textContent=cfg.name+' · '+cfg.theme+' · '+cfg.feeCents+'¢ · '+cfg.seconds/60+' game min';
  btn.type='button';btn.dataset.startGame=key;btn.textContent='Play';
  card.append(label,btn);list.appendChild(card);
 }
 const unclaimed=book.history.filter(r=>r.unclaimed).length;
 if(unclaimed){
  const btn=document.createElement('button');btn.type='button';btn.dataset.claimPrize='1';
  btn.textContent='Claim '+unclaimed+' stored prize'+(unclaimed>1?'s':'');
  list.appendChild(btn);
 }
}
function render(save,actions,{locationId,roomId,dev=false}={}){
 activeSave=save;
 startAction=actions?.start;throwAction=actions?.throwAt;claimAction=actions?.claim;waitAction=actions?.wait;
 const node=section();
 if(!node)return;
 const event=root.FE_CIRCUS_TOUR?.active?.(save),overlay=document.getElementById('cityRoomOverlay');
 const valid=!!event&&!dev&&locationId===event.locationId&&
  save.currentLocation?.locationId===event.locationId&&!overlay?.hidden;
 node.hidden=!valid;
 if(valid)refresh();
}
root.FE_CARNIVAL_UI=Object.freeze({render,refresh});
})(typeof window!=='undefined'?window:globalThis);
