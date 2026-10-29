'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const start=app.indexOf('async function travelFromTitleMap(event){');
const end=app.indexOf('function buildTitleMapMarkers(){',start);
assert.ok(start>0&&end>start,'Map travel handler exists');
const code=app.slice(start,end);
async function run(change){
 const current={locationId:'factory'},person={value:'person-1'};
 let save={currentLocation:current},commits=0;
 const dest={id:'star',x:.4,y:.35},origin={id:'factory',x:.6,y:.28};
 const viewer={hidden:false},button={disabled:false},mode={value:'walk'};
 const widgets={titleMapViewer:viewer,titleMapLocationTravel:button,
  titleMapImage:{naturalWidth:2048,naturalHeight:1159},
  titleMapViewport:{clientWidth:900,clientHeight:600},
  capitalTravelMode:mode,titleMapTravelNote:{textContent:''}};
 const ctx={
  S:save,titleMapPinEdit:false,titleMapSelectedLocationId:'star',
  capitalTravelBusy:false,TITLE_MAP_LOCATIONS:[origin,dest],
  titleMapState:{x:0,y:0,scale:1},
  document:{getElementById:key=>widgets[key]||null},
  activeProfileId:()=>person.value,
  currentCityLocation:()=>ctx.S.currentLocation,
  cityLocation:id=>({id,defaultRoom:'salon'}),
  cityRoom:()=>({id:'salon',restricted:false}),
  mapTravelRestriction:()=>'',titleDevUnlockAllRooms:false,
  capitalTravelMeasurement:()=>({points:[origin,dest],
   estimate:{guidePixels:450,minutes:{walk:45,horse:30,carriage:38}}}),
  renderCapitalTravelPreview:()=>{},
  enterMapDestination:()=>{commits++;return true},
  console:{warn(){},error(){}}
 };
 ctx.window={
  FE_WASHINGTON_TIME:{canSpend:()=>true},
  FE_CAPITAL_TRAVEL:{
   available:()=>({ok:true,mode:'walk'}),
   clearPreview:()=>{},
   animate:async()=>{
    if(change==='profile')person.value='person-2';
    if(change==='save')ctx.S={currentLocation:{locationId:'factory'}};
    if(change==='origin')ctx.S.currentLocation.locationId='home';
    if(change==='destination')ctx.titleMapSelectedLocationId='home';
    if(change==='mode')mode.value='horse';
    if(change==='pin')dest.x+=.01;
    if(change==='close')viewer.hidden=true;
    return change!=='cancel';
   }
  }
 };
 vm.createContext(ctx);
 vm.runInContext(code+'\nthis.go=travelFromTitleMap;',ctx);
 const result=await ctx.go({preventDefault(){},stopPropagation(){}});
 return {result,commits,busy:ctx.capitalTravelBusy,disabled:button.disabled};
}
(async()=>{
 assert.equal((await run('none')).commits,1,'Valid journey arrives');
 for(const issue of ['profile','save','origin','destination','mode','pin','close','cancel']){
  const r=await run(issue);
  assert.equal(r.commits,0,issue+' must not charge or move the player');
  assert.equal(r.result,false,issue+' must refuse travel');
  assert.equal(r.busy,false,issue+' busy state restored');
  assert.equal(r.disabled,false,issue+' button restored');
 }
 console.log('PASS no ghost arrivals after interrupted or mutated travel');
})().catch(err=>{console.error(err);process.exitCode=1});
