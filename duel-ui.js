/* Capital & Consequence: first-person honor duel scene.
 * The player consciously starts a challenge earned at a real poker table.
 * A separate modal does not move the Washington map or approved city UI.
 */
(function(root){
'use strict';
let config=null,session=null,frame=null,timer=null;
const byId=id=>document.getElementById(id);
function create(){
 if(byId('capitalDuelOverlay'))return byId('capitalDuelOverlay');
 const overlay=document.createElement('div');
 overlay.id='capitalDuelOverlay';overlay.className='capital-duel-overlay';
 overlay.hidden=true;
 overlay.innerHTML=`<section class="capital-duel-scene" role="dialog" aria-modal="true"
 aria-labelledby="capitalDuelTitle">
 <header><small>WASHINGTON · FORMAL CHALLENGE</small>
 <h2 id="capitalDuelTitle">A Matter of Honor</h2>
 <button type="button" id="capitalDuelClose" aria-label="Close duel">×</button></header>
 <p id="capitalDuelStory" role="status"></p>
 <div id="capitalDuelField" class="capital-duel-field" aria-label="Opponent standing in front of you">
  <div class="capital-duel-horizon"></div>
  <div class="capital-duel-opponent" aria-hidden="true">
   <div class="capital-duel-hat"></div><div class="capital-duel-head"></div>
   <div class="capital-duel-coat"></div><div class="capital-duel-arm left"></div>
   <div class="capital-duel-arm right"></div><div class="capital-duel-leg left"></div>
   <div class="capital-duel-leg right"></div></div>
  <div id="capitalDuelAim" class="capital-duel-reticle" aria-hidden="true">+</div>
  <div id="capitalDuelSignal" class="capital-duel-signal" aria-live="assertive">READY</div>
 </div>
 <div class="capital-duel-controls">
  <button id="capitalDuelShoot" type="button" disabled>Fire</button>
  <button id="capitalDuelWide" type="button" disabled>Fire Wide</button>
  <button id="capitalDuelYield" type="button">Yield</button>
  <button id="capitalDuelAgain" type="button" hidden>Another Exchange</button>
  <button id="capitalDuelAccept" type="button" hidden>Honor Satisfied</button>
 </div>
 <p id="capitalDuelResult" role="status"></p></section>`;
 document.body.appendChild(overlay);
 byId('capitalDuelClose').onclick=()=>{if(session&&!session.finished)return;close()};
 byId('capitalDuelShoot').onclick=()=>fire('shoot');
 byId('capitalDuelWide').onclick=()=>fire('wide');
 byId('capitalDuelYield').onclick=()=>fire('yield');
 byId('capitalDuelAgain').onclick=()=>{if(session?.awaiting)round()};
 byId('capitalDuelAccept').onclick=()=>{if(session?.awaiting)finalize()};
 byId('capitalDuelField').onclick=()=>{if(session?.phase==='shoot')fire('shoot')};
 return overlay;
}
function stopClocks(){
 if(timer!==null){clearTimeout(timer);timer=null}
 if(frame!==null){cancelAnimationFrame(frame);frame=null}
}
function aiming(t){
 if(!session||session.phase!=='shoot')return;
 const elapsed=(t-session.aimStarted)/1000;
 const bob=.5+.39*Math.sin(elapsed*8.4+session.rounds*.5);
 session.aim=Math.min(.97,Math.max(.03,bob));
 byId('capitalDuelAim').style.left=(session.aim*100).toFixed(2)+'%';
 frame=requestAnimationFrame(aiming);
}
function setCountdown(n){
 if(!session)return;
 if(n===0){
  session.phase='shoot';byId('capitalDuelSignal').textContent='SHOOT!';
  byId('capitalDuelShoot').disabled=false;
  byId('capitalDuelWide').disabled=false;
  session.aimStarted=performance.now();
  frame=requestAnimationFrame(aiming);
  timer=setTimeout(()=>{if(session?.phase==='shoot')fire('late')},4500);
  return;
 }
 byId('capitalDuelSignal').textContent=String(n);
 timer=setTimeout(()=>setCountdown(n-1),900);
}
function round(){
 if(!session||session.rounds>=3)return;
 stopClocks();
 session.rounds++;session.awaiting=false;session.phase='countdown';
 for(const id of ['capitalDuelAgain','capitalDuelAccept'])
  byId(id).hidden=true;
 for(const id of ['capitalDuelShoot','capitalDuelWide'])
  byId(id).disabled=true;
 byId('capitalDuelYield').disabled=false;
 byId('capitalDuelResult').textContent='';
 byId('capitalDuelStory').textContent=session.challenge.opponent+
  ' faces you across the ground. Exchange '+session.rounds+' of 3.';
 byId('capitalDuelSignal').textContent='READY';
 timer=setTimeout(()=>setCountdown(3),650);
}
function fire(choice){
 if(!session||!['shoot','countdown'].includes(session.phase))return false;
 if(choice==='shoot'&&session.phase!=='shoot')return false;
 if(choice==='wide'&&session.phase!=='shoot')return false;
 const late=choice==='late';
 stopClocks();session.phase='resolved';
 const action=choice==='yield'?'yield':choice==='wide'?'wide':'shoot';
 const shot=late?0:1-Math.min(1,Math.abs(session.aim-.5)*2);
 const duel=root.FE_DUELS;
 const outcome=duel.exchange({
  marksmanship:session.marksmanship,observation:session.observation,
  opponentSkill:session.challenge.opponentSkill,
  aim:shot,action,timely:!late,
 });
 if(!outcome)return false;
 session.last=outcome;
 byId('capitalDuelSignal').textContent=late?'TOO LATE':action==='yield'?'YIELD':'FIRE!';
 byId('capitalDuelResult').textContent=
  (outcome.player==='wounded'?'Your shot struck the opponent. ':
  outcome.player==='killed'?'Your opponent fell. ':
  outcome.player==='fired-wide'?'You deliberately fired wide. ':
  outcome.player==='yielded'?'You yielded. ':'Your shot missed. ')+
  (outcome.opponent==='wounded'?'The opponent struck you. ':
   outcome.opponent==='killed'?'You fell from the opponent’s shot. ':
   outcome.opponent==='held-fire'?'The opponent held fire. ':
   'The opponent missed.');
 byId('capitalDuelYield').disabled=true;
 if(outcome.result==='honor-exchanged'&&session.rounds<3){
  session.awaiting=true;
  byId('capitalDuelAgain').hidden=false;
  byId('capitalDuelAccept').hidden=false;
  byId('capitalDuelStory').textContent='Both survived without injury. Accept the exchange or reload.';
  return true;
 }
 finalize();
 return true;
}
function finalize(){
 if(!session||session.finished||!session.last)return false;
 const duel=root.FE_DUELS;
 const done=config?.onSettle?.(session.challenge,session.last,session.rounds);
 if(done!==true){
  // A failed clock/save transaction must never trap the player behind an
  // unclosable duel. The challenge remains pending for a later fresh attempt.
  session.finished=true;session.phase='failed';session.awaiting=false;
  byId('capitalDuelAgain').hidden=true;byId('capitalDuelAccept').hidden=true;
  byId('capitalDuelSignal').textContent='UNRECORDED';
  byId('capitalDuelResult').textContent='The result could not be recorded. No duel result was saved. Close and retry later.';
  byId('capitalDuelClose').textContent='Close';
  return false;
 }
 session.finished=true;session.phase='finished';session.awaiting=false;
 byId('capitalDuelAgain').hidden=true;byId('capitalDuelAccept').hidden=true;
 byId('capitalDuelStory').textContent='The exchange is recorded in your personal history.';
 byId('capitalDuelSignal').textContent='CONCLUDED';
 byId('capitalDuelClose').textContent='Close';
 config?.refresh?.();
 return true;
}
function close(){
 stopClocks();
 const overlay=byId('capitalDuelOverlay');if(overlay)overlay.hidden=true;
 session=null;config?.refresh?.();
}
function launch(challenge,skills={}){
 if(!challenge||challenge.status!=='pending'||session)return false;
 const overlay=create();overlay.hidden=false;
 session={challenge,marksmanship:Number(skills.marksmanship)||0,
  observation:Number(skills.observation)||0,phase:'ready',rounds:0,aim:.5,
  last:null,finished:false,awaiting:false,aimStarted:0};
 byId('capitalDuelTitle').textContent='A Matter of Honor · '+challenge.opponent;
 byId('capitalDuelClose').textContent='×';
 round();return true;
}
function bind(options){
 if(!options||typeof options.getSave!=='function'||typeof options.getLocation!=='function'||
  typeof options.onSettle!=='function')return false;
 config=options;refresh();return true;
}
function refresh(){
 const panel=byId('cityRoomDuel'),button=byId('cityRoomDuelChallenge');
 if(!panel||!button||!config||!root.FE_DUELS)return;
 const save=config.getSave(),location=config.getLocation();
 const pending=save&&location&&root.FE_DUELS.pendingAt(save,location);
 panel.hidden=!pending;
 if(pending){
  byId('cityRoomDuelNotice').textContent=
   pending.opponent+' has issued a challenge after your dispute at the card table.';
  button.onclick=()=>launch(pending,{
   marksmanship:root.FE_SKILLS?.level?.(save,'marksmanship')||0,
   observation:root.FE_SKILLS?.level?.(save,'observation')||0
  });
 }
}
const api=Object.freeze({bind,refresh,launch,close,get active(){return !!session}});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_DUEL_UI=api;
})(typeof window!=='undefined'?window:globalThis);
