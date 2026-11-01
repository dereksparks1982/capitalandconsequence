'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const npc=require('../npc-street-travel.js'),discovery=require('../npc-discovery.js');
const clock=1800;
const route=[{x:.3,y:.3},{x:.4,y:.3},{x:.45,y:.35}];
const agent={id:'samHarlan',status:'travelling',journey:{
 version:1,from:'metropolitanPolice',to:'hillsdale',departedAt:1770,arrivesAt:1830,routePoints:route
}};
const defs=[{id:'samHarlan',name:'Samuel Harlan',occupation:'Metropolitan Police patrolman'},
 {id:'alexiRurik',name:'Alexi Rurik',occupation:'Russian immigrant and courier'}];
global.FE_NPC_AI={list:()=>defs};
global.FE_NPC_DISCOVERY=discovery;
global.FE_CAPITAL_TRAVEL={positionAt:(r,f)=>r[Math.min(r.length-1,Math.floor(f*(r.length-1)))]};
function element(tag){
 return {tag,attrs:{},children:[],style:{},removed:false,hidden:false,listeners:{},
 setAttribute(k,v){this.attrs[k]=String(v)},
 append(...xs){this.children.push(...xs)},appendChild(x){this.children.push(x);return x},
 addEventListener(k,fn){this.listeners[k]=fn},remove(){this.removed=true},
 get clientWidth(){return 900},get clientHeight(){return 600},
 set textContent(v){this.text=v},get textContent(){return this.text||''}
 };
}
global.document={createElementNS:(ns,t)=>element(t),createElement:element};
const viewport=element('div'),save={worldCalendar:{worldMinute:clock},characterRoute:'industrialist',
 npcSimulation:{agents:{sam:agent}}};
const project=p=>({x:p.x*900,y:p.y*600});
assert.equal(npc.render(save,viewport,project,true),0,'undiscovered travelers are invisible');
assert.equal(discovery.learn(save,'samHarlan','newspaper','read the signed police story'),true);
assert.equal(npc.render(save,viewport,project,true),1);
let layer=viewport.children.at(-1),mark=layer.children[0];
assert.equal(mark.attrs.role,'button');
assert.equal(mark.attrs['data-resident-id'],'samHarlan');
assert.match(mark.attrs['aria-label'],/Samuel Harlan/);
assert.doesNotMatch(mark.attrs['aria-label'],/hillsdale|metropolitan/i,'no route or destination leakage');
assert.equal(mark.style.pointerEvents,'all','person must be clickable');
assert.match(mark.children.find(e=>e.tag==='path').attrs.d,/L2 -2/,'police icon differs');
let stopped=false;mark.listeners.pointerdown({stopPropagation(){stopped=true}});
assert.equal(stopped,true,'map drag does not absorb the NPC click');
mark.listeners.click({preventDefault(){},stopPropagation(){}});
layer=viewport.children.at(-2);const card=viewport.children.at(-1);
assert.equal(card.className,'capital-npc-travel-card');
assert.equal(card.children[0].textContent,'Samuel Harlan');
assert.match(card.children[2].textContent,/destination is unknown/i);
assert.match(card.children[3].textContent,/meet them in person/i);
assert.equal(card.children[4].children.length,1,'no automatic Show Destination button');
assert.equal(save.worldCalendar.worldMinute,clock,'inspection spends no game time');
assert.equal(agent.status,'travelling');
assert.equal(npc.render(save,viewport,project,false),0);
assert.equal(layer.removed,true,'closing map removes NPC tokens');
const nextAgent={id:'alexiRurik',status:'travelling',journey:{...agent.journey,mode:'walk'}};
save.npcSimulation.agents={rurik:nextAgent};
assert.equal(npc.render(save,viewport,project,true),0,'unknown courier remains hidden');
discovery.learn(save,'alexiRurik','encounter','same-room meeting');
assert.equal(npc.render(save,viewport,project,true),1);
const courier=viewport.children.at(-1).children[0];
assert.match(courier.children.find(e=>e.tag==='path').attrs.d,/M-6 -4/,'courier has distinct rough silhouette');
nextAgent.journey={...nextAgent.journey,vehicle:'wagon'};
assert.equal(npc.render(save,viewport,project,true),1);
const wagon=viewport.children.at(-1).children[0];
assert.match(wagon.children.find(e=>e.tag==='path').attrs.d,/M-13 0/,'confirmed wagon gets wagon icon');
assert.equal(npc.iconKind(nextAgent,{occupation:'Courier'}),'wagon');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
assert.doesNotMatch(app,/destination=>\{\s*\/\/ A moving NPC can be inspected/,'no legacy omniscient map destination shortcut');
console.log('PASS discovery-gated traveling NPCs, identified icons, private destinations, no remote conversation');
