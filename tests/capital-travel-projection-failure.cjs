'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
const frames=[];
global.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};
global.cancelAnimationFrame=()=>{};
const node=name=>({name,attrs:{},style:{},children:[],removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},append(...x){this.children.push(...x)},
 remove(){this.removed=true}});
global.document={createElementNS:(ns,name)=>node(name)};
const viewport={clientWidth:600,clientHeight:430,children:[],appendChild(x){this.children.push(x)}};
const path=[{x:.2,y:.3},{x:.5,y:.4},{x:.7,y:.55}];
const error=()=>{throw Error('Simulated map repaint failure')};
assert.equal(travel.showPreview({viewport,points:path,project:error}),false,
 'Preview errors must not leave a broken map overlay');
const projected=p=>({x:p.x*600,y:p.y*430});
assert.equal(travel.showPreview({viewport,points:path,project:projected}),true);
const preview=viewport.children.at(-1);
assert.equal(travel.showPreview({viewport,points:path,project:error}),false);
assert.equal(preview.removed,true,'Failed refresh must clear the previous preview');
let fail=false;
const active=travel.animate({viewport,points:path,durationMs:350,
 project:p=>{if(fail)throw Error('Map viewport changed');return projected(p)}});
assert.equal(travel.active,true);
const overlay=viewport.children.at(-1);
frames.shift()(0);fail=true;frames.shift()(100);
(async()=>{
 assert.equal(await active,false,'Projection error cancels journey, never indicates arrival');
 assert.equal(travel.active,false,'Canceled animation cannot remain active');
 assert.equal(overlay.removed,true,'Broken animation cleans up temporary graphics');
 fail=false;
 const retry=travel.animate({viewport,points:path,durationMs:350,project:projected});
 let time=0;
 while(frames.length){const fn=frames.shift();fn(time+=70);if(time>800)break}
 assert.equal(await retry,true,'A fresh journey can succeed after the projection recovers');
 assert.equal(travel.active,false);
 console.log('PASS failed map projections abort without arrival, clear overlay and allow a successful retry');
})().catch(e=>{console.error(e);process.exitCode=1});
