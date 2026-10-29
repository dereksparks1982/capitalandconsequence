'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const from=app.indexOf('function capitalTravelFollow(point){');
const end=app.indexOf('async function travelFromTitleMap(event){',from);
assert.ok(from>=0&&end>from,'Real map follow handler must exist');
const code=app.slice(from,end);
let mapApply=0,clamp=0;
const state={x:0,y:0,scale:2,minScale:1,pointerId:null};
const img={naturalWidth:2048,naturalHeight:1159};
const viewport={clientWidth:800,clientHeight:500};
const ctx={
 document:{getElementById:id=>id==='titleMapViewport'?viewport:id==='titleMapImage'?img:null},
 titleMapState:state,capitalTravelBusy:true,
 titleMapClamp(){clamp++;state.x=Math.min(0,Math.max(800-2048*state.scale,state.x));
 state.y=Math.min(0,Math.max(500-1159*state.scale,state.y));},
 titleMapApply(){mapApply++}
};
vm.createContext(ctx);vm.runInContext(code+'\nthis.follow=capitalTravelFollow;',ctx);
const pin={x:.75,y:.5},copy=JSON.stringify(pin);
ctx.follow(pin);
assert.ok(state.x<0,'Zoomed camera follows a figurine moving off the right edge');
assert.ok(state.y<0,'Zoomed camera also follows vertically');
assert.ok(mapApply>=1&&clamp>=1);
assert.equal(JSON.stringify(pin),copy,'Only viewport camera moves; pin coordinates never change');
const movingState={x:state.x,y:state.y};
state.pointerId=3;
ctx.follow({x:.99,y:.99});
assert.deepEqual({x:state.x,y:state.y},movingState,
 'User manual map dragging takes priority over automatic following');
state.pointerId=null;state.scale=state.minScale;
ctx.follow({x:.99,y:.99});
assert.deepEqual({x:state.x,y:state.y},movingState,
 'Camera does not pan unexpectedly when original art fits the viewport');
state.scale=2;ctx.capitalTravelBusy=false;
ctx.follow({x:.99,y:.99});
assert.deepEqual({x:state.x,y:state.y},movingState,
 'Camera follow never moves the normal map outside an active journey');
assert.match(app.slice(end,end+3200),/onFrame:point=>capitalTravelFollow\(point\)/);
console.log('PASS automatic zoomed camera, manual pan priority, fit-to-view and original pin immutability');
