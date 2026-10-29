'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
const origin={x:.2,y:.2},east={x:.4,y:.2},south={x:.4,y:.55};
const path=[origin,east,south];
assert.equal(travel.headingAt([origin,east],.5),90,'Eastbound pawn points right');
assert.equal(travel.headingAt([east,origin],.5),270,'Westbound pawn points left');
assert.equal(travel.headingAt([east,south],.5),180,'Southbound pawn points down');
assert.equal(travel.headingAt([south,east],.5),0,'Northbound pawn points up');
assert.equal(travel.headingAt(path,0),90,'First segment direction');
assert.equal(travel.headingAt(path,1),180,'Final segment direction');
assert.equal(travel.headingAt([],0),null);
assert.equal(travel.headingAt([origin],0),null);
assert.equal(travel.headingAt([origin,origin],0.5),null);
assert.equal(travel.headingAt(path,NaN),null);
const bendPx=(east.x-origin.x)*2048,downPx=(south.y-east.y)*1159;
const turnProgress=bendPx/(bendPx+downPx);
assert.equal(travel.headingAt(path,Math.max(0,turnProgress-.001)),90);
assert.equal(travel.headingAt(path,Math.min(1,turnProgress+.001)),180);
const frames=[];
global.requestAnimationFrame=cb=>(frames.push(cb),frames.length);
global.cancelAnimationFrame=()=>{};
const node=name=>({name,attrs:{},style:{},children:[],removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},append(...xs){this.children.push(...xs)},
 remove(){this.removed=true}});
global.document={createElementNS:(ns,name)=>node(name)};
const viewport={clientWidth:900,clientHeight:600,children:[],appendChild(x){this.children.push(x)}};
const done=travel.animate({viewport,points:path,durationMs:1000,mode:'walk',
 project:p=>({x:p.x*900,y:p.y*600})});
const overlay=viewport.children[0],pawn=overlay.children[2],facing=pawn.children[0];
assert.equal(facing.children[0].name,'polygon','Direction marker is attached only to the traveling token');
frames.shift()(0);assert.equal(facing.attrs.transform,'rotate(90)');
frames.shift()(400);assert.equal(facing.attrs.transform,'rotate(90)');
frames.shift()(800);assert.equal(facing.attrs.transform,'rotate(180)');
frames.shift()(1000);
(async()=>{
 assert.equal(await done,true);
 assert.equal(overlay.removed,true,'Direction marker disappears with animated journey');
 console.log('PASS moving-piece direction turns with roads, respects actual image pixels and leaves no permanent dot');
})().catch(error=>{console.error(error);process.exitCode=1});
