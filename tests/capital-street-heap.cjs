'use strict';
const assert=require('node:assert/strict');
const graph=require('../capital-street-network.js');
const pins=[
 {x:.618,y:.28},{x:.403,y:.349},{x:.801,y:.306},
 {x:.586,y:.414},{x:.11,y:.326},{x:.885,y:.488}
];
const pixelDistance=route=>route.points.slice(1).reduce((sum,p,i)=>
 sum+Math.hypot((p.x-route.points[i].x)*2048,
  (p.y-route.points[i].y)*1159),0);
const reference=pins.map((start,i)=>pins.map((end,j)=>i===j?null:graph.streetRoute(start,end)));
for(let rep=0;rep<12;rep++)for(let i=0;i<pins.length;i++)
 for(let j=0;j<pins.length;j++){
  if(i===j)continue;
  const same=graph.streetRoute(pins[i],pins[j]);
  const expected=reference[i][j];
  assert.deepEqual(same.points,expected.points,'Heap search must be deterministic');
  assert.equal(same.turns,expected.turns);
  assert.deepEqual(same.namedRoads,expected.namedRoads);
  assert.equal(same.type,expected.type);
  assert.ok(Number.isFinite(pixelDistance(same)));
  const reverse=graph.streetRoute(pins[j],pins[i]);
  assert.ok(Math.abs(pixelDistance(same)-pixelDistance(reverse))<.05,
   'Symmetric roads must have symmetric guide pixel distance');
 }
assert.ok(graph.diagnostic().cachedTrees<=48,'Shortest-path memo remains bounded');
console.log('PASS repeated heap pathfinding, stable diagonal avenues, reversible distances and bounded cache');
