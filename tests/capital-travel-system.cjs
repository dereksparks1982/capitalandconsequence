'use strict';
const assert=require('node:assert/strict');
const cts=require('../capital-travel-system.js');
const start={x:.615,y:.383},end={x:.400,y:.453};
const before=JSON.stringify([start,end]);
const path=cts.route(start,end);
assert.ok(path.length>=3,'Travel does not cut across the map diagonally');
assert.deepEqual(path[0],start);assert.deepEqual(path.at(-1),end);
for(let i=1;i<path.length;i++)
 assert.ok(path[i].x===path[i-1].x||path[i].y===path[i-1].y,
  'Every first-pass route section follows an orthogonal street-style direction');
assert.equal(JSON.stringify([start,end]),before,'Travel never changes fixed pin positions');
const e=cts.estimate(path);
assert.ok(e.guidePixels>0);
assert.equal(e.estimatedMiles,null,'Guide pixels are not yet physical miles');
assert.equal(e.calibration,'provisional');
assert.ok(e.minutes.walk>e.minutes.horse);
assert.ok(e.minutes.walk>e.minutes.carriage);
assert.deepEqual(cts.route(start,start),[start]);
assert.deepEqual(cts.route(null,end),[]);
const empty={transport:{assets:[]}};
assert.equal(cts.available(empty,'factory','walk').ok,true);
assert.equal(cts.available(empty,'factory','horse').ok,false);
assert.equal(cts.available(empty,'factory','carriage').ok,false);
const save={transport:{assets:[
 {id:'h1',owner:'personal',kind:'horse',locationId:'factory',status:'stabled'},
 {id:'c1',owner:'personal',kind:'carriage',locationId:'factory',status:'stabled'},
 {id:'h2',owner:'personal',kind:'horse',locationId:'westLivery',status:'stabled'}
]}};
assert.equal(cts.available(save,'factory','horse').horseId,'h1');
assert.equal(cts.available(save,'factory','carriage').carriageId,'c1');
assert.equal(cts.available(save,'eastLivery','horse').ok,false);
assert.equal(cts.available(save,'factory','unknown').ok,false);
console.log('PASS Capital Travel guide pixel lengths, street-style turns, physical modes and immutable pin coordinates');
