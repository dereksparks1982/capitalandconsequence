'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const access=require('../city-access.js'),mobility=require('../npc-mobility.js');
const ai=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const sites=[
 {id:'factory',name:'Federal Electric',defaultRoom:'public',category:'industry',rooms:[{id:'public'}]},
 {id:'oldChinatown',name:'Chinatown',defaultRoom:'market',category:'commerce',rooms:[{id:'market'}]}
];
const city={listLocations:()=>sites,getLocation:id=>sites.find(s=>s.id===id),
 getRoom:(id,room)=>sites.find(s=>s.id===id)?.rooms.find(r=>r.id===room)};
const resident={kind:'npc',id:'visitor',onDuty:false,workplaceId:'factory'};
const visit=(action={})=>mobility.visit(city,{...resident,...action},{date:'1878-01-03',
 key:'food-trip',seed:4,slot:2,defaultLocation:'factory',defaultActivity:'leisure',
 preferredDestination:'oldChinatown',sociability:0});
const shopping=visit();
assert.equal(shopping.locationId,'oldChinatown');
assert.equal(shopping.activity,'shopping for groceries');
assert.equal(shopping.reason,'goal-directed');
assert.equal(visit({onDuty:true}).locationId,'factory','Duty overrides shopping');
assert.equal(access.canRoom(city,resident,'home',null,'1878-01-03').ok,false);
assert.match(ai,/Number\(agent\.needs\?\.hunger\)>=75/,'Trip requires actual hunger');
assert.match(ai,/agent\.economy\.balanceCents>=5/,'Trip requires buyer funds');
assert.match(ai,/shopAtObservedMarket\(def,a,date,'arrival\|'/,
 'Arrival resolves real purchase');
assert.match(ai,/agent\.status!=='present'/,'No purchase during transit');
console.log('PASS goal-directed grocery journey, duty priority, and paid arrival gate');
