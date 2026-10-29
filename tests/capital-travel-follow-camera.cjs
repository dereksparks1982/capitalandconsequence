'use strict';
const assert=require('node:assert/strict');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const frames=[];
global.requestAnimationFrame=cb=>{frames.push(cb);return frames.length;};
global.cancelAnimationFrame=()=>{};
const element=name=>({
 name,attrs:{},style:{},children:[],removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},
 append(...items){this.children.push(...items)},
 remove(){this.removed=true}
});
global.document={createElementNS:(ns,name)=>element(name)};
const viewport={clientWidth:800,clientHeight:550,children:[],
 appendChild(child){this.children.push(child)}};
const points=travel.route({x:.618,y:.280},{x:.403,y:.349});
let zoom=1,panX=0,panY=0,atHalf=null;
const positions=[];
const promise=travel.animate({
 viewport,points,mode:'walk',durationMs:600,
 onFrame:(location,progress)=>{
  if(progress>=.5&&atHalf===null){zoom=2;panX=-50;panY=-80;atHalf=location;}
 },
 project:p=>({x:panX+p.x*2048*zoom,y:panY+p.y*1159*zoom}),
 onProgress:progress=>positions.push(progress)
});
assert.equal(travel.active,true);
assert.equal(viewport.children.length,1);
const svg=viewport.children[0],pawn=svg.children[1];
frames.shift()(0);
assert.match(pawn.attrs.transform,/translate\(/);
frames.shift()(300);
assert.ok(atHalf,'A halfway road location was emitted before projection');
const screen=pawn.attrs.transform.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
assert.ok(screen,'Current pawn position is projected at the new camera offset');
assert.ok(Math.abs(+screen[1]-(panX+atHalf.x*2048*zoom))<.01);
assert.ok(Math.abs(+screen[2]-(panY+atHalf.y*1159*zoom))<.01);
assert.deepEqual(atHalf,travel.positionAt(points,.5),
 'The location in guide pixels remains unchanged after zoom');
frames.shift()(600);
(async()=>{
 assert.equal(await promise,true);
 assert.equal(travel.active,false);
 assert.equal(svg.removed,true);
 assert.ok(positions.length>=3);
 assert.equal(positions[0],0);
 assert.equal(positions.at(-1),1);
 console.log('PASS animation keeps route progress through live camera zoom and clears finished token');
})().catch(error=>{console.error(error);process.exitCode=1});
