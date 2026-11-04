'use strict';
/* Camera regression for the owner-approved full-resolution 1880 Mitchell world atlas.
 * The 1888 Admiralty image was removed deliberately. Historical travel geometry
 * and the independent industrial ledger are protected by separate tests.
 */
const assert=require('node:assert/strict');
const c=require('../merchant-chart-camera.js'),nav=require('../merchant-navigation.js');
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-6,x+' != '+y);
const vp={width:1000,height:650},W=nav.CHART.width,H=nav.CHART.height;
assert.deepEqual(c.chart,{width:800,height:492,nativeWidth:9664});
const base=c.fitted(vp),f=Math.min((vp.width-12)/W,(vp.height-12)/H);
near(base.scale,f);near(base.x,(vp.width-W*f)/2);near(base.y,(vp.height-H*f)/2);
near(c.limit(vp,9664,2),9664/(800*2));
near(c.limit(vp,9664,1),10); // Nominal cap protects mobile graphics resources.
let zoom=c.zoomed(base,vp,1.4,650,300);
assert(zoom.scale>base.scale);
const oldPoint=[(650-base.x)/base.scale,(300-base.y)/base.scale];
const newPoint=[(650-zoom.x)/zoom.scale,(300-zoom.y)/zoom.scale];
near(oldPoint[0],newPoint[0]);near(oldPoint[1],newPoint[1]);
const tooFar=c.moved({scale:2,x:-80,y:-40},vp,-5000,-5000);
near(tooFar.x,vp.width-W*2);near(tooFar.y,vp.height-H*2);
const opposite=c.moved(tooFar,vp,8000,9000);
near(opposite.x,0);near(opposite.y,0);
const recorded=c.recorded(zoom,vp);
assert.equal(recorded.chartVersion,3,'Saved camera version must identify Mitchell geometry');
const resumed=c.restored(recorded,vp);
near(resumed.scale,zoom.scale);near(resumed.x,zoom.x);near(resumed.y,zoom.y);
const priorArt={zoom:2,cx:340,cy:300,chartVersion:2};
const legacy={zoom:2,cx:340,cy:300};
for(const old of [priorArt,legacy]){
 const reset=c.restored(old,vp);
 near(reset.scale,base.scale);near(reset.x,base.x);near(reset.y,base.y);
}
const resized=c.reflowed({scale:2,x:-400,y:-140},vp,{width:1100,height:700});
near((vp.width/2+400)/2,(1100/2-resized.x)/resized.scale);
near((vp.height/2+140)/2,(700/2-resized.y)/resized.scale);
const sharp=c.focused(base,vp,[373,221],9,9664,2);
assert(sharp.scale<=9664/1600+1e-6,'Retina zoom respects actual JPEG sharpness');
const compact={width:320,height:450},compactFit=c.fitted(compact);
assert(c.limit(compact,9664,6)>=compactFit.scale,'Always retain fit on high DPI mobile');
assert(c.constrain({scale:compactFit.scale,x:-900,y:400},compact).x>=0);
for(const a of Object.keys(nav.PORTS))for(const b of Object.keys(nav.PORTS)){
 if(a===b)continue;
 const before=nav.route(a,b),after=nav.displayRoute(a,b);
 assert.equal(before.nauticalMiles,after.nauticalMiles,'Map swap must not recalculate passage distance');
 assert.deepEqual(after.points[0],nav.DISPLAY_PORTS[a]);
 assert.deepEqual(after.points.at(-1),nav.DISPLAY_PORTS[b]);
}
assert(nav.DISPLAY_PORTS['New York'][0]<nav.DISPLAY_PORTS.Liverpool[0]);
assert(nav.DISPLAY_PORTS.Liverpool[1]<nav.DISPLAY_PORTS.Havana[1]);
assert.deepEqual(nav.DISPLAY_PORTS.Baltimore,[370,223]);
assert.deepEqual(nav.DISPLAY_PORTS.Hamburg,[482,196]);
console.log('PASS Mitchell camera: full-resolution zoom, pointer anchor, pan, resize, v3 saved view, old chart reset, sailing overlays');