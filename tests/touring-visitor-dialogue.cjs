'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm');
const fs=require('node:fs'),path=require('node:path');
const circus=require('../circus-tour.js'),touring=require('../touring-visitors.js'),discovery=require('../npc-discovery.js');
const start=Date.UTC(1878,4,3,9)/60000;
global.FE_CIRCUS_TOUR=circus;
global.FE_NPC_STREET_TRAVEL={plan:(from,to)=>({minutes:35,routeType:'provisional-street-network',
 routePoints:[{x:.1,y:.1},{x:.5,y:.3},{x:.8,y:.6}]})};
global.FederalElectricCity={listLocations:()=>[{id:'races',defaultRoom:'grounds'}],
 getLocation:()=>({defaultRoom:'grounds'})};
const S={worldCalendarStatus:'ready',worldCalendar:{worldMinute:start-20},
 gameDate:'1878-05-03',turnSerial:1,characterRoute:'industrialist',
 currentLocation:{locationId:'races',roomId:'grounds'},notes:[],contacts:{}};
const window={FE_TOURING_VISITORS:touring,FE_CIRCUS_TOUR:circus,FE_NPC_DISCOVERY:discovery,
 FE_CITY:{currentLocation:()=>S.currentLocation},FederalElectricCity:global.FederalElectricCity};
let saved=0;
const document={getElementById:()=>null};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8'),
 {window,S,document,activeProfileId:()=> 'profile-alpha',save:()=>{saved++},console});
const npcs=window.FE_NPC_AI;
assert.ok(npcs.list().some(p=>p.id==='silasPike'));
assert.ok(npcs.list().some(p=>p.id==='visiting-fortune-teller'));
assert.equal(npcs.visibleAt('races').length,0,'a moving wagon is not a conversation target');
assert.equal(npcs.talkAtLocation('silasPike','greet').ok,false,'cannot call a traveling man from his empty stall');
S.worldCalendar.worldMinute=start;
assert.equal(npcs.visibleAt('races').filter(p=>p.id==='silasPike').length,1);
assert.equal(npcs.visibleAt('races').filter(p=>p.id==='visiting-fortune-teller').length,1);
const meeting=npcs.talkAtLocation('silasPike','greet');
assert.equal(meeting.ok,true,'ordinary in-room greeting works for special visitors');
assert.equal(discovery.known(S,'silasPike'),true,'actual face-to-face greeting reveals person');
assert.equal(discovery.known(S,'visiting-fortune-teller'),false,'seeing Silas does not magically reveal everyone');
assert.equal(npcs.inspect('silasPike').status,'present');
assert.equal(npcs.publicContacts().some(p=>p.id==='silasPike'),false,
 'without a published timetable he must not leak a future itinerary');
S.worldCalendar.worldMinute=Date.UTC(1878,4,9,20)/60000+10;
assert.equal(npcs.visibleAt('races').length,0,'a departed traveler is no longer at the stall');
assert.equal(npcs.talkAtLocation('silasPike','work').ok,false,'cannot continue after wagon departs');
assert.equal(npcs.inspect('silasPike').status,'travelling');
assert.ok(saved>0,'real interactions autosave');
console.log('PASS actual NPC conversation only after wagon arrival, no remote talk or itinerary leaks');
