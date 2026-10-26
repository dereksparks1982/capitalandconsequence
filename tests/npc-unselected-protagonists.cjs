'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const bridge=require('../calendar-bridge.js');
const calendar=require('../npc-calendar.js');
const knowledge=require('../npc-knowledge.js');
const itinerary=require('../npc-itinerary.js');
const agency=require('../npc-agency.js');
const economy=require('../npc-economy.js');
const mobility=require('../npc-mobility.js');
const needs=require('../npc-needs.js'),weekly=require('../npc-weekly-schedule.js');
const residences=require('../npc-residences.js');
const plans=require('../npc-life-plans.js');
const source=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const citySource=fs.readFileSync(path.join(__dirname,'../city.js'),'utf8');
const cityWindow={};
vm.runInNewContext(citySource,{window:cityWindow},{filename:'city.js'});
const city=cityWindow.FederalElectricCity;
const main={
 industrialist:'charlieWhitcomb',
 investigator:'samHarlan',
 criminal:'eliCrowe',
 wardman:'edmundWardman'
};
function scenario(route){
 const S={characterRoute:route,phase:'day',dayRemaining:3600,turnSerial:1,
  gameDate:'1890-01-03',paused:false,notes:[],contacts:{}};
 let saved=0;
 const current={locationId:'hillsdale',roomId:'neighborhood-street'};
 const cardCalls=[],rows=[],panel={hidden:true};
 const fakeList={replaceChildren(){rows.length=0},appendChild(node){rows.push(node)},
  get children(){return rows}};
 const document={
  getElementById(id){return id==='cityRoomVisitors'?panel:id==='cityRoomVisitorList'?fakeList:null},
  createElement(tag){
   return {tag,type:null,className:'',textContent:'',
    children:[],appendChild(child){this.children.push(child)},
    setAttribute(){},addEventListener(event,handler){if(event==='click')this.click=handler}};
  }
 };
 const window={
  FE_NPC_CALENDAR:calendar,FE_CALENDAR_BRIDGE:bridge,FE_NPC_KNOWLEDGE:knowledge,
  FE_NPC_ITINERARY:itinerary,FE_NPC_AGENCY:agency,FE_NPC_ECONOMY:economy,
  FE_NPC_MOBILITY:mobility,FE_NPC_NEEDS:needs,FE_NPC_WEEKLY:weekly,
  FE_NPC_LIFE_PLANS:plans,
  FE_NPC_RESIDENCES:residences,
  FE_CITY:{currentLocation:()=>current},
  FE_NPC_CARD:{open:options=>cardCalls.push(options),sync(){}},
  FederalElectricCity:city
 };
 vm.runInNewContext(source,{window,document,S,activeProfileId:()=>route+'-profile',
  save:()=>saved++},{filename:'npc-ai.js'});
 bridge.start(S,'1890-01-03');
 const clockBefore=JSON.stringify(S.worldCalendar);
 const npc=window.FE_NPC_AI;
 assert.equal(npc.syncClock(),true);
 assert.equal(npc.list().length,14,'11 residents and exactly three autonomous protagonists');
 const ids=npc.list().map(x=>x.id);
 assert.equal(ids.includes(main[route]),false,'Never spawn the active playable character');
 assert.equal(npc.inspect(main[route]),null,'Player life is not an NPC inspection');
 assert.equal(S.npcSimulation.agents[main[route]],undefined);
 assert.equal(Object.values(main).filter(id=>ids.includes(id)).length,3);
 assert.ok(ids.every(id=>S.npcSimulation.agents[id]?.status==='inactive'||
   S.npcSimulation.agents[id]?.needs?.version===1),
  'Every currently eligible simulated character keeps saved individual needs');
 assert.ok(ids.every(id=>S.npcSimulation.agents[id]?.status==='inactive'||
   S.npcSimulation.agents[id]?.lifePlan?.version===1),
  'Every currently active resident keeps a separate saved personal plan');
 assert.equal(S.npcSimulation.agents[main[route]],undefined,
  'Selected playable character has no off-camera personal plan');
 assert.equal(npc.syncClock(),false,'No second clock settlement without player time');
 assert.equal(JSON.stringify(S.worldCalendar),clockBefore,'NPC replay did not advance the master clock');
 // Characters are clickable in the actual-room resident list.
 if(route!=='investigator'){
  assert.ok(npc.visibleAt('hillsdale').some(p=>p.id==='samHarlan'));
  npc.renderRoomVisitors('hillsdale');
  const row=rows.find(r=>r.children[0]?.textContent.includes('Samuel'));
  assert.ok(row,'Sam is listed only when in the Hillsdale room');
  row.children[0].click();
  assert.equal(cardCalls.at(-1).id,'samHarlan','Selected name opens personal card');
  assert.equal(typeof cardCalls.at(-1).onSpeak,'function','Speech routed into card conversation');
 }
 // A real player time jump advances resident routines; it does not alter the
 // selected protagonist or grant restricted-door permissions.
 bridge.spend(S,10*3600);
 assert.equal(npc.syncClock(),true);
 const starPlan=npc.inspect('madamStar')?.lifePlan;
 assert.ok(starPlan?.goal&&starPlan.history.length<=12,
  'Madam Star retains a bounded, private multi-step goal');
 assert.ok(npc.inspect('madamStar')?.needs?.lastMinute===S.worldCalendar.worldMinute,
  'World time advances the resident condition, not the reverse');
 if(route!=='criminal'){
  const eli=npc.visibleAt('secondNightclub').find(x=>x.id==='eliCrowe');
  assert.ok(eli,'Unselected Eli works a real evening shift');
  assert.equal(eli.roomId,'doorman-post');
  const ec=npc.inspect('eliCrowe').economy;
  assert.equal(ec.earnedCents,0,'Unknown wage is never fabricated');
  assert.equal(ec.debtCents,0,'No made-up household debt');
 }
 // The assistant genuinely returns to his one established private bedroom
 // at the end of the day, including when the player is elsewhere.
 bridge.spend(S,4*3600); // 10 PM
 assert.equal(npc.syncClock(),true);
 let sleeping=npc.visibleAt('factory').find(person=>person.id==='foremanSullivan');
 assert.equal(sleeping?.roomId,'workers-lodging',
  'Sullivan must sleep in his own existing factory room');
 bridge.spend(S,4*3600); // 2 AM
 assert.equal(npc.syncClock(),false,'Same overnight schedule does not re-run');
 sleeping=npc.visibleAt('factory').find(person=>person.id==='foremanSullivan');
 assert.equal(sleeping?.roomId,'workers-lodging','Sullivan stays in his room through the night');
 bridge.spend(S,6*3600); // 8 AM
 assert.equal(npc.syncClock(),true);
 assert.equal(npc.visibleAt('factory').some(person=>person.id==='foremanSullivan'&&
  person.roomId==='workers-lodging'),false,'Sullivan has left the bedroom in the morning');
 assert.ok(saved>0,'Live profile autosave is still invoked');
 return {S,npc};
}
for(const route of Object.keys(main))scenario(route);
console.log('PASS unselected leads, card, no invented wages, Sullivan bedroom overnight and morning departure');
