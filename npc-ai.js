/* Capital & Consequence NPC intelligence slice 5.
 * Engine-independent, offline, deterministic routines and persistent decisions.
 * Mapped profiles use saved-calendar routines; legacy-unmapped profiles keep
 * their original phase routine without invented historical time.
 * NPC state belongs to the active profile. Never tick while the game is closed.
 */
(function(){
 'use strict';
 const SLOT_NAMES=Object.freeze(['early-business','late-business','early-night','late-night']);
 const DEFINITIONS=Object.freeze([
  {id:'madamStar',name:'Madam Star',occupation:'Star Club proprietor',ambition:'protect-and-develop-the-star-club',
   publicRemark:"The evening crowd does not always agree with the morning newspapers. Ask people directly, and remember which ones actually saw an event.",traits:{sociability:82,caution:79,ambition:73},places:['star','star','star','star'],
   activities:['reviewing the day’s appointments','receiving callers','overseeing the evening','concluding private business'],
   goals:['maintain-the-club','cultivate-trusted-contacts','protect-staff']},
  {id:'foremanSullivan',name:'Sullivan',occupation:'Federal Electric workshop assistant',ambition:'learn-the-electrical-trade',
   publicRemark:"I help Mr. Whitcomb with the shop's orders and apparatus. There's always another relay to check.",traits:{sociability:45,caution:81,ambition:59},places:['factory','factory',null,null],
   activities:['preparing tools and telegraph parts','assisting with orders and dispatches',null,null],
   goals:['check-workshop-tools','fill-component-orders','handle-supplies']},
  {id:'eddieDoyle',name:'Eddie Doyle',occupation:'Bookmaker',ambition:'build-a-reliable-network-of-contacts',
   publicRemark:"The race grounds are busy with talk. Half of it is hearsay, and the rest still needs checking.",traits:{sociability:91,caution:56,ambition:77},places:['races','races','star',null],
   activities:['speaking with racegoers','following the racing business','making evening introductions',null],
   goals:['expand-connections','protect-reputation','balance-finances']},
  {id:'inspectorHayes',name:'Inspector Arthur Hayes',occupation:'Police inspector',ambition:'advance-his-investigative-career',
   publicRemark:"A police report and a public rumor are different things. I cannot discuss an open investigation.",traits:{sociability:54,caution:87,ambition:81},places:['metropolitanPolice','metropolitanPolice','washingtonArena',null],
   activities:['reviewing reports','attending to District police business','visiting a public event',null],
   goals:['review-open-cases','maintain-public-order','build-professional-standing']},
  {id:'chenMei',name:'Chen Mei',occupation:'Chinatown merchant contact',ambition:'support-her-neighborhood-business',
   publicRemark:"Merchants in the neighborhood know who keeps promises. Business relationships are built through repeat visits.",traits:{sociability:76,caution:72,ambition:62},places:['oldChinatown','oldChinatown',null,null],
   activities:['speaking with neighbors','attending to merchants’ concerns',null,null],
   goals:['maintain-business','help-neighbors','develop-contacts']},
  {id:'liWen',name:'Li Wen',occupation:'Chinatown merchant contact',ambition:'develop-local-commercial-relationships',
   publicRemark:"A good price is only part of a trade. Buyers also remember whether the shipment arrived.",traits:{sociability:56,caution:75,ambition:74},places:['oldChinatown','oldChinatown',null,null],
   activities:['meeting with merchants','following new business opportunities',null,null],
   goals:['find-new-buyers','protect-local-trust','maintain-business']},
  {id:'alexiRurik',name:'Alexi Rurik',occupation:'Russian immigrant and courier',language:'ru',ambition:'build-a-life-on-his-own-terms',
   publicRemark:'Я сам решаю, кому доверять. Разговоры ничего не стоят.',
   traits:{sociability:39,caution:78,ambition:87},
   places:['russianTradeHall','races','workingPoker','star'],
   activities:['looking for a new contract','following a delivery','watching the card game','waiting for a late appointment'],
   goals:['find-honest-work','protect-allies','establish-independence']},
  {id:'pavelOrlov',name:'Pavel Orlov',occupation:'Visiting Russian merchant',languages:['en','ru'],ambition:'establish-reliable-overseas-trade',
   publicRemark:"Washington has many doors for a trader, but an introduction is not the same as a contract.",traits:{sociability:70,caution:69,ambition:78},places:['russianTradeHall','russianTradeHall','star',null],
   activities:['meeting commercial visitors','discussing engineering and trade','attending an evening gathering',null],
   goals:['develop-trade','expand-connections','protect-reputation']}
 ]);
 const BY_ID=new Map(DEFINITIONS.map(d=>[d.id,d]));
 const WORKPLACES={madamStar:'star',foremanSullivan:'factory',eddieDoyle:'races',inspectorHayes:'metropolitanPolice',chenMei:'oldChinatown',liWen:'oldChinatown',pavelOrlov:'russianTradeHall',alexiRurik:'russianTradeHall'};
 const EMPTY={version:1,seed:null,lastStep:null,agents:{},events:[]};
 function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function profile(){return typeof activeProfileId==='function'?activeProfileId():''}
 function ensure(){
  if(!profile())return null;
  const turn=Math.max(1,Math.floor(+S.turnSerial||1));
  if(!S.npcSimulation||typeof S.npcSimulation!=='object')S.npcSimulation={...EMPTY,agents:{},events:[]};
  const w=S.npcSimulation;
  w.version=1;
  if(!Number.isSafeInteger(w.seed)||w.seed<0)w.seed=hash(profile()+'|npc-schedules-v1');
  if(!w.agents||typeof w.agents!=='object')w.agents={};
  if(!Array.isArray(w.events))w.events=[];
  window.FE_NPC_KNOWLEDGE?.ensure?.(w);
  if(!Number.isSafeInteger(w.lastStep)||w.lastStep<0)w.lastStep=(turn-1)*4-1;
  for(const def of DEFINITIONS){
   if(!w.agents[def.id]||typeof w.agents[def.id]!=='object'){
    w.agents[def.id]={
     id:def.id,locationId:null,status:'unscheduled',activity:null,goal:def.goals[0],
     energy:80,relationships:{},memories:[],lastStep:w.lastStep
    };
   }
   const a=w.agents[def.id];
   if(!a.relationships||typeof a.relationships!=='object')a.relationships={};
   if(!Array.isArray(a.memories))a.memories=[];
   if(!Number.isFinite(+a.energy))a.energy=80;
  }
  return w;
 }
 function stepForState(){
  const phase=S.phase;
  if(phase!=='day'&&phase!=='night')return null;
  const turn=Math.max(1,Math.floor(+S.turnSerial||1));
  const max=phase==='day'?3600:3600;
  const remaining=Math.max(0,Math.min(max,Math.floor(+S.dayRemaining||0)));
  const late=(max-remaining)>=max/2?1:0;
  return (turn-1)*4+(phase==='day'?0:2)+late;
 }
 function observedDate(){
  const now=S.worldCalendarStatus==='ready'?window.FE_CALENDAR_BRIDGE?.moment?.(S):null;
  return now?.date||String(S.gameDate||'');
 }
 function exchangeLocalRumors(w,absolute,turnOverride=null){
  const knowledge=window.FE_NPC_KNOWLEDGE,date=observedDate();
  if(!knowledge||!/^\d{4}-\d{2}-\d{2}$/.test(date))return 0;
  let exchanged=0;
  // No broadcasts or global reputation query. Only physically co-located,
  // currently present people with a sufficiently confident report may talk.
  for(const speaker of DEFINITIONS){
   const from=w.agents[speaker.id];
   if(!from||from.status!=='present'||!from.locationId||!from.roomId)continue;
   const facts=knowledge.knownFacts(w,speaker.id).filter(r=>window.FE_NPC_RUMORS?.shareable?.(r)).slice(-6);
   if(!facts.length)continue;
   for(const listener of DEFINITIONS){
    if(listener.id===speaker.id||!window.FE_NPC_LANGUAGE?.common?.(speaker,listener))continue;
    const to=w.agents[listener.id];
    if(!window.FE_NPC_RUMORS?.coPresent?.(from,to))continue;
    for(const fact of facts){
     const chance=window.FE_NPC_RUMORS.chance(speaker,listener,from,to,fact);
     const roll=hash(w.seed+'|gossip|'+absolute+'|'+speaker.id+'|'+listener.id+'|'+fact.factId)%100;
     if(roll>=chance||!knowledge.share(w,speaker.id,listener.id,fact.factId,date))continue;
     w.events.push({id:'rumor|'+absolute+'|'+speaker.id+'|'+listener.id+'|'+fact.factId,
      type:'private-rumor',actorId:speaker.id,recipientId:listener.id,turn:Number.isSafeInteger(turnOverride)?turnOverride:Math.floor(absolute/4)+1,
      locationId:from.locationId,roomId:from.roomId,language:window.FE_NPC_LANGUAGE.common(speaker,listener),factId:fact.factId});
     exchanged++;
    }
   }
  }
  if(w.events.length>224)w.events.splice(0,w.events.length-224);
  return exchanged;
 }
 function recordWitnessedMeetings(records){
  if(!records?.length||S.npcOffscreenCatchup||window.FE_CITY?.isDevRoom?.())return;
  const found=window.FE_NPC_WITNESS?.record?.(S,records,window.FE_CITY?.currentLocation?.(),DEFINITIONS);
  if(found?.length&&typeof renderNotes==='function')renderNotes();
 }
 function planDecision(w,def,a,period,signature){
  const agency=window.FE_NPC_AGENCY;
  if(!agency)throw Error('NPC agency module required before world simulation');
  const situation=agency.observe(def,a,S,w,window.FE_WASHINGTON_TIME?.environment?.(S)),choice=agency.choose(def,a,situation,period);
  // Private intention, updated only once per reached routine period.
  a.lastDecision={goal:choice.goal,reason:choice.reason,score:choice.score,
   situation:{...situation},at:signature};
  return choice;
 }
 function pickRoom(def,agent,action,w){
  if(!window.FE_NPC_MOBILITY||!window.FederalElectricCity)throw Error('NPC city mobility module required');
  return window.FE_NPC_MOBILITY.visit(window.FederalElectricCity,
   {kind:'npc',id:def.id,workplaceId:WORKPLACES[def.id],onDuty:action.kind==='work',permits:[],roomPermits:[]},
   {date:action.date,key:action.key,seed:w.seed,slot:action.slot,
    defaultLocation:action.locationId,defaultActivity:action.activity,
    priorityDestination:action.kind==='wager-win'||action.kind==='wager-loss',
    preferredDestination:window.FE_NPC_INTENTIONS?.plan?.(def,agent,action)||null});
 }
 function stepOnce(w,absolute){
  if(!window.FE_NPC_ECONOMY)throw Error('NPC economic actions must load before scheduling');
  const slot=absolute%4,turn=Math.floor(absolute/4)+1;
  for(const def of DEFINITIONS){
   const a=w.agents[def.id];
   const decision=planDecision(w,def,a,SLOT_NAMES[slot],'legacy|'+absolute);
   const rest=decision.rest,date=observedDate(),natural=rest?null:def.places[slot];
   const weekday=/^\d{4}-\d{2}-\d{2}$/.test(date)?new Date(date+'T12:00:00Z').getUTCDay():1;
   const completed=window.FE_NPC_ECONOMY.actionFor(def,a,{
    key:'legacy|'+absolute,date:/^\d{4}-\d{2}-\d{2}$/.test(date)?date:'1890-01-02',
    slot,weekday,seed:w.seed,rest,
    defaultLocation:natural,defaultActivity:rest?null:def.activities[slot]});
   a.goal=decision.goal;
   const action=completed.action,moved=pickRoom(def,a,action,w),destination=moved.locationId;
   a.locationId=destination;
   a.roomId=moved.roomId;
   a.activity=moved.activity;
   a.status=destination?'present':'off-duty';
   a.energy=Math.max(15,Math.min(100,a.energy+(destination?-11:18)));
   a.lastStep=absolute;
   // Private events and cash remain in this profile; no false public dispatch.
   w.events.push({id:def.id+'|'+turn+'|'+slot,actorId:def.id,turn,slot:SLOT_NAMES[slot],locationId:destination,goal:a.goal,decisionReason:decision.reason,
    action:action.kind,roomId:moved.roomId});
  }
  exchangeLocalRumors(w,absolute);
  recordWitnessedMeetings(window.FE_NPC_SOCIAL?.meet?.(w,DEFINITIONS,{
   key:'legacy|'+absolute,turn,date:/^\d{4}-\d{2}-\d{2}$/.test(observedDate())?observedDate():'1890-01-02'}));
  if(w.events.length>224)w.events.splice(0,w.events.length-224);
 }
 function calendarOnce(w,c,key){
  if(!window.FE_NPC_ECONOMY)throw Error('NPC economic actions must load before scheduling');
  // Resolve the reached period once, never manufacture missed encounters
  // or private gossip for periods not actually observed by the player.
  const turn=Math.max(1,Math.floor(+S.turnSerial||1));
  for(const def of DEFINITIONS){
   const a=w.agents[def.id],period=window.FE_NPC_CALENDAR.at(c,def);
   const decision=planDecision(w,def,a,period.name,key);
   const rest=decision.rest,natural=rest?null:period.locationId;
   const completed=window.FE_NPC_ECONOMY.actionFor(def,a,{
    key,date:c.date,slot:period.slot,weekday:c.weekday,seed:w.seed,
    rest,defaultLocation:natural,defaultActivity:rest?null:period.activity});
   a.goal=decision.goal;
   const action=completed.action,moved=pickRoom(def,a,action,w),destination=moved.locationId;
   a.locationId=destination;
   a.roomId=moved.roomId;
   a.activity=moved.activity;
   a.status=destination?'present':'off-duty';
   a.energy=Math.max(15,Math.min(100,a.energy+(destination?-11:18)));
   a.lastCalendarSlot=key;
   w.events.push({id:def.id+'|calendar|'+key,actorId:def.id,turn,date:c.date,
    slot:period.name,locationId:destination,goal:a.goal,decisionReason:decision.reason,
    action:action.kind,roomId:moved.roomId});
  }
  exchangeLocalRumors(w,hash(key),turn);
  recordWitnessedMeetings(window.FE_NPC_SOCIAL?.meet?.(w,DEFINITIONS,{key,turn,date:c.date}));
  if(w.events.length>224)w.events.splice(0,w.events.length-224);
 }
 function syncClock(){
  if(!profile()||S.paused||S.phase==='report')return false;
  const w=ensure();if(!w)return false;
  const c=S.worldCalendarStatus==='ready'?window.FE_CALENDAR_BRIDGE?.moment?.(S):null;
  if(c&&window.FE_NPC_CALENDAR){
   const key=window.FE_NPC_CALENDAR.signature(c);
   if(key===w.lastCalendarSlot)return false;
   calendarOnce(w,c,key);w.lastCalendarSlot=key;
  }else{
   const target=stepForState();
   if(target===null||target<=w.lastStep)return false;
   for(let step=w.lastStep+1;step<=target;step++)stepOnce(w,step);
   w.lastStep=target;
  }
  if(typeof save==='function')save(true);
  const overlay=document.getElementById('cityRoomOverlay');
  if(overlay&&!overlay.hidden){
   const location=window.FE_CITY?.currentLocation?.();
   if(location){
    window.FE_CITY?.refreshRoomPeople?.();
    window.FE_LIVING_CHARACTERS?.renderRoomVisitors?.(location.locationId);
    renderRoomVisitors(location.locationId);
   }
  }
  renderContactItineraries();
  return true;
 }
 function visibleAt(locationId){
  const w=ensure();if(!w||!locationId)return [];
  return DEFINITIONS.filter(d=>w.agents[d.id]?.locationId===locationId)
   .map(d=>({id:d.id,name:d.name,roomId:w.agents[d.id].roomId||null,activity:w.agents[d.id].activity||'present'}));
 }
 // Face-to-face contact only. This uses the NPC's public routine, not
 // hidden personal goals, confidential motives or unscheduled future events.
 function talkAtLocation(id,topic='greet'){
  if(!['greet','work','city','today'].includes(topic)||S.paused||S.phase==='report'||!profile())return {ok:false,reason:'Conversation is unavailable.'};
  const def=BY_ID.get(id),w=ensure(),a=w?.agents[id],position=window.FE_CITY?.currentLocation?.();
  if(!def||!a||!position||a.locationId!==position.locationId||(position.roomId&&a.roomId&&position.roomId!==a.roomId)||a.status!=='present')
   return {ok:false,reason:'That person is not here now.'};
  const route=S.characterRoute||'industrialist',date=observedDate();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {ok:false,reason:'The game date is not available.'};
  const already=a.memories.some(m=>m.key===topic&&m.withId===route&&m.date===date);
  if(already)return {ok:false,reason:'You have already discussed that today.'};
  const known=a.memories.some(m=>m.key==='greet'&&m.withId===route);
  const affinity=Number.isFinite(+a.relationships[route])?+a.relationships[route]:0;
  const reply=def.language==='ru'?(topic==='greet'?'Добрый день.':topic==='today'?'У меня свои дела.':topic==='work'?'Я занят работой.':def.publicRemark):topic==='greet'
   ?(known?(affinity>=4?'Welcome back. It is good to have a familiar face here.':'Good to see you again.'):'Good day. I am '+def.name+'.')
   :topic==='city'?def.publicRemark:topic==='today'?
    (a.social?.last?.date===date?'I spent some time speaking with another resident today.':a.economy?.lastAction?.publicLine||'I have been attending to ordinary matters.'):
    (a.activity?'I am occupied with '+a.activity+'.':'I have no news about my work today.');
  // The first introduction improves familiarity once; repeating visits cannot
  // generate unlimited reputation or cash.
  if(!recordInteraction(id,route,topic,topic==='greet'?1:topic==='city'?1:0))
   return {ok:false,reason:'The meeting could not be recorded.'};
  a.memories[a.memories.length-1].date=date;
  a.memories[a.memories.length-1].locationId=position.locationId;
  if(topic==='greet'){
   window.FE_NPC_KNOWLEDGE?.learn?.(w,id,'introduced:'+route,true,'direct-introduction',date,1);
   // Contacts are only earned through an actual, present, face-to-face greeting.
   // A contact card establishes acquaintance, not trust or access to secrets.
   if(S.contacts&&typeof S.contacts==='object'){
    const contact=S.contacts[id]&&typeof S.contacts[id]==='object'?S.contacts[id]:{name:def.name,met:false,trust:0};
    contact.name=def.name;contact.met=true;
    S.contacts[id]=contact;
   }
  }
  if(Array.isArray(S.notes))S.notes.push({date,source:'conversation with '+def.name,text:'Spoke with '+def.name+': '+reply});
  if(typeof save==='function')save(true);
  renderContactItineraries();
  if(typeof renderNotes==='function')renderNotes();
  if(topic==='greet'&&typeof renderWashington==='function')renderWashington();
  return {ok:true,name:def.name,reply,relationship:a.relationships[route]||0};
 }
 async function converseAtLocation(id,utterance){
  const dev=window.FE_NPC_DIALOGUE,model=window.FE_NPC_LLM;
  if(!profile()||!dev||!model?.chat)return {ok:false,reason:'Connect a local language model to converse freely.'};
  if(S.paused||S.phase==='report')return {ok:false,reason:'Conversation is unavailable while the game is paused.'};
  const def=BY_ID.get(id),w=ensure(),actor=w?.agents[id],position=window.FE_CITY?.currentLocation?.(),profileId=profile();
  if(!def||!actor||actor.status!=='present'||!position||
   actor.locationId!==position.locationId||actor.roomId!==position.roomId)
   return {ok:false,reason:'That resident is not in this room.'};
  const date=observedDate(),route=S.characterRoute||'industrialist';
  let query;
  const environment=window.FE_WASHINGTON_TIME?.environment?.(S);
  try{query=dev.prepare({save:S,npc:def,utterance,date,weather:environment?.weather||S.turnConditions?.weather||'unavailable',sky:environment,
    location:window.FederalElectricCity?.getLocation?.(position.locationId)?.name||position.locationId,
    playerName:window.FE_CHARACTERS?.get?.(route)?.characterName||route,
    playerLanguages:Array.isArray(S.playerLanguages)?S.playerLanguages:['en'],
    activity:actor.activity,relationship:Number(actor.relationships?.[route]||0)})}
  catch(e){return {ok:false,reason:String(e.message||e)}}
  if(!query.ok)return query;
  const result=await model.chat({messages:query.messages});
  if(!result?.ok||typeof result.text!=='string'||!result.text.trim())return {ok:false,reason:result?.reason||'The resident did not respond.'};
  const now=window.FE_CITY?.currentLocation?.(),latest=S.npcSimulation?.agents?.[id];
  if(profile()!==profileId||observedDate()!==date||!now||now.locationId!==position.locationId||
    now.roomId!==position.roomId||latest?.status!=='present'||
    latest.locationId!==position.locationId||latest.roomId!==position.roomId)
   return {ok:false,reason:'The meeting ended before the reply arrived. No conversation was saved.'};
  dev.record(S,id,{date,user:utterance.trim(),reply:result.text,place:position.locationId});
  recordInteraction(id,route,'freeform',0);
  // Spoken dialogue is a record, not a performed action or a verified clue.
  if(typeof save==='function')save(true);
  return {ok:true,name:def.name,reply:result.text};
 }
 function publicContacts(){
  // Only face-to-face greetings by this character reveal an NPC's usual routine.
  // Private goals, inferred secrets and rumor contents never reach these cards.
  const w=ensure(),route=S.characterRoute||'industrialist';
  if(!w)return [];
  return DEFINITIONS.filter(d=>w.agents[d.id]?.memories.some(m=>m.key==='greet'&&m.withId===route))
   .map(d=>{
    const a=w.agents[d.id],next=window.FE_NPC_ITINERARY?.next?.(d,S)||null;
    return {id:d.id,name:d.name,occupation:d.occupation,affinity:a.relationships[route]||0,
     next:next?{locationId:next.locationId,from:next.from,until:next.until,
      ongoing:next.ongoing,activity:next.activity}:null};
   });
 }
 function renderContactItineraries(){
  const panel=document.getElementById('npcContactItinerary');if(!panel)return;
  panel.replaceChildren();
  const contacts=publicContacts();
  if(!contacts.length){const p=document.createElement('p');p.className='fine';
   p.textContent='No residents personally introduced themselves yet. Meet someone in Washington to learn their usual public hours.';
   panel.appendChild(p);return}
  const scheduleKnown=S.worldCalendarStatus==='ready'&&!!window.FE_NPC_ITINERARY;
  if(!scheduleKnown){const p=document.createElement('p');p.className='fine';
   p.textContent='Precise usual hours are unavailable until this legacy profile reaches a mapped morning.';
   panel.appendChild(p)}
  for(const c of contacts){
   const card=document.createElement('article');card.className='npc-itinerary-card';
   const h=document.createElement('h4');h.textContent=c.name;card.appendChild(h);
   const job=document.createElement('p');job.textContent=c.occupation+' · Acquaintance '+c.affinity;card.appendChild(job);
   const p=document.createElement('p');
   if(c.next){
    const loc=window.FederalElectricCity?.getLocation?.(c.next.locationId);
    const place=loc?.name||'a known public location';
    p.textContent=(c.next.ongoing?'Usual hours now at ':'Next usual appearance at ')+place+
      ' · '+window.FE_NPC_ITINERARY.label(c.next.from)+
      ' to '+window.FE_NPC_ITINERARY.label(c.next.until)+
      '. Attendance is not guaranteed.';
   }else p.textContent=scheduleKnown?'No published routine in the coming week.':'Usual hours not mapped.';
   card.appendChild(p);panel.appendChild(card);
  }
 }
 function renderRoomVisitors(locationId){
  const panel=document.getElementById('cityRoomVisitors'),list=document.getElementById('cityRoomVisitorList');
  if(!panel||!list)return;
  list.replaceChildren();
  const currentRoom=window.FE_CITY?.currentLocation?.()?.roomId||null;
  for(const visitor of visibleAt(locationId).filter(v=>!currentRoom||!v.roomId||v.roomId===currentRoom)){
   const row=document.createElement('article');row.className='fe-npc-visitor';
   const p=document.createElement('p');p.textContent=visitor.name+' is '+visitor.activity+'.';row.appendChild(p);
   const controls=document.createElement('div');controls.className='fe-npc-visitor-actions';
   const response=document.createElement('p');response.className='fe-npc-response';response.setAttribute('role','status');
   for(const [topic,label] of [['greet','Greet'],['work','Ask About Work'],['city','Ask About Washington'],['today','Ask About Today']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;
    button.addEventListener('click',()=>{
     const result=talkAtLocation(visitor.id,topic);
     response.textContent=result.ok?result.name+': '+result.reply:result.reason;
    });controls.appendChild(button);
   }
   const form=document.createElement('form');form.className='fe-npc-freeform';
   const input=document.createElement('input');input.type='text';input.maxLength=600;input.required=true;
   input.placeholder='Ask anything in your shared language';input.setAttribute('aria-label','Speak to '+visitor.name);
   const ask=document.createElement('button');ask.type='submit';ask.textContent='Speak';
   form.append(input,ask);
   form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(ask.disabled)return;
    const words=input.value.trim();if(!words)return;
    ask.disabled=true;response.textContent=visitor.name+' is considering your words…';
    try{const reply=await converseAtLocation(visitor.id,words);
     response.textContent=reply.ok?visitor.name+': '+reply.reply:reply.reason;
     if(reply.ok)input.value='';
    }catch(e){response.textContent='Conversation failed: '+String(e.message||e).slice(0,140)}
    finally{ask.disabled=false}
   });
   row.appendChild(controls);row.appendChild(form);row.appendChild(response);list.appendChild(row);
  }
  panel.hidden=!list.children.length;
 }
 function recordInteraction(id,withId,kind,relationshipDelta=0){
  const w=ensure(),a=w?.agents[id];
  if(!a||typeof withId!=='string'||!withId||typeof kind!=='string'||!kind)return false;
  const delta=Math.max(-10,Math.min(10,Math.floor(+relationshipDelta||0)));
  a.relationships[withId]=Math.max(-100,Math.min(100,(+a.relationships[withId]||0)+delta));
  a.memories.push({key:kind,withId,turn:Math.max(1,Math.floor(+S.turnSerial||1)),
   date:/^\d{4}-\d{2}-\d{2}$/.test(observedDate())?observedDate():null,
   locationId:window.FE_CITY?.currentLocation?.()?.locationId||null,relationshipDelta:delta});
  if(a.memories.length>32)a.memories.splice(0,a.memories.length-32);
  if(typeof save==='function')save(true);
  return true;
 }
 function inspect(id){
  const a=ensure()?.agents[id],def=BY_ID.get(id);
  if(!a||!def)return null;
  return {id,name:def.name,occupation:def.occupation,ambition:def.ambition,
   traits:{...def.traits},...a,relationships:{...a.relationships},memories:a.memories.map(m=>({...m}))};
 }
 function list(){return DEFINITIONS.map(d=>({id:d.id,name:d.name,occupation:d.occupation,language:d.language||'en'}));}
 window.FE_NPC_AI=Object.freeze({ensure,syncClock,visibleAt,renderRoomVisitors,renderContactItineraries,publicContacts,recordInteraction,talkAtLocation,converseAtLocation,inspect,list,stepForState,exchangeLocalRumors});
})();
