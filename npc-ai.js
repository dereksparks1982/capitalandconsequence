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
  {id:'charlieWhitcomb',route:'industrialist',name:'Charles “Charlie” Whitcomb',
   occupation:'Federal Electric owner',ambition:'build-a-lasting-electrical-manufacturing-business',
   publicRemark:"Federal Electric is my business. I cannot promise an order that has not been agreed.",
   traits:{sociability:60,caution:62,ambition:85},places:['factory','factory',null,null],
   activities:['reviewing workshop orders','supervising the electrical works',null,null],
   goals:['manage-the-workshop','maintain-business-contacts','plan-future-orders']},
  {id:'samHarlan',route:'investigator',name:'Samuel “Sam” Harlan',
   occupation:'Metropolitan Police patrolman on the Hillsdale beat',
   ambition:'serve-his-neighborhood-and-make-his-own-decisions',
   publicRemark:"I walk the Hillsdale beat. I can only report what I have actually seen.",
   traits:{sociability:67,caution:74,ambition:66},places:['hillsdale','hillsdale','metropolitanPolice',null],
   activities:['walking the Hillsdale beat','attending to neighborhood calls','filing an ordinary patrol report',null],
   goals:['walk-hillsdale-beat','help-local-residents','complete-station-reports']},
  {id:'eliCrowe',route:'criminal',name:'Elias “Eli” Crowe',
   occupation:'Nightclub doorman',ambition:'make-an-independent-living',
   publicRemark:"I mind the entrance. You will have to ask the proprietor about his private affairs.",
   traits:{sociability:54,caution:76,ambition:67},places:[null,null,'secondNightclub','secondNightclub'],
   activities:[null,null,'admitting evening patrons','attending to the late entrance'],
   goals:['work-the-nightclub-door','earn-an-honest-living','make-new-acquaintances']},
  {id:'edmundWardman',route:'wardman',name:'Edmund Wardman',
   occupation:'Orderly at District Asylum',ambition:'make-a-life-away-from-family-expectations',
   publicRemark:"I attend to my duties as an orderly. I do not run the institution.",
   traits:{sociability:48,caution:80,ambition:68},places:['blackwoodAsylum','blackwoodAsylum',null,null],
   activities:['preparing the orderly station','attending to patients under supervision',null,null],
   goals:['perform-orderly-duties','earn-colleagues-trust','seek-independent-prospects']},
  {id:'samuelTilden',name:'President Samuel J. Tilden',
   occupation:'President of the United States (alternate election of 1876)',
   historical:true,availableFrom:'1877-03-04',availableUntil:'1887-03-03',
   ambition:'maintain-responsible-national-government',
   publicRemark:"Government policy deserves examination rather than promises made in passing.",
   traits:{sociability:49,caution:87,ambition:77},
   places:['whiteHouse','whiteHouse',null,null],
   activities:['reviewing executive correspondence','meeting with authorized visitors',null,null],
   goals:['review-executive-papers','consult-advisers','respond-to-petitions']},
  {id:'madamStar',name:'Madam Star',fullName:'Eleanor Victoria Ashcroft',nationality:'British',occupation:'Star Club proprietor',ambition:'protect-and-develop-the-star-club',
   publicRemark:"The evening crowd does not always agree with the morning newspapers. Ask people directly, and remember which ones actually saw an event.",traits:{sociability:82,caution:79,ambition:73},places:['star','star','star','star'],
   activities:['reviewing the day’s appointments','receiving callers','overseeing the evening','concluding private business'],
   goals:['maintain-the-club','cultivate-trusted-contacts','protect-staff']},
  {id:'luiDelacroix',name:'Lucien “Lui” Delacroix',fullName:'Lucien Étienne Delacroix',
   nationality:'French',occupation:'Nightclub proprietor',ambition:'maintain-an-influential-cabaret',
   publicRemark:"Le Paon d’Or belongs to me alone, darling. Washington's most respectable gentlemen seem to adore the entertainment they publicly condemn.",
   traits:{sociability:88,caution:83,ambition:91},places:['secondNightclub','secondNightclub','secondNightclub','secondNightclub'],
   activities:['reviewing the books','speaking with performers','hosting the evening','closing private accounts'],
   goals:['maintain-the-cabaret','manage-the-staff','guard-private-business']},
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
  {id:'liWen',name:'Li Wen',language:'zh',occupation:'Chinatown merchant contact',ambition:'develop-local-commercial-relationships',
   publicRemark:'好價錢只是生意的一部分。客人也記得貨物是否送到。',traits:{sociability:56,caution:75,ambition:74},places:['oldChinatown','oldChinatown',null,null],
   activities:['meeting with merchants','following new business opportunities',null,null],
   goals:['find-new-buyers','protect-local-trust','maintain-business']},
  {id:'alexiRurik',name:'Alexi Rurik',occupation:'Russian immigrant and courier',language:'ru',ambition:'build-a-life-on-his-own-terms',
   publicRemark:'Я сам решаю, кому доверять. Разговоры ничего не стоят.',
   traits:{sociability:39,caution:78,ambition:87},
   places:['russianTradeHall','races','workingPoker','star'],
   activities:['looking for a new contract','following a delivery','watching the card game','waiting for a late appointment'],
   goals:['find-honest-work','protect-allies','establish-independence']},
  {id:'annaPetrovna',name:'Anna Petrovna',occupation:'Russian Trade Hall visitor',
   ambition:'maintain-independent-trade-relationships',nationality:'Russian',
   publicRemark:"Washington's winter is mild compared with what I remember of Russia. Some visitors speak freely; others do not.",
   traits:{sociability:65,caution:74,ambition:51},
   places:['russianTradeHall','russianTradeHall',null,null],
   activities:['meeting visiting merchants','attending to private correspondence',null,null],
   goals:['develop-trade','protect-reputation','maintain-acquaintances']},
  {id:'pavelOrlov',name:'Pavel Orlov',occupation:'Visiting Russian merchant',languages:['en','ru'],ambition:'establish-reliable-overseas-trade',
   publicRemark:"Washington has many doors for a trader, but an introduction is not the same as a contract.",traits:{sociability:70,caution:69,ambition:78},places:['russianTradeHall','russianTradeHall','star',null],
   activities:['meeting commercial visitors','discussing engineering and trade','attending an evening gathering',null],
   goals:['develop-trade','expand-connections','protect-reputation']},
  {id:'edwinBooth',name:'Edwin Booth',historical:true,occupation:'Shakespearean stage actor',
   ambition:'be-a-serious-shakespearean-lead',publicRemark:'A tragic part cannot be rushed. The stage gives a man no place to conceal poor preparation.',
   traits:{sociability:52,caution:75,ambition:85},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['rehearsing a new role','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'josephJefferson',name:'Joseph Jefferson',historical:true,occupation:'Dramatic and comic actor',
   ambition:'bring-comedy-and-pathos-to-the-washington-stage',publicRemark:'A little laughter can open a door that a sermon never could.',
   traits:{sociability:76,caution:66,ambition:75},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['rehearsing the company programme','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'johnMcCullough',name:'John McCullough',historical:true,occupation:'Tragedian and stage actor',
   ambition:'earn-renown-for-serious-tragedy',publicRemark:'Tragedy demands discipline, whether the house is full or nearly empty.',
   traits:{sociability:58,caution:69,ambition:83},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['practising a tragic scene','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'claraMorris',name:'Clara Morris',historical:true,occupation:'Stage actress',
   ambition:'continue-an-independent-dramatic-career',publicRemark:'An actress has to fight twice as hard to be judged for her work rather than the drawing-room whispers.',
   traits:{sociability:62,caution:79,ambition:92},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['studying a dramatic part','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'johnTRaymond',name:'John T. Raymond',historical:true,occupation:'Comic stage actor',
   ambition:'maintain-a-beloved-comedy-career',publicRemark:'There are worse things in Washington than being laughed at, so long as the audience bought a ticket.',
   traits:{sociability:87,caution:58,ambition:70},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['rehearsing a new comedy','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'charlesHanford',name:'Charles B. Hanford',historical:true,occupation:'Young theatre apprentice',
   ambition:'earn-a-place-in-the-theatre-company',publicRemark:'I\'m still learning. The stagehands know more about this trade than many a gentleman in the boxes.',
   traits:{sociability:65,caution:72,ambition:89},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['assisting with the stage','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']},
  {id:'williamRapley',name:'William W. Rapley',historical:true,occupation:'National Theatre proprietor',
   ambition:'operate-a-stable-profitable-theatre',publicRemark:'An actor needs a stage, but a theatre needs bookings, paid wages and an audience.',
   traits:{sociability:74,caution:86,ambition:92},
   places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
   activities:['reviewing theatre bookings','rehearsing with the company','attending the evening performance',null],
   goals:['prepare-the-next-performance','maintain-stage-craft','build-theatre-relationships']}
 ]);
 const BY_ID=new Map(DEFINITIONS.map(d=>[d.id,d]));
 // The selected protagonist is controlled by the player, NEVER by this AI.
 // The other three remain individual NPCs on this profile.
 function isPlayer(def){return !!def.route&&def.route===(S.characterRoute||'industrialist')}
 function autonomous(){return DEFINITIONS.filter(def=>!isPlayer(def))}

 const WORKPLACES={charlieWhitcomb:'factory',samHarlan:'hillsdale',eliCrowe:'secondNightclub',edmundWardman:'blackwoodAsylum',samuelTilden:'whiteHouse',madamStar:'star',luiDelacroix:'secondNightclub',foremanSullivan:'factory',eddieDoyle:'races',inspectorHayes:'metropolitanPolice',chenMei:'oldChinatown',liWen:'oldChinatown',pavelOrlov:'russianTradeHall',alexiRurik:'russianTradeHall',edwinBooth:'nationalTheatre',josephJefferson:'nationalTheatre',johnMcCullough:'nationalTheatre',claraMorris:'nationalTheatre',johnTRaymond:'nationalTheatre',charlesHanford:'nationalTheatre',williamRapley:'nationalTheatre'};
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
  for(const def of autonomous()){
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
  for(const speaker of autonomous()){
   const from=w.agents[speaker.id];
   if(!from||from.status!=='present'||!from.locationId||!from.roomId)continue;
   const facts=knowledge.knownFacts(w,speaker.id).filter(r=>window.FE_NPC_RUMORS?.shareable?.(r)).slice(-6);
   if(!facts.length)continue;
   for(const listener of autonomous()){
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
 // A private social-goal milestone requires a real same-room encounter.
 // Do not manufacture a meeting merely because an NPC wanted to socialize.
 function reflectActualMeetings(w,records,key){
  if(!records?.length)return;
  const plans=window.FE_NPC_LIFE_PLANS;
  for(const record of records){
   // This can only mutate after the social engine saved an actual meeting
   // in this profile. No reward for speculative plans or shared geography.
   window.FE_NPC_SOCIAL_CONSEQUENCES?.apply?.(S,w,record);
   if(!plans)continue;
   for(const id of [record.actorId,record.partnerId]){
    const def=BY_ID.get(id),actor=w.agents[id];
    if(def&&!isPlayer(def)&&actor)plans.witness(def,actor,record,key);
   }
  }
 }
 function recordWitnessedMeetings(records){
  if(!records?.length||S.npcOffscreenCatchup||window.FE_CITY?.isDevRoom?.())return;
  const found=window.FE_NPC_WITNESS?.record?.(S,records,window.FE_CITY?.currentLocation?.(),autonomous());
  if(found?.length&&typeof renderNotes==='function')renderNotes();
 }
 function planDecision(w,def,a,period,signature){
  const agency=window.FE_NPC_AGENCY;
  if(!agency)throw Error('NPC agency module required before world simulation');
  const situation=agency.observe(def,a,S,w,window.FE_WASHINGTON_TIME?.environment?.(S));
  const proposal=agency.choose(def,a,situation,period);
  // Keep an individual intention between observed periods. A meaningful
  // priority change can revise it; small score noise cannot erase progress.
  const choice=window.FE_NPC_LIFE_PLANS?.commit?.(def,a,proposal,signature)||proposal;
  // Private intention, updated only once per reached routine period.
  a.lastDecision={goal:choice.goal,reason:choice.reason,score:choice.score,
   situation:{...situation},at:signature};
  return choice;
 }
 function pickRoom(def,agent,action,w){
  if(!window.FE_NPC_MOBILITY||!window.FederalElectricCity)throw Error('NPC city mobility module required');
  return window.FE_NPC_MOBILITY.visit(window.FederalElectricCity,
   {kind:'npc',id:def.id,route:def.route||null,job:def.id==='edmundWardman'?'orderly':null,
    residences:def.id==='charlieWhitcomb'?['home']:[],
    workplaceId:WORKPLACES[def.id],onDuty:action.kind==='work',permits:[],roomPermits:[]},
   {date:action.date,key:action.key,seed:w.seed,slot:action.slot,
    sociability:def.traits?.sociability,
    defaultLocation:action.locationId,defaultActivity:action.activity,
    priorityDestination:action.kind==='wager-win'||action.kind==='wager-loss',
    preferredDestination:window.FE_NPC_INTENTIONS?.plan?.(def,agent,action)||null});
 }
 function stepOnce(w,absolute){
  if(!window.FE_NPC_ECONOMY)throw Error('NPC economic actions must load before scheduling');
  const slot=absolute%4,turn=Math.floor(absolute/4)+1;
  for(const def of autonomous()){
   const a=w.agents[def.id];
   const dateForEra=observedDate();
   if((def.availableFrom&&dateForEra<def.availableFrom)||(def.availableUntil&&dateForEra>def.availableUntil)){
    a.locationId=null;a.roomId=null;a.activity=null;a.status='inactive';a.lastStep=absolute;continue;
   }
   const decision=planDecision(w,def,a,SLOT_NAMES[slot],'legacy|'+absolute);
   const rest=decision.rest,date=observedDate(),natural=rest?null:def.places[slot];
   const weekday=/^\d{4}-\d{2}-\d{2}$/.test(date)?new Date(date+'T12:00:00Z').getUTCDay():1;
   const completed=window.FE_NPC_ECONOMY.actionFor(def,a,{
    key:'legacy|'+absolute,date:/^\d{4}-\d{2}-\d{2}$/.test(date)?date:'1890-01-02',
    slot,weekday,seed:w.seed,rest,
    defaultLocation:natural,defaultActivity:rest?null:def.activities[slot]});
   a.goal=decision.goal;
   window.FE_NPC_HOUSEHOLD_RECEIPTS?.sync?.(S,def.id);
   const action=completed.action,moved=pickRoom(def,a,action,w),destination=moved.locationId;
   a.locationId=destination;
   a.roomId=moved.roomId;
   a.activity=moved.activity;
   a.status=destination?'present':'off-duty';
   a.energy=Math.max(15,Math.min(100,a.energy+(destination?-11:18)));
   if(!completed.repeated)
    window.FE_NPC_LIFE_PLANS?.record?.(def,a,decision,action,moved,'legacy|'+absolute);
   a.lastStep=absolute;
   // Private events and cash remain in this profile; no false public dispatch.
   w.events.push({id:def.id+'|'+turn+'|'+slot,actorId:def.id,turn,slot:SLOT_NAMES[slot],locationId:destination,goal:a.goal,decisionReason:decision.reason,
    action:action.kind,roomId:moved.roomId});
  }
  exchangeLocalRumors(w,absolute);
  const meetings=window.FE_NPC_SOCIAL?.meet?.(w,autonomous(),{
   key:'legacy|'+absolute,turn,date:/^\d{4}-\d{2}-\d{2}$/.test(observedDate())?observedDate():'1890-01-02'})||[];
  reflectActualMeetings(w,meetings,'legacy|'+absolute);
  recordWitnessedMeetings(meetings);
  if(w.events.length>224)w.events.splice(0,w.events.length-224);
 }
 function calendarOnce(w,c,key){
  if(!window.FE_NPC_ECONOMY)throw Error('NPC economic actions must load before scheduling');
  // Resolve the reached period once, never manufacture missed encounters
  // or private gossip for periods not actually observed by the player.
  const turn=Math.max(1,Math.floor(+S.turnSerial||1));
  // Wholesale shipments only on actually reached Monday/Thursday morning slots.
  window.FE_WASHINGTON_COMMERCE?.deliveryForCalendar?.(S,c.date,window.FE_NPC_CALENDAR.slot(c.minuteOfDay));
  for(const def of autonomous()){
   const a=w.agents[def.id];
   if((def.availableFrom&&c.date<def.availableFrom)||(def.availableUntil&&c.date>def.availableUntil)){
    a.locationId=null;a.roomId=null;a.activity=null;a.status='inactive';a.lastCalendarSlot=key;continue;
   }
   const period=window.FE_NPC_CALENDAR.at(c,def);
   // Personal condition comes from elapsed saved world time, not from page
   // redraws, NPC clocks, or a fixed energy charge per rendered time slot.
   window.FE_NPC_NEEDS?.settle?.(a,def,S.worldCalendar.worldMinute,window.FE_NPC_WEEKLY);
   const decision=planDecision(w,def,a,period.name,key);
   const rest=decision.rest,natural=rest?null:period.locationId;
   const completed=window.FE_NPC_ECONOMY.actionFor(def,a,{
    key:period.economyKey,date:period.day,slot:period.slot,weekday:period.weekday,seed:w.seed,
    rest,save:S,defaultLocation:natural,defaultActivity:rest?null:period.activity});
   a.goal=decision.goal;
   // Mirror actual paid stock transfers into the buyer's private history,
   // without charging them again or claiming they already ate the food.
   window.FE_NPC_HOUSEHOLD_RECEIPTS?.sync?.(S,def.id);
   const action=completed.action;
   const movementAction={...action,key,date:period.day,slot:period.slot,
    activity:action.locationId===period.locationId?period.activity:action.activity};
   const lodging=window.FE_NPC_RESIDENCES?.nightStay?.(def,c,window.FederalElectricCity);
   const moved=lodging||pickRoom(def,a,movementAction,w),destination=moved.locationId;
   a.locationId=destination;
   a.roomId=moved.roomId;
   a.activity=moved.activity;
   a.status=destination?'present':'off-duty';
   // Mid-period routine changes do not mint extra income, purchases or fatigue.
   if(!window.FE_NPC_NEEDS&&!completed.repeated)
    a.energy=Math.max(15,Math.min(100,a.energy+(destination?-11:18)));
   // A second activity inside one financial period is not another real
   // settlement. Private plans count only recorded, present actions.
   if(!completed.repeated)
    window.FE_NPC_LIFE_PLANS?.record?.(def,a,decision,action,moved,key);
   a.lastCalendarSlot=key;
   w.events.push({id:def.id+'|calendar|'+key,actorId:def.id,turn,date:c.date,
    slot:period.name,locationId:destination,goal:a.goal,decisionReason:decision.reason,
    action:action.kind,roomId:moved.roomId});
  }
  exchangeLocalRumors(w,hash(key),turn);
  const meetings=window.FE_NPC_SOCIAL?.meet?.(w,autonomous(),{key,turn,date:c.date})||[];
  reflectActualMeetings(w,meetings,key);
  recordWitnessedMeetings(meetings);
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
  window.FE_MARKET_UI?.render?.();
  renderContactItineraries();
  return true;
 }
 function observedPosition(id,a){
  const clock=window.FE_WASHINGTON_TIME?.now?.(S);
  return window.FE_WORKSHOP_PRESENCE?.position?.(S,a,id,clock)||a;
 }
 function visibleAt(locationId){
  const w=ensure();if(!w||!locationId)return [];
  return autonomous().filter(d=>observedPosition(d.id,w.agents[d.id])?.locationId===locationId)
   .map(d=>{const a=observedPosition(d.id,w.agents[d.id]);return {id:d.id,name:d.name,roomId:a.roomId||null,activity:a.activity||'present'}});
 }
 // Face-to-face contact only. This uses the NPC's public routine, not
 // hidden personal goals, confidential motives or unscheduled future events.
 function talkAtLocation(id,topic='greet'){
  if(!['greet','work','city','today'].includes(topic)||S.paused||S.phase==='report'||!profile())return {ok:false,reason:'Conversation is unavailable.'};
  const def=BY_ID.get(id),w=ensure(),a=w?.agents[id],position=window.FE_CITY?.currentLocation?.();
  const shown=observedPosition(id,a);
  if(!def||isPlayer(def)||!a||!position||shown?.locationId!==position.locationId||(position.roomId&&shown.roomId&&position.roomId!==shown.roomId)||shown?.status!=='present')
   return {ok:false,reason:'That person is not here now.'};
  const route=S.characterRoute||'industrialist',date=observedDate();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {ok:false,reason:'The game date is not available.'};
  // Quick questions obey precisely the same language barrier as free speech.
  // Hearing an untranslated response never counts as earning acquaintance.
  const languages=window.FE_NPC_LANGUAGE?.spoken?.(def)||[def.language||'en'];
  const understood=languages.some(code=>(Array.isArray(S.playerLanguages)?S.playerLanguages:['en']).includes(code));
  if(!understood){
   const say=languages.includes('zh')?{greet:'你好。',work:'我正在做生意。',city:'這裏是華盛頓。',today:'今天我有自己的事情要辦。'}:
    languages.includes('ru')?{greet:'Добрый день.',work:'Я занят работой.',city:'Это Вашингтон.',today:'У меня свои дела.'}:null;
   if(say)return {ok:true,name:def.name,reply:say[topic],comprehended:false,reason:'The language is not understood.'};
   return {ok:false,reason:'You do not share a language with '+def.name+'.'};
  }
  const already=a.memories.some(m=>m.key===topic&&m.withId===route&&m.date===date);
  if(already)return {ok:false,reason:'You have already discussed that today.'};
  const temperament=window.FE_NPC_PERSONALITY?.approach?.(def,a,{id:route},{date,topic,
   occupied:/reviewing|working|preparing|serving|meeting/i.test(String(a.activity||''))});
  if(temperament&&!temperament.allowed){
   if(!a.memories.some(m=>m.key==='refused'&&m.withId===route&&m.date===date))
    recordInteraction(id,route,'refused',0);
   return {ok:false,reason:def.name+': '+temperament.reason};
  }
  const known=a.memories.some(m=>m.key==='greet'&&m.withId===route);
  const affinity=Number.isFinite(+a.relationships[route])?+a.relationships[route]:0;
  const reply=def.language==='zh'?(topic==='greet'?'你好，我叫李文。':topic==='today'?'我今天忙著處理生意。':topic==='work'?'我正在照看商業訂單與來往貨物。':def.publicRemark):
   def.language==='ru'?(topic==='greet'?'Добрый день.':topic==='today'?'У меня свои дела.':topic==='work'?'Я занят работой.':def.publicRemark):topic==='greet'
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
  if(!profile()||!dev)return {ok:false,reason:'Conversation is unavailable.'};
  if(S.paused||S.phase==='report')return {ok:false,reason:'Conversation is unavailable while the game is paused.'};
  const def=BY_ID.get(id),w=ensure(),actor=w?.agents[id],position=window.FE_CITY?.currentLocation?.(),profileId=profile();
  const shown=observedPosition(id,actor);
  if(!def||isPlayer(def)||!actor||shown?.status!=='present'||!position||
   shown.locationId!==position.locationId||shown.roomId!==position.roomId)
   return {ok:false,reason:'That resident is not in this room.'};
  const date=observedDate(),route=S.characterRoute||'industrialist';
  const temperament=window.FE_NPC_PERSONALITY?.approach?.(def,actor,{id:route},{date,topic:'conversation',
   occupied:/reviewing|working|preparing|serving|meeting/i.test(String(actor.activity||''))});
  if(temperament&&!temperament.allowed){
   if(!actor.memories.some(m=>m.key==='refused'&&m.withId===route&&m.date===date))
    recordInteraction(id,route,'refused',0);
   return {ok:false,reason:def.name+': '+temperament.reason};
  }
  let query;
  const environment=window.FE_WASHINGTON_TIME?.environment?.(S);
  try{query=dev.prepare({save:S,npc:def,utterance,date,weather:environment?.weather||S.turnConditions?.weather||'unavailable',sky:environment,
    location:window.FederalElectricCity?.getLocation?.(position.locationId)?.name||position.locationId,
    playerName:window.FE_CHARACTERS?.get?.(route)?.characterName||route,
    playerLanguages:Array.isArray(S.playerLanguages)?S.playerLanguages:['en'],
    activity:actor.activity,relationship:Number(actor.relationships?.[route]||0),playerId:route,locationId:position.locationId,socialStyle:temperament?.style||'conversational'})}
  catch(e){return {ok:false,reason:String(e.message||e)}}
  if(!query.ok)return query;
  const scripted=window.FE_NPC_SCRIPTED_TALK?.answer?.(def,utterance,{date,place:window.FederalElectricCity?.getLocation?.(position.locationId)?.name,activity:actor.activity});
  let spoken=scripted?.handled?scripted.reply:null;
  if(!spoken&&model?.chat){
   try{
    const result=await model.chat({messages:query.messages});
    if(result?.ok&&typeof result.text==='string'&&result.text.trim())spoken=result.text.trim();
   }catch(e){/* No remote provider required. An unavailable local model must not break ordinary conversation. */}
  }
  if(!spoken)spoken=scripted?.reply||'I cannot say that I know.';
  if(spoken.length>4000)spoken=spoken.slice(0,4000);
  const now=window.FE_CITY?.currentLocation?.(),latest=observedPosition(id,S.npcSimulation?.agents?.[id]);
  if(profile()!==profileId||observedDate()!==date||!now||now.locationId!==position.locationId||
    now.roomId!==position.roomId||latest?.status!=='present'||
    latest.locationId!==position.locationId||latest.roomId!==position.roomId)
   return {ok:false,reason:'The meeting ended before the reply arrived. No conversation was saved.'};
  dev.record(S,id,{date,user:utterance.trim(),reply:spoken,place:position.locationId});
  window.FE_NPC_MEMORY?.remember?.(S,id,{date,kind:'conversation',withId:route,place:position.locationId,source:'player-speech',verified:false,
   text:'The visitor asked: '+utterance.trim().slice(0,205)});
  window.FE_NPC_MEMORY?.reflect?.(S,id,date,route);
  recordInteraction(id,route,'freeform',0);
  // Spoken dialogue is a record, not a performed action or a verified clue.
  if(typeof save==='function')save(true);
  return {ok:true,name:def.name,reply:spoken};
 }
 function publicContacts(){
  // Only face-to-face greetings by this character reveal an NPC's usual routine.
  // Private goals, inferred secrets and rumor contents never reach these cards.
  const w=ensure(),route=S.characterRoute||'industrialist';
  if(!w)return [];
  return autonomous().filter(d=>w.agents[d.id]?.memories.some(m=>m.key==='greet'&&m.withId===route))
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
  const current=window.FE_CITY?.currentLocation?.();
  for(const visitor of visibleAt(locationId).filter(v=>current?.roomId&&v.roomId===current.roomId)){
   const def=BY_ID.get(visitor.id);
   const row=document.createElement('div');row.className='fe-npc-visitor';
   const select=document.createElement('button');select.type='button';select.className='fe-npc-select';
   select.textContent=visitor.name+' · '+visitor.activity;
   select.setAttribute('aria-label','Speak with '+visitor.name);
   const valid=()=>{
    const here=window.FE_CITY?.currentLocation?.(),overlay=document.getElementById('cityRoomOverlay');
    return !!here&&!overlay?.hidden&&here.locationId===locationId&&here.roomId===current.roomId&&
     visibleAt(locationId).some(v=>v.id===visitor.id&&v.roomId===here.roomId);
   };
   select.addEventListener('click',()=>{
    if(!valid())return;
    window.FE_NPC_CARD?.open?.({id:visitor.id,name:visitor.name,occupation:def?.occupation||'Washington resident',
     sex:['madamStar','chenMei','annaPetrovna'].includes(visitor.id)?'woman':'man',
     history:window.FE_NPC_DIALOGUE?.history?.(S,visitor.id)||[],valid,
     onQuick:topic=>talkAtLocation(visitor.id,topic),
     onSpeak:words=>converseAtLocation(visitor.id,words)});
   });
   row.appendChild(select);list.appendChild(row);
  }
  panel.hidden=!list.children.length;
  window.FE_NPC_CARD?.sync?.();
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
  const remembered=observedDate();
  if(/^\d{4}-\d{2}-\d{2}$/.test(remembered)){
   window.FE_NPC_MEMORY?.remember?.(S,id,{date:remembered,kind,withId,place:window.FE_CITY?.currentLocation?.()?.locationId||null,
    source:'direct-encounter',verified:true,text:'The visitor and I had a '+kind.replace(/-/g,' ')+' interaction.'});
   window.FE_NPC_MEMORY?.reflect?.(S,id,remembered,withId);
  }
  if(typeof save==='function')save(true);
  return true;
 }
 function inspect(id){
  const a=ensure()?.agents[id],def=BY_ID.get(id);
  if(!a||!def||isPlayer(def))return null;
  return {id,name:def.name,occupation:def.occupation,ambition:def.ambition,
   traits:{...def.traits},...a,relationships:{...a.relationships},memories:a.memories.map(m=>({...m}))};
 }
 function list(){return autonomous().map(d=>({id:d.id,name:d.name,occupation:d.occupation,language:d.language||'en'}));}
 window.FE_NPC_AI=Object.freeze({ensure,syncClock,visibleAt,renderRoomVisitors,renderContactItineraries,publicContacts,recordInteraction,talkAtLocation,converseAtLocation,inspect,list,stepForState,exchangeLocalRumors});
})();
