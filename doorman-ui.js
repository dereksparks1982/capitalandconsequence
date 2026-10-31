/* Capital & Consequence: Eli Crowe's modest paid nightclub shift UI. */
(function(){
 'use strict';
 const work=window.FE_DOORMAN_DUTY;
 if(!work)throw Error('Doorman shift module must load first');
 const node=id=>document.getElementById(id);
 function current(){return window.FE_CITY?.currentLocation?.()||{}}
 function set(id,msg){const n=node(id);if(n)n.textContent=msg}
 function button(label,handler){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=handler;return b;
 }
 function mount(){
  const desk=node('careerDesk');
  if(desk&&!node('doormanDesk')){
   const area=document.createElement('section');area.className='doorman-work-box';area.id='doormanDesk';
   area.setAttribute('aria-label','Eli Crowe personal employment ledger');
   area.innerHTML='<h3>Elias “Eli” Crowe · Work Ledger</h3><p id="doormanDeskStats"></p><p id="doormanDeskInstruction"></p><p id="doormanDeskNotice" role="status"></p><h4>Recent Paid Shifts</h4><ol id="doormanDeskLog"></ol>';
   desk.querySelector('.career-desk-actions')?.before(area);
  }
  const city=document.querySelector('.city-room-placeholder');
  if(city&&!node('doormanDoorPanel')){
   const area=document.createElement('section');area.className='doorman-work-box';area.id='doormanDoorPanel';
   area.setAttribute('aria-label','Nightclub entrance work');
   area.innerHTML='<h3>Nightclub Door · On Duty</h3><p id="doormanDoorText"></p><div id="doormanDoorActions"></div><p id="doormanDoorNotice" role="status"></p>';
   city.appendChild(area);
  }
  const door=node('doormanDoorPanel');
  if(door&&!node('peacockStoryPanel')){
   const box=document.createElement('section');box.id='peacockStoryPanel';
   box.className='doorman-work-box';box.setAttribute('aria-label','Eli Crowe main story');
   const title=document.createElement('h4');title.textContent='Main Story · A Favor with a Price';
   const status=document.createElement('p');status.id='peacockStoryStatus';
   const buttons=document.createElement('div');buttons.id='peacockStoryActions';
   const notice=document.createElement('p');notice.id='peacockStoryNotice';notice.setAttribute('role','status');
   box.append(title,status,buttons,notice);door.appendChild(box);
  }
  if(door&&!node('peacockNetworkPanel')){
   const box=document.createElement('section');box.id='peacockNetworkPanel';
   box.className='doorman-work-box';box.setAttribute('aria-label','Eli criminal connections');
   const title=document.createElement('h4');title.textContent='Main Story · The Keeper of Secrets';
   const status=document.createElement('p');status.id='peacockNetworkStatus';
   const actions=document.createElement('div');actions.id='peacockNetworkActions';
   const notice=document.createElement('p');notice.id='peacockNetworkNotice';notice.setAttribute('role','status');
   box.append(title,status,actions,notice);door.appendChild(box);
  }
  if(door&&!node('peacockDebtsPanel')){
   const box=document.createElement('section');box.id='peacockDebtsPanel';
   box.className='doorman-work-box';box.setAttribute('aria-label','Eli debt decisions');
   const heading=document.createElement('h4');heading.textContent='Main Story · Debts Come Due';
   const status=document.createElement('p');status.id='peacockDebtsStatus';
   const actions=document.createElement('div');actions.id='peacockDebtsActions';
   const notice=document.createElement('p');notice.id='peacockDebtsNotice';notice.setAttribute('role','status');
   box.append(heading,status,actions,notice);door.appendChild(box);
  }
 }
 function action(type,choiceId){
  if(S.characterRoute!=='criminal'||!activeProfileId())return;
  const {locationId,roomId}=current(),allowed=work.access(S,locationId,roomId);
  if(!allowed.ok){set('doormanDoorNotice',allowed.reason);return}
  const previous=work.ensure(S).pending;
  if(type==='begin'&&previous){set('doormanDoorNotice','Finish serving the present visitor first.');return}
  if(type==='respond'&&!previous){set('doormanDoorNotice','There is no visitor to assist.');return}
  if(type==='begin'&&(work.ensure(S).segmentsByDate[S.gameDate]||0)>=work.MAX_SEGMENTS){
   set('doormanDoorNotice','The paid segments for tonight are complete.');return;
  }
  const seconds=type==='begin'?600:300;
  if(S.dayRemaining<=seconds){set('doormanDoorNotice','Too little time remains in this night shift.');return}
  const spent=window.advanceWorldTime(seconds,true);
  if(spent!==seconds){set('doormanDoorNotice','The game clock did not complete this duty period.');return}
  const result=type==='begin'
   ?work.begin(S,{locationId,roomId,date:S.gameDate,profileId:activeProfileId(),spentSeconds:spent})
   :work.respond(S,{locationId,roomId,choiceId,spentSeconds:spent});
  if(!result.ok){save(true);render();refresh();set('doormanDoorNotice',result.reason);return}
  if(type==='respond'&&result.log){
   window.FE_LIFE_HISTORY?.record?.(S,{id:'doorman:'+result.log.id+':paid',
    date:result.log.date,source:'Le Paon d’Or ordinary employment',
    text:result.log.result+' · Earned '+result.wageCents+' cents.'});
  }
  if(type==='respond'&&Array.isArray(S.notes)){
   S.notes.push({date:S.gameDate,source:'nightclub employment',text:result.log.id+' · '+result.log.result});
   if(S.notes.length>320)S.notes.shift();
  }
  save(true);render();refresh();
  set('doormanDoorNotice',type==='begin'?'A visitor is waiting. Decide how to handle the entrance.':result.log.result+' Earned $'+(result.wageCents/100).toFixed(2)+'.');
 }
 function storyAction(id){
  const story=window.FE_PEACOCK_STORY,place=current(),beforeSave=S,beforeProfile=activeProfileId();
  if(!story)return false;
  const allowed=story.preview(S,id,place.locationId,place.roomId,{dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!allowed.ok){set('peacockStoryNotice',allowed.reason);return false}
  if(S.dayRemaining<=allowed.seconds||!window.FE_WASHINGTON_TIME?.canSpend?.(S,allowed.seconds)||
     window.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=allowed.seconds){
   set('peacockStoryNotice','Not enough Washington night remains for this action.');return false;
  }
  const spent=window.advanceWorldTime(allowed.seconds,true);
  if(spent!==allowed.seconds||S!==beforeSave||activeProfileId()!==beforeProfile){
   set('peacockStoryNotice','The scene was interrupted and no choice was recorded.');return false;
  }
  const result=story.apply(S,id,place.locationId,place.roomId,
   {spentSeconds:spent,dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!result.ok){set('peacockStoryNotice',result.reason);return false}
  const saved=save(true);
  render();refresh();
  set('peacockStoryNotice',saved?result.description:'Autosave failed. Keep the game open to protect the encounter.');
  return !!saved;
 }
 function refreshStory(){
  const story=window.FE_PEACOCK_STORY,box=node('peacockStoryPanel'),buttons=node('peacockStoryActions');
  if(!story||!box||!buttons)return;
  const visible=S?.characterRoute==='criminal'&&!!activeProfileId()&&
   !node('doormanDoorPanel')?.hidden&&!window.FE_CITY?.isDevRoom?.();
  box.hidden=!visible;if(!visible)return;
  const record=story.summary(S),stage=record?.stage||'unmet';
  set('peacockStoryStatus',stage==='unmet'?'After two paid contacts, a visitor may bring a dangerous favor.':
   stage==='offered'?'An envelope awaits your choice on a later night.':
   stage==='decided'?'Your decision has been made. Return on another night.':
   'Completed: '+(record?.outcome||'resolved')+'. The choice cannot be replayed.');
  buttons.replaceChildren();
  const ids=stage==='unmet'?['hear']:stage==='offered'?['return','manager','sell']:
   stage==='decided'?['followUp']:[];
  for(const id of ids){
   const action=story.ACTIONS[id],place=current();
   const allow=story.preview(S,id,place.locationId,place.roomId);
   const b=button(action.label,()=>storyAction(id));
   b.disabled=!allow.ok||S.dayRemaining<=action.seconds;
   b.title=allow.ok?'':allow.reason;buttons.appendChild(b);
   if(!allow.ok){const msg=document.createElement('small');msg.textContent=allow.reason;buttons.appendChild(msg)}
  }
 }
 function networkAction(id){
  const story=window.FE_PEACOCK_NETWORK,place=current(),old=S,profile=activeProfileId();
  const preview=story?.preview?.(S,id,place.locationId,place.roomId,
   {dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!preview?.ok){set('peacockNetworkNotice',preview?.reason||'Unavailable');return false}
  if(S.dayRemaining<=preview.seconds||!window.FE_WASHINGTON_TIME?.canSpend?.(S,preview.seconds)||
     window.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=preview.seconds){
   set('peacockNetworkNotice','The club will close before this encounter ends.');return false;
  }
  const paid=window.advanceWorldTime(preview.seconds,true);
  if(paid!==preview.seconds||S!==old||profile!==activeProfileId()){
   set('peacockNetworkNotice','The action was interrupted. No encounter was recorded.');return false;
  }
  const outcome=story.apply(S,id,place.locationId,place.roomId,{spentSeconds:paid,
   dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!outcome.ok){set('peacockNetworkNotice',outcome.reason);return false}
  const saved=save(true);
  render();refresh();
  set('peacockNetworkNotice',saved?outcome.description:'Autosave failed; keep the game open.');
  return !!saved;
 }
 function refreshNetwork(){
  const story=window.FE_PEACOCK_NETWORK,box=node('peacockNetworkPanel'),buttons=node('peacockNetworkActions');
  if(!story||!box||!buttons)return;
  const visible=S?.characterRoute==='criminal'&&!!activeProfileId()&&
   !node('doormanDoorPanel')?.hidden&&!window.FE_CITY?.isDevRoom?.();
  box.hidden=!visible;if(!visible)return;
  const stage=story.summary(S)?.stage||'unmet';
  set('peacockNetworkStatus',stage==='unmet'?'The regular may approach after the envelope affair closes.':
   stage==='met'?'He will return another night. Decide whether to protect, exploit or report.':
   stage==='chosen'?'Your choice is recorded; consequences arrive another night.':
   'This contact has reached an outcome. It cannot be replayed.');
  buttons.replaceChildren();
  const ids=stage==='unmet'?['meet']:stage==='met'?['protect','leverage','report']:
   stage==='chosen'?['consequence']:[];
  for(const id of ids){
   const place=current(),allowed=story.preview(S,id,place.locationId,place.roomId);
   const buttonNode=button(story.ACTIONS[id].label,()=>networkAction(id));
   buttonNode.disabled=!allowed.ok||S.dayRemaining<=story.ACTIONS[id].seconds;
   buttonNode.title=allowed.reason||'';buttons.appendChild(buttonNode);
   if(!allowed.ok){const why=document.createElement('small');why.textContent=allowed.reason;buttons.appendChild(why)}
  }
 }
 function debtAction(id){
  const story=window.FE_PEACOCK_DEBTS,place=current(),old=S,profile=activeProfileId();
  if(!story)return false;
  const check=story.preview(S,id,place.locationId,place.roomId,{dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!check.ok){set('peacockDebtsNotice',check.reason);return false}
  if(S.dayRemaining<=check.seconds||!window.FE_WASHINGTON_TIME?.canSpend?.(S,check.seconds)||
     window.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=check.seconds){
   set('peacockDebtsNotice','Insufficient time to finish this conversation tonight.');return false;
  }
  const spent=window.advanceWorldTime(check.seconds,true);
  if(spent!==check.seconds||S!==old||profile!==activeProfileId()){
   set('peacockDebtsNotice','The encounter was interrupted; no choice was recorded.');return false;
  }
  const out=story.apply(S,id,place.locationId,place.roomId,{spentSeconds:spent,
   dev:!!window.FE_CITY?.isDevRoom?.()});
  if(!out.ok){set('peacockDebtsNotice',out.reason);return false}
  const stored=save(true);
  render();refresh();
  set('peacockDebtsNotice',stored?out.description:'Autosave failed; keep the game open.');
  return !!stored;
 }
 function refreshDebts(){
  const story=window.FE_PEACOCK_DEBTS,box=node('peacockDebtsPanel'),actions=node('peacockDebtsActions');
  if(!story||!box||!actions)return;
  const visible=S?.characterRoute==='criminal'&&!!activeProfileId()&&
   !node('doormanDoorPanel')?.hidden&&!window.FE_CITY?.isDevRoom?.();
  box.hidden=!visible;if(!visible)return;
  const stage=story.summary(S)?.stage||'unmet';
  set('peacockDebtsStatus',stage==='unmet'?'After dealing with the regular, a dispute over money may arise.':
   stage==='summoned'?'The claim is unverified; choose your response on a later night.':
   stage==='decided'?'Your response is on record; the regular will return.':
   'The debt dispute has reached an outcome.');
  actions.replaceChildren();
  const ids=stage==='unmet'?['summons']:stage==='summoned'?['settle','defy','disclose']:
   stage==='decided'?['consequence']:[];
  for(const id of ids){
   const place=current(),can=story.preview(S,id,place.locationId,place.roomId);
   const b=button(story.ACTIONS[id].label,()=>debtAction(id));
   b.disabled=!can.ok||S.dayRemaining<=story.ACTIONS[id].seconds;
   b.title=can.reason||'';actions.appendChild(b);
   if(!can.ok){const why=document.createElement('small');why.textContent=can.reason;actions.appendChild(why)}
  }
 }
 function refresh(){
  mount();
  const on=S?.characterRoute==='criminal'&&!!activeProfileId(),desk=node('doormanDesk'),door=node('doormanDoorPanel');
  if(desk)desk.hidden=!on;
  const loc=current();
  if(door)door.hidden=!on||loc.locationId!==work.VENUE||loc.roomId!==work.ROOM||!!node('cityRoomOverlay')?.hidden||!!window.FE_CITY?.isDevRoom?.();
  if(!on)return;
  const book=work.summary(S),pending=book.pending,totalCents=book.wagesEarnedCents;
  set('doormanDeskStats','Completed duty segments: '+book.totalSegments+' · Total shift wages earned: $'+(totalCents/100).toFixed(2)+'.');
  set('doormanDeskInstruction',pending?'You have a visitor waiting at the nightclub door. Complete that contact to earn the shift wage.':
   'You are an ordinary employee. Work begins during Washington Night. You can also spend free time elsewhere in the city.');
  const list=node('doormanDeskLog');if(list){
   list.replaceChildren();
   for(const entry of book.logs.slice(-6).reverse()){
    const li=document.createElement('li');li.textContent=entry.date+' · '+entry.id+' · '+entry.result+' ($'+(entry.wageCents/100).toFixed(2)+')';
    list.appendChild(li);
   }
   if(!book.logs.length){const li=document.createElement('li');li.textContent='No completed shifts yet.';list.appendChild(li)}
  }
  if(!door||door.hidden)return;
  refreshStory();
  refreshNetwork();
  refreshDebts();
  const choices=node('doormanDoorActions');if(!choices)return;choices.replaceChildren();
  const disabled=S.paused||S.phase!=='night';
  if(pending){
   const scene=work.encounter(S);
   set('doormanDoorText',(scene?.title||'Waiting visitor')+' · '+(scene?.description||''));
   for(const c of scene?.choices||[]){
    const b=button(c.label,()=>action('respond',c.id));b.disabled=disabled||S.dayRemaining<=300;choices.appendChild(b);
   }
  }else if((book.segmentsByDate[S.gameDate]||0)>=work.MAX_SEGMENTS){
   set('doormanDoorText','You have completed the allotted paid segments tonight. The proprietor still barely knows who you are.');
  }else{
   set('doormanDoorText',S.phase==='night'?
    'Watch the entrance, help visitors, and follow the floor manager’s directions. You hold no ownership or special rank.':
    'The nightclub door shift begins at Washington Night. You may spend daytime hours as you please.');
   const b=button('Watch the Door · 10 Minutes',()=>action('begin'));
   b.disabled=disabled||S.dayRemaining<=600;choices.appendChild(b);
  }
 }
 window.FE_DOORMAN_UI=Object.freeze({refresh});
 refresh();
})();
