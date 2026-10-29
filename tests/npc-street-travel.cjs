'use strict';
const assert=require('node:assert/strict');
const streets=require('../capital-street-network.js');
global.FE_CAPITAL_STREETS=streets;
const travel=require('../capital-travel-system.js');
global.FE_CAPITAL_TRAVEL=travel;
const pins={factory:{x:.618,y:.280},star:{x:.403,y:.349},
 races:{x:.801,y:.306}};
global.FE_NPC_MAP_PIN=id=>pins[id]||null;
const npc=require('../npc-street-travel.js');
const save={turnConditions:{weather:'rain'},worldCalendar:{worldMinute:1010},npcSimulation:{agents:{}}};
const first=npc.plan('factory','star',save);
assert.ok(first&&first.routeType.startsWith('provisional-street'));
assert.ok(first.minutes>5&&first.minutes<=240);
assert.ok(first.routePoints.length>2);
assert.equal(first.weather,'rain');
const previous=first.guidePixels;
pins.star={x:.70,y:.28};
const moved=npc.plan('factory','star',save);
assert.ok(moved.guidePixels<previous,'The CURRENT user-edited pin governs the next NPC route');
assert.equal(npc.plan('factory','factory',save),null);
assert.equal(npc.plan('factory','missing',save),null);
const journey={version:1,from:'factory',to:'star',departedAt:1000,
 arrivesAt:1000+first.minutes,routePoints:first.routePoints,
 routeType:first.routeType,guidePixels:first.guidePixels};
save.worldCalendar.worldMinute=1000+Math.floor(first.minutes/2);
save.npcSimulation.agents.sam={id:'sam',status:'travelling',journey};
assert.ok(npc.progress(journey,save.worldCalendar.worldMinute)>.4);
const svg=tag=>({tag,attrs:{},children:[],style:{},removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},appendChild(v){this.children.push(v)},
 append(...xs){this.children.push(...xs)},remove(){this.removed=true}});
global.document={createElementNS:(ns,tag)=>svg(tag)};
const viewport={clientWidth:900,clientHeight:600,children:[],appendChild(v){this.children.push(v)}};
assert.equal(npc.render(save,viewport,p=>({x:p.x*900,y:p.y*600}),true),1);
const layer=viewport.children[0],pawn=layer.children[0];
assert.equal(pawn.tag,'g');
assert.equal(layer.style.pointerEvents,undefined,'SVG is pointer transparent via fixed cssText');
assert.match(layer.style.cssText,/pointer-events:none/);
assert.equal(npc.render(save,viewport,p=>({x:p.x*900,y:p.y*600}),false),0);
assert.equal(layer.removed,true,'Map close cleans all NPC tokens');
save.worldCalendar.worldMinute=journey.arrivesAt;
assert.equal(npc.render(save,viewport,p=>({x:p.x*900,y:p.y*600}),true),0,
 'Arrived NPCs no longer appear traveling on the map');
console.log('PASS saved NPC route timing, current pins, visible in-transit token and cleanup');
