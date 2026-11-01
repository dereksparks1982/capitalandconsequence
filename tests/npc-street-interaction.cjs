'use strict';
const assert=require('node:assert/strict');
const npc=require('../npc-street-travel.js');
const travel=require('../capital-travel-system.js');
const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const clock=1800;
const route=[{x:.3,y:.3},{x:.4,y:.3},{x:.45,y:.35}];
const agent={id:'samHarlan',status:'travelling',journey:{
 version:1,from:'metropolitanPolice',to:'hillsdale',departedAt:1770,arrivesAt:1830,routePoints:route
}};
const defs=[{id:'samHarlan',name:'Samuel Harlan',occupation:'Metropolitan Police patrolman'},
 {id:'alexiRurik',name:'Alexi Rurik',occupation:'Russian immigrant and courier'}];
global.FE_NPC_AI={list:()=>defs};
global.FE_CAPITAL_TRAVEL={positionAt:(r,f)=>r[Math.min(r.length-1,Math.floor(f*(r.length-1)))]};
global.FederalElectricCity={getLocation:id=>({name:{metropolitanPolice:'Metropolitan Police Station',hillsdale:'Hillsdale / Barry Farm',races:'Racetrack'}[id]||id})};
function element(tag){
 return {tag,attrs:{},children:[],style:{},removed:false,hidden:false,listeners:{},
 setAttribute(k,v){this.attrs[k]=String(v)},
 append(...xs){this.children.push(...xs)},
 appendChild(x){this.children.push(x);return x},
 addEventListener(k,fn){this.listeners[k]=fn},
 remove(){this.removed=true},
 get clientWidth(){return 900},
 get clientHeight(){return 600},
 set textContent(v){this.text=v},get textContent(){return this.text||''}
 };
}
global.document={createElementNS:(ns,t)=>element(t),createElement:element};
const viewport=element('div');
const save={worldCalendar:{worldMinute:clock},npcSimulation:{agents:{sam:agent}}};
const project=p=>({x:p.x*900,y:p.y*600});
let selected=null;
assert.equal(npc.render(save,viewport,project,true,id=>selected=id),1);
let layer=viewport.children.at(-1),mark=layer.children[0];
assert.equal(mark.attrs.role,'button');
assert.equal(mark.attrs['data-resident-id'],'samHarlan');
assert.match(mark.attrs['aria-label'],/Samuel Harlan/);
assert.ok(mark.style.pointerEvents==='all','the resident accepts clicks');
assert.match(mark.children.find(e=>e.tag==='path').attrs.d,/L2 -2/,'the patrolman uses a distinctive police mark');
let stopped=false;
mark.listeners.pointerdown({stopPropagation(){stopped=true}});
assert.equal(stopped,true,'click must not begin map drag');
mark.listeners.click({preventDefault(){},stopPropagation(){}});
layer=viewport.children.at(-2);const card=viewport.children.at(-1);
assert.equal(card.className,'capital-npc-travel-card');
assert.equal(card.children[0].textContent,'Samuel Harlan');
assert.match(card.children[2].textContent,/Hillsdale/);
assert.match(card.children[3].textContent,/meet them at a location/i,'no remote speaking');
const destination=card.children[4].children[0];
destination.listeners.click({stopPropagation(){}});
assert.equal(selected,'hillsdale','destination selection feeds existing travel card, no teleport');
assert.equal(save.worldCalendar.worldMinute,clock);
assert.equal(agent.status,'travelling');
assert.equal(npc.render(save,viewport,project,false),0);
assert.equal(layer.removed,true,'closing map removes interactive markers');
const nextAgent={id:'alexiRurik',status:'travelling',journey:{...agent.journey,mode:'walk'}};
save.npcSimulation.agents={rurik:nextAgent};
assert.equal(npc.render(save,viewport,project,true),1);
const courier=viewport.children.at(-1).children[0];
assert.match(courier.children.find(e=>e.tag==='path').attrs.d,/M-6 -4/,'courier has separate icon');
nextAgent.journey={...nextAgent.journey,vehicle:'wagon'};
assert.equal(npc.render(save,viewport,project,true),1);
const wagon=viewport.children.at(-1).children[0];
assert.match(wagon.children.find(e=>e.tag==='path').attrs.d,/M-13 0/,'wagon icon only when wagon documented');
assert.equal(npc.iconKind(nextAgent,{occupation:'Courier'}),'wagon');
assert.match(source,/destination=>\{/,'map connects destination selection');
console.log('PASS clickable NPC street figures, distinct occupation/vehicle marks, real destinations, no remote talk, map cleanup');
