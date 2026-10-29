'use strict';
const assert=require('node:assert/strict');
const streets=require('../capital-street-network.js');
const block={x0:.398,x1:.424,y0:.356,y1:.384};
const crosses=(a,b)=>{
 let lower=0,upper=1;
 const dx=b.x-a.x,dy=b.y-a.y;
 for(const [p,q] of [[-dx,a.x-block.x0],[dx,block.x1-a.x],
  [-dy,a.y-block.y0],[dy,block.y1-a.y]]){
  if(Math.abs(p)<1e-12){if(q<0)return false;continue}
  const t=q/p;
  if(p<0)lower=Math.max(lower,t);
  else upper=Math.min(upper,t);
  if(lower>upper)return false;
 }
 return lower<upper&&upper>0&&lower<1;
};
const outside=p=>p.x<block.x0||p.x>block.x1||p.y<block.y0||p.y>block.y1;
const pin={x:.618,y:.28};
let tested=0;
for(let xi=0;xi<=12;xi++)for(let yi=0;yi<=12;yi++){
 const to={x:.345+xi*.012,y:.316+yi*.010};
 if(!outside(to))continue;
 const r=streets.streetRoute(pin,to);
 assert.ok(r?.points.length>=2,'Available street route at '+JSON.stringify(to));
 assert.deepEqual(r.points[0],pin);
 assert.deepEqual(r.points.at(-1),to);
 for(let i=1;i<r.points.length;i++)
  assert.equal(crosses(r.points[i-1],r.points[i]),false,
   'Road/entrance may not cut through excluded White House grounds at '+JSON.stringify(to));
 tested++;
}
assert.ok(tested>140);
const whiteHouse={x:.411,y:.369};
assert.ok(streets.streetRoute(pin,whiteHouse)?.points.length>=2,
 'Visiting the White House itself remains possible');
assert.ok(streets.diagnostic().cachedTrees<=48);
console.log('PASS '+tested+' varied street approaches avoid restricted grounds while landmark visits remain possible');
