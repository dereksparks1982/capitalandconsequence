'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
for(const pixels of [50,200,650,1500,3200]){
 const walking=travel.animationDuration(pixels,'walk');
 const horseback=travel.animationDuration(pixels,'horse');
 const carriage=travel.animationDuration(pixels,'carriage');
 assert.ok(walking>carriage&&carriage>horseback,
  'Walking should remain visibly slower than a carriage or horse');
 assert.ok(walking<=8000&&horseback>=850);
}
assert.ok(travel.animationDuration(100,'walk')<travel.animationDuration(1200,'walk'),
 'Longer journeys should take longer to watch');
assert.equal(travel.animationDuration(-1,'walk'),2200);
assert.equal(travel.animationDuration(NaN,'walk'),2200);
const frames=[];
global.requestAnimationFrame=fn=>(frames.push(fn),frames.length);
global.cancelAnimationFrame=()=>{};
const node=tag=>({tag,style:{},attrs:{},children:[],removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},append(...nodes){this.children.push(...nodes)},
 remove(){this.removed=true}});
global.document={createElementNS:(ns,tag)=>node(tag)};
const viewport={clientWidth:600,clientHeight:400,children:[],appendChild(v){this.children.push(v)}};
async function run(points,mode){
 const expected=travel.animationDuration(travel.estimate(points).guidePixels,mode);
 const promise=travel.animate({viewport,points,mode,project:p=>({x:p.x*600,y:p.y*400})});
 assert.equal(travel.active,true);
 frames.shift()(0);
 if(expected>180){frames.shift()(expected-1);assert.equal(travel.active,true);}
 frames.shift()(expected);
 assert.equal(await promise,true);
 assert.equal(travel.active,false);
 return expected;
}
(async()=>{
 const short=[{x:.2,y:.3},{x:.26,y:.3}];
 const long=[{x:.2,y:.3},{x:.8,y:.3}];
 const shortWalk=await run(short,'walk'),longWalk=await run(long,'walk'),
  longHorse=await run(long,'horse');
 assert.ok(shortWalk<longWalk,'Long journeys animate longer than short journeys');
 assert.ok(longHorse<longWalk,'Horseback visual travel is faster than walking');
 assert.equal(travel.estimate(long).estimatedMiles,null,
  'Visual duration does not assert surveyed miles or alter paid game time');
 console.log('PASS route-distance-paced walk/horse/carriage travel, bounded timing, unchanged game-time model');
})().catch(e=>{console.error(e);process.exitCode=1});
