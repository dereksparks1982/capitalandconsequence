'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('app.js'),styles=read('styles.css'),citySource=read('city.js');
const match=app.match(/function travelFromTitleMap\(event\)\{[\s\S]*?\n\}\nfunction buildTitleMapMarkers\(/);
assert.ok(match,'Live Go There function found');
const fn=match[0].slice(0,-'\nfunction buildTitleMapMarkers('.length);
function travel({allowed=true,opens=true,visible=true,initialLocation='factory'}={}){
 const log={open:0,close:0,stop:0,prevent:0,refresh:0},map={hidden:false},room={hidden:!visible,focus(){}},message={textContent:''},state={locationId:initialLocation};
 const ctx={
  titleMapSelectedLocationId:'star',TITLE_MAP_LOCATIONS:[{id:'star',name:'Star Club'}],
  $:s=>s==='#titleMapViewer'?map:null,
  mapTravelRestriction:()=>allowed?'':'Entry is restricted',
  document:{getElementById:id=>id==='cityRoomOverlay'?room:id==='titleMapTravelNote'?message:null},
  currentCityLocation:()=>state,
  openCityRoom:id=>{log.open++;if(opens){state.locationId=id;room.hidden=!visible;}return opens;},
  closeTitleMap:()=>{log.close++;map.hidden=true;},
  window:{FE_CAREER_SHELL:{refreshDesk(){log.refresh++;}}},
  console:{error(){}}
 };
 vm.createContext(ctx);
 vm.runInContext(fn,ctx);
 const result=ctx.travelFromTitleMap({preventDefault(){log.prevent++},stopPropagation(){log.stop++}});
 return {result,log,map,room,state,message};
}
let x=travel();
assert.equal(x.result,true);assert.equal(x.state.locationId,'star');
assert.equal(x.map.hidden,true);assert.equal(x.room.hidden,false);
assert.equal(x.log.close,1);assert.equal(x.log.stop,1);assert.equal(x.log.prevent,1);
x=travel({initialLocation:'star'});
assert.equal(x.result,true,'Already saved at club should still open the salon');
x=travel({opens:false});
assert.equal(x.result,false);assert.equal(x.log.close,0);assert.equal(x.map.hidden,false);
assert.match(x.message.textContent,/Could not enter Star Club/);
x=travel({visible:false});
assert.equal(x.result,false,'A hidden destination cannot count as arrival');
assert.equal(x.map.hidden,false);
x=travel({allowed:false});
assert.equal(x.result,false);assert.equal(x.log.open,0);assert.equal(x.log.close,0);
assert.match(styles,/city-room-open \.city-room-overlay\{[^}]*background:#10151d/);
assert.match(app,/overlay\.dataset\.locationId=location\.id/);
const context={window:{}};vm.runInNewContext(citySource,context);
const city=context.window.FederalElectricCity;
assert.equal(city.getLocation('star').defaultRoom,'star-room');
assert.equal(city.getRoom('star','star-room').name,'Star Club Salon');
console.log('PASS map Go There opens the Star Club scene, does not return to desk, and preserves failed travel');
