'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
const frames=[];
global.requestAnimationFrame=callback=>(frames.push(callback),frames.length);
global.cancelAnimationFrame=()=>{};
const el=tag=>({tag,attrs:{},style:{},children:[],removed:false,
 setAttribute(name,value){this.attrs[name]=String(value)},
 append(...items){this.children.push(...items)},
 remove(){this.removed=true}});
global.document={createElementNS:(ns,tag)=>el(tag)};
const viewport={clientWidth:850,clientHeight:560,children:[],
 appendChild(node){this.children.push(node)}};
const points=[{x:.12,y:.2},{x:.32,y:.2},{x:.32,y:.39}];
async function check(mode,expectedMinShapes){
 const promise=travel.animate({viewport,points,mode,durationMs:400,
  project:p=>({x:p.x*850,y:p.y*560})});
 const svg=viewport.children.at(-1),group=svg.children[2];
 assert.equal(group.tag,'g');
 assert.equal(group.children.length,3,'Direction wedge, one moving base and one figurine');
 const [facing,outline,figurine]=group.children;
 assert.equal(figurine.tag,'g','Use SVG miniature, not font-dependent chess symbols');
 assert.equal(figurine.attrs.class,'capital-travel-figurine capital-travel-'+mode);
 assert.ok(figurine.children.length>=expectedMinShapes,'The miniature has body features');
 assert.equal(figurine.children.some(v=>v.tag==='text'),false,
  'No chess text glyph should stand in for the illustrated figure');
 assert.equal(outline.tag,'circle');
 frames.shift()(0);frames.shift()(180);
 assert.match(facing.attrs.transform,/rotate\(/,'The direction wedge turns with the route');
 frames.shift()(400);
 assert.equal(await promise,true);
 assert.equal(svg.removed,true,'No figurine or map decoration persists after arrival');
}
(async()=>{
 await check('walk',5);await check('horse',5);await check('carriage',5);
 const interrupted=travel.animate({viewport,points,mode:'walk',
  project:p=>({x:p.x*850,y:p.y*560})});
 const canceledOverlay=viewport.children.at(-1);
 travel.cancel();
 assert.equal(await interrupted,false,'Cancel cannot count as an arrival');
 assert.equal(canceledOverlay.removed,true);
 console.log('PASS three local SVG figurines, rotation, cleanup and canceled trip');
})().catch(e=>{console.error(e);process.exitCode=1});
