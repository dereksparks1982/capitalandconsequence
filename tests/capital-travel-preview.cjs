'use strict';
const assert=require('node:assert/strict');
const cts=require('../capital-travel-system.js');
const make=tag=>({tag,attrs:{},children:[],style:{},removed:false,
 setAttribute(k,v){this.attrs[k]=String(v)},
 append(...nodes){this.children.push(...nodes)},
 remove(){this.removed=true}});
global.document={createElementNS:(ns,tag)=>make(tag)};
const viewport={clientWidth:850,clientHeight:610,children:[],
 appendChild(el){this.children.push(el)}};
const start={x:.6,y:.38},end={x:.4,y:.45};
const points=cts.route(start,end);
const project=p=>({x:p.x*850,y:p.y*610});
assert.equal(cts.showPreview({viewport,points,project}),true);
assert.equal(viewport.children.length,1);
assert.equal(viewport.children[0].children.length,2,
 'Preview contains only the dark backing and dotted route, with no white anchor dots');
const svg=viewport.children[0];
const before=svg.children[1].attrs.points;
end.x=.58;end.y=.4;
const nearer=cts.route(start,end);
assert.equal(cts.showPreview({viewport,points:nearer,project}),true);
assert.equal(viewport.children.length,1,'Moving pins updates same DOM overlay, not duplicates');
assert.notEqual(svg.children[1].attrs.points,before,'Route line recalculates in-place');
assert.equal(svg.children[1].attrs['stroke-dasharray'],'5 8');
assert.equal(start.x,.6,'Source pin unchanged');
assert.equal(end.x,.58,'Edited destination coordinate preserved');
cts.clearPreview();assert.equal(svg.removed,true);
assert.equal(cts.showPreview({viewport,points:[],project}),false);
assert.equal(viewport.children.length,1,'Cleared previews do not create new overlays');
console.log('PASS live map path repaints on pin move, reuses SVG, has no white dots and clears fully');
