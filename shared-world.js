/* Shared Washington truth and clock, with no automatic character knowledge. */
(function(root){'use strict';
const copy=v=>JSON.parse(JSON.stringify(v));
// Club fixtures, standings and completed matches belong to shared Washington;
// a playable character's unfinished turn at a table remains private to their own save.
function publicChess(c){if(!c||c.version!==1)return null;return {...copy(c),active:null}}
const validId=id=>typeof id==='string'&&/^w[a-zA-Z0-9_-]{1,48}$/.test(id);
const key=id=>'federalElectricSharedWorld_'+id,diskId=id=>'world_'+id;
function valid(w,id){return !!w&&w.version===1&&w.id===id&&w.clock?.version===1&&Number.isSafeInteger(w.clock.worldMinute)&&Array.isArray(w.events)}
function read(storage,id){if(!validId(id))return null;try{const w=JSON.parse(storage.getItem(key(id))||'null');return valid(w,id)?w:null}catch(_err){return null}}
function create(id,save){
 if(!validId(id)||!save?.worldCalendar||!Number.isSafeInteger(save.worldCalendar.worldMinute))throw Error('Valid campaign and saved calendar required');
 return {version:1,id,clock:copy(save.worldCalendar),remainder:save.worldCalendarRemainder||0,
  date:save.gameDate,turnSerial:save.turnSerial||1,phase:save.phase||'day',
  npcSimulation:copy(save.npcSimulation||null),otherLives:copy(save.otherLives||null),
  chessCircuit:publicChess(save.chessCircuit),lastChessResult:save.lastChessResult||null,
  events:[],nextEvent:1,incidents:{},worldTruth:{},missions:{version:1,active:{},history:[]}};
}
function attach(save,world){
 if(!valid(world,save?.sharedWorldId))throw Error('Missing or damaged shared world; refusing to invent a replacement');
 save.worldCalendar=copy(world.clock);save.worldCalendarStatus='ready';save.worldCalendarRemainder=world.remainder||0;
 save.gameDate=world.date;save.turnSerial=world.turnSerial;save.phase=world.phase;
 save.npcSimulation=copy(world.npcSimulation);save.otherLives=copy(world.otherLives);
 if(world.chessCircuit){
  const personalMatch=save.chessCircuit?.active||null;
  save.chessCircuit=publicChess(world.chessCircuit);
  save.chessCircuit.active=personalMatch?copy(personalMatch):null;
 }
 save.lastChessResult=world.lastChessResult||null;
 save.dayRemaining=root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(save)??save.dayRemaining;
 return save;
}
function capture(save,prior,profileId=null){
 const id=save?.sharedWorldId;
 if(!validId(id)||!save?.worldCalendar||!Number.isSafeInteger(save.worldCalendar.worldMinute))throw Error('Invalid shared campaign state');
 const world=prior||create(id,save);
 if(!valid(world,id))throw Error('Damaged shared world');
 if(world.clock.worldMinute>save.worldCalendar.worldMinute)throw Error('Refusing to rewind shared Washington');
 const next={...copy(world),clock:copy(save.worldCalendar),remainder:save.worldCalendarRemainder||0,
  date:save.gameDate,turnSerial:save.turnSerial||1,phase:save.phase,
  npcSimulation:copy(save.npcSimulation),otherLives:copy(save.otherLives),
  chessCircuit:publicChess(save.chessCircuit||world.chessCircuit),
  lastChessResult:save.lastChessResult||null};
 // Public world facts from filed, paid work only. Private words and theories
 // never flow into another protagonist's knowledge or NPC memories.
 if(profileId&&save.characterRoute==='wardman')
  for(const log of Array.isArray(save.orderlyDuty?.logs)?save.orderlyDuty.logs:[])
   if(log&&typeof log.id==='string'&&typeof log.date==='string')
    recordEvent(next,{id:'ward-file:'+profileId+':'+log.id,type:'asylum-work',
     at:log.date,summary:'An orderly filed a routine care-service entry.',
     actorId:'edmundWardman',locationId:'blackwoodAsylum'});
 root.FE_ASYLUM_STORY?.advanceWorld?.(next);
 return next;
}
function recordEvent(world,{id,type,at,summary,actorId,locationId}={}){
 if(!valid(world,world?.id)||typeof id!=='string'||!id||id.length>120)throw Error('Valid world event ID required');
 if(world.events.some(e=>e.id===id))return {status:'duplicate'};
 if(typeof type!=='string'||!type||typeof summary!=='string'||!summary)throw Error('Event type and objective summary required');
 const event={id,sequence:world.nextEvent++,type:type.slice(0,64),at:typeof at==='string'?at:null,
 summary:summary.slice(0,500),actorId:typeof actorId==='string'?actorId:null,locationId:locationId||null};
 world.events.push(event);return {status:'recorded',event:copy(event)};
}
async function recoverDisk(storage,bridge,id){
 if(!validId(id)||read(storage,id)||typeof bridge?.read!=='function')return false;
 const response=await bridge.read(diskId(id));if(!response?.ok)return false;
 try{const candidate=JSON.parse(response.json);if(!valid(candidate,id))return false;
 storage.setItem(key(id),JSON.stringify(candidate));return true}catch(_err){return false}
}
const api=Object.freeze({key,diskId,validId,valid,read,create,attach,capture,recordEvent,recoverDisk});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHARED_WORLD=api;
})(typeof window!=='undefined'?window:globalThis);
