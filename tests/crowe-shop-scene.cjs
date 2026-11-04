'use strict';
const assert=require('node:assert/strict');
const scene=require('../crowe-shop-scene.js');
const cold=require('../crowe-cold-room.js');
const shop=require('../crowe-butchery.js');
const state={characterRoute:'criminal',gameDate:'1878-01-02',phase:'day',paused:false,
 personalCash:4,currentLocation:{locationId:shop.SHOP,roomId:'shop-floor'},
 worldCalendar:{worldMinute:Math.floor(Date.parse('1878-01-02T08:00:00Z')/60000)}};
const ledger=shop.ensure(state),snapshot=shop.summary(state);
assert.equal(scene.ZONES.length,8,'All eight fixed workroom stations remain selectable');
assert.deepEqual([...new Set(scene.ZONES.map(z=>z.room))].sort(),
 ['back-door','cutting-room','ice-room','loft','shop-floor','stock-room'].sort());
assert(scene.ZONES.every(z=>z.x>=0&&z.y>=0&&z.w>0&&z.h>0&&z.x+z.w<=100&&z.y+z.h<=100));
const a=scene.details('rail',snapshot);
assert.equal(a.room,'ice-room');
assert.equal(a.sides[0].ageDays,18);
assert.match(a.status,/early cut by request only/);
const b=scene.details('ice',snapshot);
assert.match(b.status,/Ice: 12\/18/);
assert.equal(scene.details('unknown',snapshot),null);
assert.equal(scene.details('counter',snapshot).room,'shop-floor');
assert.match(scene.details('ledger',snapshot).status,/Shop till/);
assert.deepEqual(scene.details('loft',snapshot).actions,[]);
assert.doesNotMatch(JSON.stringify(scene.ZONES),/smother|lover|destroyed.*will|murder/i);
assert.doesNotMatch(JSON.stringify(scene.details('rail',snapshot)),/smother|lover|murder/i);
const before=JSON.stringify(state);scene.details('rail',snapshot);scene.details('ice',snapshot);
assert.equal(JSON.stringify(state),before,'Inspecting floor objects must not mutate save or pay wages');
class FakeNode {
 constructor(tag){this.tagName=tag;this.children=[];this.childNodes=this.children;
  this.style={};this.dataset={};this.events={};this.attributes={};this.textContent='';}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,fn){this.events[k]=fn}
 appendChild(x){this.children.push(x);return x}
 append(...xs){this.children.push(...xs)}
 replaceChildren(...xs){this.children.splice(0,this.children.length,...xs)}
 click(){this.events.click?.()}
 find(predicate){if(predicate(this))return this;for(const c of this.children){const r=c.find?.(predicate);if(r)return r}return null}
}
const old=global.document;
global.document={createElement:tag=>new FakeNode(tag),createElementNS:(ns,tag)=>new FakeNode(tag)};
try{
 const host=new FakeNode('host'),calls={navigate:[],actions:[]};
 const handlers={summary:snapshot,currentRoom:'shop-floor',onNavigate:id=>calls.navigate.push(id),
  onAction:(id,opts)=>calls.actions.push({id,opts})};
 scene.render(host,handlers);
 assert.equal(host.children.length,1,'One scene inserted into existing butcher panel');
 let stage=host.find(x=>x.attributes['aria-label']==='Butcher shop floor plan');
 assert(stage,'Interactive floor plan exists');
 const ice=host.find(x=>x.dataset.croweSpot==='ice');
 assert(ice,'Ice compartment is a real clickable hotspot');
 ice.click();
 assert.equal(ice.attributes['aria-pressed'],'true');
 const go=host.find(x=>x.textContent==='Go To Ice-Cooled Hanging Room');
 assert(go,'Cross-room work requires navigation');
 go.click();
 assert.deepEqual(calls.navigate,['ice-room']);
 assert.equal(calls.actions.length,0,'Inspecting from another room cannot perform maintenance');
 const counter=host.find(x=>x.dataset.croweSpot==='counter');counter.click();
 host.find(x=>x.textContent==='Serve 1 lb beef · 15 min').click();
 assert.equal(calls.actions[0].id,'counter');
 assert.equal(calls.actions[0].opts.key,'beef');
 assert.equal(JSON.stringify(state),before,'UI inspection and dispatch do not directly alter business finances');
}finally{global.document=old}
console.log('PASS 8 interactive stations, live beef/ice data, accessible room routing, non-mutating inspection and real action dispatch');
