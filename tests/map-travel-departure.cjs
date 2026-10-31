'use strict';
/* Regression: Go There must visibly start all three travel modes, and fail
 * with actionable feedback instead of silently swallowing an async error.
 * No test case may invent a free teleport or modify the map picture.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const begin=app.indexOf('async function travelFromTitleMap(');
const end=app.indexOf('function buildTitleMapMarkers(',begin);
assert.ok(begin>0&&end>begin,'Full map departure handler is present');
const code=app.slice(begin,end);
function trial(mode,settings={}){
 const calls=[],origin={id:'factory',x:.618,y:.28},destination={id:'star',x:.4,y:.5};
 const points=[{x:origin.x,y:origin.y},{x:destination.x,y:destination.y}];
 points.routeType='provisional-street-network';
 const nodes={titleMapTravelNote:{textContent:''},capitalTravelMode:{value:mode},
  titleMapImage:{naturalWidth:2048,naturalHeight:1159},
  titleMapViewport:{clientWidth:800,clientHeight:450},
  titleMapViewer:{hidden:false},
  titleMapLocationTravel:{dataset:{locationId:'star'},disabled:false},
  titleMapRestoreStreets:{hidden:true}};
 let arrivals=0;
 const S={currentLocation:{locationId:'factory',roomId:'executive-office'}};
 const context={S,document:{getElementById:id=>nodes[id]||null},
  window:{FE_ROAD_EDITOR:{isEditing:()=>false},
   FE_ROAD_LAYOUT:{isActive:()=>!!settings.custom},
   FE_WASHINGTON_TIME:{canSpend:()=>true},
   FE_CAPITAL_TRAVEL:{
    available:(_save,_origin,chosen)=>({ok:true,mode:chosen}),
    clearPreview(){},async animate(options){calls.push(options.mode);return true},
    remainingMinutes:()=>3}},
  activeProfileId:()=>'saved-profile',
  currentCityLocation:()=>({locationId:'factory'}),
  cityLocation:id=>({id,defaultRoom:'star-room'}),
  cityRoom:()=>({id:'star-room',restricted:false}),
  mapTravelRestriction:()=>'',TITLE_MAP_LOCATIONS:[origin,destination],
  titleMapSelectedLocationId:'star',
  capitalTravelBusy:false,titleMapPinEdit:!!settings.edit,
  titleMapState:{x:0,y:0,scale:1},
  capitalTravelMeasurement:()=>{
   if(settings.throw)throw Error('route calculation failed');
   return {points:settings.noRoute?[]:points,
    estimate:{guidePixels:120,
     minutes:{walk:10,horse:8,carriage:7},weather:'clear'}};
  },
  capitalTravelStreetReady:path=>Array.isArray(path)&&path.length>=2,
  capitalTravelWeather:()=> 'clear',capitalTravelFollow:()=>{},
  renderCapitalTravelPreview:()=>{},
  enterMapDestination:()=>{arrivals++;return true},
  console:{error(){}}
 };
 const keys=Object.keys(context);
 const depart=new Function(...keys,code+';return travelFromTitleMap;')(...keys.map(key=>context[key]));
 return {depart,nodes,calls,get arrivals(){return arrivals}};
}
(async()=>{
 for(const mode of ['walk','horse','carriage']){
  const t=trial(mode);
  assert.equal(await t.depart(),true,mode+' should start and complete');
  assert.deepEqual(t.calls,[mode],mode+' must animate its distinct figurine');
  assert.equal(t.arrivals,1,'A completed journey arrives exactly once');
  assert.equal(t.nodes.titleMapLocationTravel.disabled,false,'Go There re-enables after travel');
 }
 const fail=trial('walk',{throw:true});
 assert.equal(await fail.depart(),false,'Unexpected route exception must not arrive');
 assert.match(fail.nodes.titleMapTravelNote.textContent,/route calculation failed/);
 assert.equal(fail.arrivals,0);
 const custom=trial('walk',{custom:true,noRoute:true});
 assert.equal(await custom.depart(),false);
 assert.equal(custom.calls.length,0,'Unconnected roads cannot trigger a phantom animation');
 assert.equal(custom.arrivals,0,'No teleport when custom network is incomplete');
 assert.equal(custom.nodes.titleMapRestoreStreets.hidden,false);
 assert.match(custom.nodes.titleMapTravelNote.textContent,/Use Original Streets/);
 const edit=trial('walk',{edit:true});
 assert.equal(await edit.depart(),false);
 assert.match(edit.nodes.titleMapTravelNote.textContent,/Finish editing pins or streets/);
 assert.ok(html.includes('id="titleMapRestoreStreets"'),'Road restore action exists in map card');
 assert.ok(app.includes('S.customRoadLayout={...saved,active:false}'),
  'Restore uses existing saved road segments and blocks without deleting them');
 assert.ok(app.includes('void travelFromTitleMap(e).catch('),
  'The actual clickable Go There control surfaces rejected promises');
 console.log('PASS Go There walk, horse, carriage, stuck custom roads, edit state and visible errors');
})().catch(e=>{console.error(e);process.exitCode=1});
