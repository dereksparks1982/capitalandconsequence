'use strict';
const assert=require('node:assert/strict');
const frames=[];
global.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};
global.cancelAnimationFrame=()=>{};
const element=(tag)=>({
 tag,style:{},attrs:{},children:[],removed:false,textContent:'',
 setAttribute(k,v){this.attrs[k]=String(v)},
 append(...items){this.children.push(...items)},
 remove(){this.removed=true}
});
global.document={createElementNS:(ns,name)=>element(name)};
const travel=require('../capital-travel-system.js');
const viewport={clientWidth:800,clientHeight:500,children:[],
 appendChild(child){this.children.push(child)}};
const points=travel.route({x:.2,y:.3},{x:.7,y:.6});
const pending=travel.animate({viewport,points,mode:'horse',durationMs:350,
 project:p=>({x:p.x*800,y:p.y*500})});
assert.equal(travel.active,true);
assert.equal(viewport.children.length,1);
let time=0,iterations=0;
while(frames.length&&iterations++<40){const fn=frames.shift();fn(time+=50);}
(async()=>{
 assert.equal(await pending,true,'Travel reaches the destination');
 assert.equal(travel.active,false);
 const svg=viewport.children[0];
 assert.equal(svg.removed,true,'Finished travel overlay is removed');
 const [line,token]=svg.children;
 assert.equal(line.tag,'polyline');
 assert.match(line.attrs.points,/160,150/,'Route starts at the actual pin');
 assert.match(line.attrs.points,/560,300/,'Route finishes at the destination pin');
 assert.match(token.attrs.transform,/translate\(560 300\)/);
 const canceled=travel.animate({viewport,points,mode:'walk',
  project:p=>({x:p.x*800,y:p.y*500})});
 assert.equal(travel.active,true);
 travel.cancel();
 assert.equal(await canceled,false,'Interrupted animation cannot commit the arrival');
 assert.equal(travel.active,false);
 console.log('PASS animated token reaches selected pin, draws dotted route and cancels without arrival');
})().catch(err=>{console.error(err);process.exitCode=1});
