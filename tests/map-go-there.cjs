'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('app.js'),styles=read('styles.css'),citySource=read('city.js');
const match=app.match(/function travelFromTitleMap\(event\)\{[\s\S]*?\n\}\nfunction buildTitleMapMarkers\(/);
assert.ok(match,'Live Go There function found');
const fn=match[0].slice(0,-'\nfunction buildTitleMapMarkers('.length);
function travel({allowed=true,opens=true,visible=true,initialLocation='factory'}={}){
 const log={open:0,stop:0,prevent:0},map={hidden:false},room={hidden:!visible,dataset:{locationId:'factory'},parentNode:null,focus(){}},
  message={textContent:''},state={locationId:initialLocation};
 const body={appendChild(el){el.parentNode=this},classList:{added:[],removed:[],add(v){this.added.push(v)},remove(v){this.removed.push(v)}}};
 const ctx={
  titleMapSelectedLocationId:'star',TITLE_MAP_LOCATIONS:[{id:'star',name:'Star Club'}],
  mapTravelRestriction:()=>allowed?'':'Entry is restricted',
  document:{body,getElementById:id=>id==='cityRoomOverlay'?room:id==='titleMapTravelNote'?message:id==='titleMapViewer'?map:null},
  openCityRoom:id=>{log.open++;if(opens){state.locationId=id;room.hidden=!visible;room.dataset.locationId=id;}return opens},
  console:{error(){}}
 };
 vm.createContext(ctx);vm.runInContext(fn,ctx);
 const result=ctx.travelFromTitleMap({preventDefault(){log.prevent++},stopPropagation(){log.stop++}});
 return {result,log,map,room,body,state,message};
}
let x=travel();
assert.equal(x.result,true);assert.equal(x.state.locationId,'star');
assert.equal(x.map.hidden,true);assert.equal(x.room.hidden,false);
assert.ok(x.body.classList.added.includes('city-room-open'));assert.equal(x.log.stop,1);assert.equal(x.log.prevent,1);
x=travel({initialLocation:'star'});
assert.equal(x.result,true,'Already saved at club should still open the salon');
x=travel({opens:false});
assert.equal(x.result,false);assert.equal(x.map.hidden,false);
assert.match(x.message.textContent,/Could not enter Star Club/);
x=travel({visible:false});
assert.equal(x.result,false,'A hidden destination cannot count as arrival');
assert.equal(x.map.hidden,false);
x=travel({allowed:false});
assert.equal(x.result,false);assert.equal(x.log.open,0);
assert.match(styles,/city-room-open \.city-room-overlay\{[^}]*background:#10151d/);
assert.match(app,/overlay\.dataset\.locationId=location\.id/);
assert.match(app,/travel\.hidden=false;/,'Go There remains available when saved at destination');
assert.match(app,/travel\.disabled=!!reason;/,'Saved location alone does not disable room entry');
const careerSource=read('career-shell.js');
assert.match(careerSource,/if\(roomOverlay\)document\.body\.appendChild\(roomOverlay\)/,'Room overlay is detached from retired title');
assert.match(styles,/body\.city-room-open > #cityRoomOverlay\{[^}]*z-index:3200000/,'Entered rooms cover the map and executive desk');
assert.match(styles,/body\.city-room-open > :not\(#cityRoomOverlay\):not\(#saveFailureBanner\)\{visibility:hidden!important\}/,'Room view hides all old screens');
assert.match(app,/directory\.hidden=false;/,'Room menu is visible for every building');
assert.match(app,/federalElectricTitleMapLocationsV5/,'Old per-profile map locations are not migrated');
assert.doesNotMatch(app,/TITLE_MAP_OLD_DEFAULTS|TITLE_MAP_INTERMEDIATE_DEFAULTS/,'No old-map save migration retained');
const context={window:{}};vm.runInNewContext(citySource,context);
const city=context.window.FederalElectricCity;
assert.equal(city.getLocation('star').defaultRoom,'star-room');
assert.equal(city.getRoom('star','star-room').name,'Star Club Salon');
console.log('PASS map Go There opens the building-only scene and rejects failed travel');
