'use strict';
const assert=require('node:assert/strict'),social=require('../npc-social.js'),agency=require('../npc-agency.js');
function actor(locationId,roomId){return {locationId,roomId,status:'present',relationships:{},social:null}}
const defs=[
 {id:'a',traits:{sociability:70,caution:60},goals:['maintain-business']},
 {id:'b',traits:{sociability:72,caution:70},goals:['maintain-business']},
 {id:'c',traits:{sociability:80,caution:50},goals:['maintain-business']},
 {id:'d',traits:{sociability:40,caution:80},goals:['maintain-business']}
];
const key='1890-01-03|1',context={key,turn:1,date:'1890-01-03'};
function world(seed=123){return {seed,agents:{a:actor('star','main-room'),b:actor('star','main-room'),c:actor('star','main-room'),d:actor('factory','production-floor')},events:[]}}
let w,records=[];
for(let seed=0;seed<30;seed++){w=world(seed);records=social.meet(w,defs,context);if(records.length)break}
assert.ok(records.length>0,'A crowded room sometimes generates meaningful social interaction');
assert.ok(records.length<=1,'Three people cannot each have multiple meetings in the same period');
for(const r of records){
 assert.equal(r.type,'private-encounter');
 assert.equal(r.locationId,'star');assert.equal(r.roomId,'main-room');
 assert.notEqual(r.partnerId,'d');
 assert.equal(w.agents[r.actorId].relationships[r.partnerId],r.relationshipDelta);
 assert.equal(w.agents[r.partnerId].relationships[r.actorId],r.relationshipDelta);
 assert.equal(w.agents[r.actorId].social.last.key,key);
}
const saved=JSON.stringify(w);
assert.deepEqual(social.meet(w,defs,context),[],'A repeated slot cannot create meetings');
assert.equal(JSON.stringify(w),saved,'Repeated clock sampling never mutates private social state');
const reload=JSON.parse(saved);
assert.deepEqual(social.meet(reload,defs,context),[],'A saved encounter remains settled after reload');
assert.equal(JSON.stringify(reload),saved);
assert.equal(social.meet(w,defs,{...context,key:'1890-01-03|2'}).length<=1,true);
const remote=world(5);remote.agents.b.locationId='oldChinatown';remote.agents.c.roomId='vip-room';
assert.deepEqual(social.meet(remote,defs,context),[],'Different room or location means no encounter');
assert.equal(remote.social.history.length,0);
const isolated=world(6);isolated.agents.b.status='off-duty';isolated.agents.c.status='off-duty';
assert.deepEqual(social.meet(isolated,defs,context),[],'Absent residents never interact');
const base={energy:85,memories:[],goal:'maintain-business'};
const save={knowledge:{version:1,records:[]}};
const before=agency.observe(defs[0],base,{},save);
const after=agency.observe(defs[0],{...base,social:{encounters:9}}, {},save);
assert.ok(after.social>before.social,'Local social life can affect future motive priorities');
assert.equal(w.agents.d.social,null,'Uninvolved residents do not acquire invented memories');
assert.equal(w.events.length>=records.length,true);
console.log('PASS private witnessed NPC meetings, one-per-slot cap, reciprocal relationships and durable replay');
