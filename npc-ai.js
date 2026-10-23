/* Federal Electric NPC intelligence slice 1.
 * Engine-independent, offline, deterministic routines and persistent decisions.
 * The current day/night phase clock is a transitional input, NOT the proposed 24-hour world clock.
 * NPC state belongs to the active profile. Never tick while the game is closed.
 */
(function(){
 'use strict';
 const SLOT_NAMES=Object.freeze(['early-business','late-business','early-night','late-night']);
 const DEFINITIONS=Object.freeze([
  {id:'madamStar',name:'Madam Star',occupation:'Star Club proprietor',ambition:'protect-and-develop-the-star-club',
   traits:{sociability:82,caution:79,ambition:73},places:['star','star','star','star'],
   activities:['reviewing the day’s appointments','receiving callers','overseeing the evening','concluding private business'],
   goals:['maintain-the-club','cultivate-trusted-contacts','protect-staff']},
  {id:'foremanSullivan',name:'Foreman Sullivan',occupation:'Federal Electric foreman',ambition:'maintain-reliable-production',
   traits:{sociability:45,caution:81,ambition:59},places:['factory','factory',null,null],
   activities:['organizing the production floor','checking the factory schedule',null,null],
   goals:['maintain-machinery','meet-contract-deadlines','protect-workforce']},
  {id:'eddieDoyle',name:'Eddie Doyle',occupation:'Bookmaker',ambition:'build-a-reliable-network-of-contacts',
   traits:{sociability:91,caution:56,ambition:77},places:['races','races','star',null],
   activities:['speaking with racegoers','following the racing business','making evening introductions',null],
   goals:['expand-connections','protect-reputation','balance-finances']},
  {id:'inspectorHayes',name:'Inspector Arthur Hayes',occupation:'Police inspector',ambition:'advance-his-investigative-career',
   traits:{sociability:54,caution:87,ambition:81},places:['metropolitanPolice','metropolitanPolice','washingtonArena',null],
   activities:['reviewing reports','attending to District police business','visiting a public event',null],
   goals:['review-open-cases','maintain-public-order','build-professional-standing']},
  {id:'chenMei',name:'Chen Mei',occupation:'Chinatown merchant contact',ambition:'support-her-neighborhood-business',
   traits:{sociability:76,caution:72,ambition:62},places:['oldChinatown','oldChinatown',null,null],
   activities:['speaking with neighbors','attending to merchants’ concerns',null,null],
   goals:['maintain-business','help-neighbors','develop-contacts']},
  {id:'liWen',name:'Li Wen',occupation:'Chinatown merchant contact',ambition:'develop-local-commercial-relationships',
   traits:{sociability:56,caution:75,ambition:74},places:['oldChinatown','oldChinatown',null,null],
   activities:['meeting with merchants','following new business opportunities',null,null],
   goals:['find-new-buyers','protect-local-trust','maintain-business']},
  {id:'pavelOrlov',name:'Pavel Orlov',occupation:'Visiting Russian merchant',ambition:'establish-reliable-overseas-trade',
   traits:{sociability:70,caution:69,ambition:78},places:['russianTradeHall','russianTradeHall','star',null],
   activities:['meeting commercial visitors','discussing engineering and trade','attending an evening gathering',null],
   goals:['develop-trade','expand-connections','protect-reputation']}
 ]);
 const BY_ID=new Map(DEFINITIONS.map(d=>[d.id,d]));
 const EMPTY={version:1,seed:null,lastStep:null,agents:{},events:[]};
 function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function profile(){return typeof activeProfileId==='function'?activeProfileId():''}
 function randomIndex(seed,id,step,salt,size){return hash(seed+'|'+id+'|'+step+'|'+salt)%size}
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
 function stepOnce(w,absolute){
  const slot=absolute%4,turn=Math.floor(absolute/4)+1,night=slot>=2;
  for(const def of DEFINITIONS){
   const a=w.agents[def.id];
   const index=randomIndex(w.seed,def.id,absolute,'goal',def.goals.length);
   const rest=a.energy<=32&&night;
   const destination=rest?null:def.places[slot];
   a.goal=rest?'rest-and-recover':def.goals[index];
   a.locationId=destination;
   a.activity=rest?null:def.activities[slot];
   a.status=destination?'present':'off-duty';
   a.energy=Math.max(15,Math.min(100,a.energy+(destination?-11:18)));
   a.lastStep=absolute;
   // A private log of completed routine decisions, never a public newspaper assertion.
   w.events.push({id:def.id+'|'+turn+'|'+slot,actorId:def.id,turn,slot:SLOT_NAMES[slot],locationId:destination,goal:a.goal});
  }
  if(w.events.length>224)w.events.splice(0,w.events.length-224);
 }
 function syncClock(){
  if(!profile()||S.paused||S.phase==='report')return false;
  const target=stepForState(),w=ensure();
  if(target===null||!w||target<=w.lastStep)return false;
  // Reconcile skipped slots exactly once. No offline time advances on its own.
  // A new save starts at its current turn and only replays within that turn.
  for(let step=w.lastStep+1;step<=target;step++)stepOnce(w,step);
  w.lastStep=target;
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
  return true;
 }
 function visibleAt(locationId){
  const w=ensure();if(!w||!locationId)return [];
  return DEFINITIONS.filter(d=>w.agents[d.id]?.locationId===locationId)
   .map(d=>({id:d.id,name:d.name,activity:w.agents[d.id].activity||'present'}));
 }
 // Face-to-face contact only. This uses the NPC's public routine, not
 // hidden personal goals, confidential motives or unscheduled future events.
 function talkAtLocation(id,topic='greet'){
  if(!['greet','work'].includes(topic)||S.paused||S.phase==='report'||!profile())return {ok:false,reason:'Conversation is unavailable.'};
  const def=BY_ID.get(id),w=ensure(),a=w?.agents[id],position=window.FE_CITY?.currentLocation?.();
  if(!def||!a||!position||a.locationId!==position.locationId||a.status!=='present')
   return {ok:false,reason:'That person is not here now.'};
  const route=S.characterRoute||'industrialist',date=String(S.gameDate||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {ok:false,reason:'The game date is not available.'};
  const already=a.memories.some(m=>m.key===topic&&m.withId===route&&m.date===date);
  if(already)return {ok:false,reason:'You have already discussed that today.'};
  const known=a.memories.some(m=>m.key==='greet'&&m.withId===route);
  const reply=topic==='greet'
   ?(known?'Good to see you again.':'Good day. I am '+def.name+'.')
   :(a.activity?'I am occupied with '+a.activity+'.':'I have no news about my work today.');
  // The first introduction improves familiarity once; repeating visits cannot
  // generate unlimited reputation or cash.
  if(!recordInteraction(id,route,topic,topic==='greet'?1:0))
   return {ok:false,reason:'The meeting could not be recorded.'};
  a.memories[a.memories.length-1].date=date;
  a.memories[a.memories.length-1].locationId=position.locationId;
  if(topic==='greet')window.FE_NPC_KNOWLEDGE?.learn?.(w,id,'introduced:'+route,true,'direct-introduction',date,1);
  if(Array.isArray(S.notes))S.notes.push({date,source:'conversation with '+def.name,text:'Spoke with '+def.name+': '+reply});
  if(typeof save==='function')save(true);
  if(typeof renderNotes==='function')renderNotes();
  return {ok:true,name:def.name,reply,relationship:a.relationships[route]||0};
 }
 function renderRoomVisitors(locationId){
  const panel=document.getElementById('cityRoomVisitors'),list=document.getElementById('cityRoomVisitorList');
  if(!panel||!list)return;
  for(const visitor of visibleAt(locationId)){
   const row=document.createElement('article');row.className='fe-npc-visitor';
   const p=document.createElement('p');p.textContent=visitor.name+' is '+visitor.activity+'.';row.appendChild(p);
   const controls=document.createElement('div');controls.className='fe-npc-visitor-actions';
   const response=document.createElement('p');response.className='fe-npc-response';response.setAttribute('role','status');
   for(const [topic,label] of [['greet','Greet'],['work','Ask About Work']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;
    button.addEventListener('click',()=>{
     const result=talkAtLocation(visitor.id,topic);
     response.textContent=result.ok?result.name+': '+result.reply:result.reason;
    });controls.appendChild(button);
   }
   row.appendChild(controls);row.appendChild(response);list.appendChild(row);
  }
  panel.hidden=!list.children.length;
 }
 function recordInteraction(id,withId,kind,relationshipDelta=0){
  const w=ensure(),a=w?.agents[id];
  if(!a||typeof withId!=='string'||!withId||typeof kind!=='string'||!kind)return false;
  const delta=Math.max(-10,Math.min(10,Math.floor(+relationshipDelta||0)));
  a.relationships[withId]=Math.max(-100,Math.min(100,(+a.relationships[withId]||0)+delta));
  a.memories.push({key:kind,withId,turn:Math.max(1,Math.floor(+S.turnSerial||1)),
   date:/^\d{4}-\d{2}-\d{2}$/.test(S.gameDate||'')?S.gameDate:null,
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
 function list(){return DEFINITIONS.map(d=>({id:d.id,name:d.name,occupation:d.occupation}));}
 window.FE_NPC_AI=Object.freeze({ensure,syncClock,visibleAt,renderRoomVisitors,recordInteraction,talkAtLocation,inspect,list,stepForState});
})();
