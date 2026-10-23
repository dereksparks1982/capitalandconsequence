'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const bridge=require('../calendar-bridge.js'),schedule=require('../npc-calendar.js'),knowledge=require('../npc-knowledge.js');
const source=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const itinerary=require('../npc-itinerary.js'),agency=require('../npc-agency.js');
assert.equal(schedule.slot(480),0);assert.equal(schedule.slot(720),1);
assert.equal(schedule.slot(1020),2);assert.equal(schedule.slot(1320),3);
assert.equal(schedule.slot(479),3);assert.throws(()=>schedule.slot(-1));
const worker={id:'foremanSullivan',places:['factory','factory',null,null],activities:['work','work',null,null]};
assert.equal(schedule.at({date:'1890-01-03',weekday:5,minuteOfDay:480},worker).locationId,'factory');
assert.equal(schedule.at({date:'1890-01-04',weekday:6,minuteOfDay:480},worker).locationId,null);
let writes=0;
function attach(S,id){
 const window={FE_NPC_CALENDAR:schedule,FE_CALENDAR_BRIDGE:bridge,FE_NPC_KNOWLEDGE:knowledge,FE_NPC_ITINERARY:itinerary,FE_NPC_AGENCY:agency,
  FE_CITY:{currentLocation:()=>({locationId:'star'}),refreshRoomPeople(){}},
  FE_LIVING_CHARACTERS:{renderRoomVisitors(){}}};
 vm.runInNewContext(source,{S,window,activeProfileId:()=>id,save:()=>writes++,
  document:{getElementById:()=>null}},{filename:'npc-ai.js'});
 return window.FE_NPC_AI;
}
const S={turnSerial:1,gameDate:'1890-01-03',phase:'day',dayRemaining:3600,paused:false,
 characterRoute:'industrialist',notes:[],contacts:{},npcSimulation:{version:1,seed:null,lastStep:null,agents:{},events:[]}};
bridge.start(S,'1890-01-03');
const npc=attach(S,'calendar-profile');
assert.equal(npc.syncClock(),true);
assert.ok(npc.visibleAt('factory').some(n=>n.id==='foremanSullivan'));
assert.equal(npc.talkAtLocation('madamStar','greet').ok,true);
assert.equal(npc.talkAtLocation('madamStar','greet').ok,false);
assert.equal(S.contacts.madamStar.met,true);
assert.equal(npc.publicContacts().length,1,'Only greeted residents appear in the personal itinerary');
assert.equal(npc.publicContacts()[0].id,'madamStar');
assert.equal(npc.publicContacts()[0].next.locationId,'star');
assert.equal(npc.talkAtLocation('madamStar','city').ok,true);
assert.equal(npc.talkAtLocation('madamStar','city').ok,false,'Same-day public city discussion cannot farm affinity');
assert.equal(npc.inspect('madamStar').relationships.industrialist,2,'Greet and first local city talk earn modest affinity');
assert.equal(npc.publicContacts().some(v=>v.id==='foremanSullivan'),false,'Unmet foreman cannot leak his itinerary');
const snap=JSON.stringify(S.npcSimulation);
assert.equal(npc.syncClock(),false);assert.equal(JSON.stringify(S.npcSimulation),snap);
bridge.spend(S,4*3600);assert.equal(npc.syncClock(),true);
assert.equal(S.npcSimulation.lastCalendarSlot,'1890-01-03|1');
bridge.spend(S,12*3600);assert.equal(npc.syncClock(),true);
bridge.spend(S,8*3600);assert.equal(npc.syncClock(),true);
assert.equal(S.npcSimulation.lastCalendarSlot,'1890-01-04|0');
assert.ok(!npc.visibleAt('factory').some(n=>n.id==='foremanSullivan'));
S.paused=true;const paused=JSON.stringify(S.npcSimulation),iso=bridge.moment(S).iso;
assert.equal(bridge.spend(S,3600),0);assert.equal(npc.syncClock(),false);
assert.equal(JSON.stringify(S.npcSimulation),paused);assert.equal(bridge.moment(S).iso,iso);
S.paused=false;bridge.spend(S,2*86400);assert.equal(npc.syncClock(),true);
assert.ok(npc.visibleAt('factory').some(n=>n.id==='foremanSullivan'));
const copied=JSON.parse(JSON.stringify(S)),reloaded=attach(copied,'calendar-profile');
assert.equal(reloaded.syncClock(),false);assert.equal(JSON.stringify(copied.npcSimulation),JSON.stringify(S.npcSimulation));
bridge.spend(copied,10*86400);assert.equal(reloaded.syncClock(),true);
assert.ok(copied.npcSimulation.events.length-S.npcSimulation.events.length<=8);
const legacy={turnSerial:2,phase:'day',dayRemaining:3600,paused:false,gameDate:'1890-01-03',
 worldCalendarStatus:'legacy-unmapped',npcSimulation:{version:1,seed:null,lastStep:null,agents:{},events:[]}};
const oldNPC=attach(legacy,'legacy-profile');
assert.deepEqual(JSON.parse(JSON.stringify(oldNPC.publicContacts())),[],'Legacy unmapped profile does not see secrets');
assert.equal(oldNPC.syncClock(),true);
assert.ok(oldNPC.visibleAt('factory').some(n=>n.id==='foremanSullivan'));
assert.equal(oldNPC.syncClock(),false);
legacy.dayRemaining=1500;assert.equal(oldNPC.syncClock(),true);
assert.ok(writes>=5);
console.log('PASS NPC calendar presence, legacy profiles, pause and reload');
