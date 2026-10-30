'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('app.js'),styles=read('styles.css'),citySource=read('city.js');
const start=app.indexOf('function enterMapDestination('),end=app.indexOf('function buildTitleMapMarkers(',start);
assert.ok(start>0&&end>start,'Live room navigation bridge is present');
const source=app.slice(start,end);
function scenario({denied=false,restricted=false,destinationRoom=null,failedJourney=false}={}){
 let rendered=0,saved=0,menus=0,journeys=0;
 const map={hidden:false},notice={textContent:''};
 const body={appendChild(el){el.parentNode=this},classList:{entries:new Set(),add(v){this.entries.add(v)},remove(v){this.entries.delete(v)}}};
 const overlay={hidden:true,dataset:{},parentNode:body,focus(){}};
 const S={characterRoute:'industrialist',gameDate:'1890-01-02',currentLocation:{locationId:'factory',roomId:'executive-office'}};
 const place={id:'star',name:'Star Club',defaultRoom:'star-room'};
 const context={S,
  document:{body,getElementById:id=>({cityRoomOverlay:overlay,titleMapViewer:map,titleMapTravelNote:notice,titleMapLocationTravel:{dataset:{locationId:'star'}}}[id]||null)},
  window:{FederalElectricCity:{},FE_CITY_ACCESS:{canRoom(){return {ok:!denied,reason:'Invitation required'}}},FE_TRAVEL:{recordProvisional(){journeys++;return !failedJourney},recordRoomMove(){journeys++;return !failedJourney}}},
  titleMapSelectedLocationId:'star',TITLE_MAP_LOCATIONS:[{id:'star',name:'Star Club'}],titleDevUnlockAllRooms:false,cityRoomSession:{},
  cityLocation:id=>id==='star'?place:null,cityRoom:(id,roomId)=>({id:roomId||'star-room',restricted}),
  mapTravelRestriction:()=>'',currentCityLocation:()=>({...S.currentLocation}),
  openCityRoom(id,roomId,{dev,source}){assert.equal(dev,true);assert.equal(source,'map');rendered++;overlay.dataset.locationId=id;overlay.hidden=false;return true},
  guardedRoomPanel(name,fn){fn()},renderCityRoomDirectory(){menus++},renderFactoryBreakRoom(){},updateTitleDevCityControls(){},recordLiveryPurchase(){},
  reviewCashOnArrival(){},save(){saved++},closeTitleDialog(){},closeTitleMap(){map.hidden=true},console:{warn(){},error(){}}
 };
 vm.createContext(context);vm.runInContext(source,context);
 // The asynchronous map animation is verified by capital-travel-animation.cjs.
 // This fixture targets the synchronous, authoritative room-arrival transaction
 // after the animated route has finished.
 const result=context.enterMapDestination('star',null,destinationRoom);
 return {result,map,overlay,S,notice,rendered,saved,menus,journeys,session:context.cityRoomSession,body};
}
const salon=scenario();
assert.equal(salon.result,true);
assert.equal(salon.map.hidden,true);
assert.equal(salon.overlay.hidden,false);
assert.equal(salon.S.currentLocation.locationId,'star');
assert.equal(salon.S.currentLocation.roomId,'star-room');
assert.equal(salon.session.dev,false,'map navigation never grants dev permissions');
assert.equal(salon.saved,1,'actual visit requests autosave');
assert.equal(salon.journeys,1,'real travel records its journey');
assert.equal(salon.menus,1,'room menu updated after player privileges restored');
const stopped=scenario({failedJourney:true});
assert.equal(stopped.result,false,'Rejected journey cannot teleport player');
assert.equal(stopped.S.currentLocation.locationId,'factory','Location remains at origin if travel is not paid');
assert.equal(stopped.map.hidden,false,'Map stays open after travel failure');
assert.equal(stopped.overlay.hidden,true,'Unpaid destination preview is hidden');
assert.equal(stopped.saved,0,'No unpaid destination is autosaved');
const dining=scenario({destinationRoom:'dining-room'});
assert.equal(dining.result,true);assert.equal(dining.S.currentLocation.roomId,'dining-room');
const privateDenied=scenario({restricted:true,denied:true,destinationRoom:'madam-office'});
assert.equal(privateDenied.result,false);assert.equal(privateDenied.rendered,0);assert.equal(privateDenied.saved,0);
assert.equal(privateDenied.map.hidden,false);assert.equal(privateDenied.S.currentLocation.locationId,'factory');
const privateGranted=scenario({restricted:true,destinationRoom:'madam-office'});
assert.equal(privateGranted.result,true);
assert.match(app,/button\.onclick=\(\)=>cityRoomSession\.dev\?openCityRoom\(location\.id,room\.id,\{dev:true,source:'dev'\}\):enterMapDestination\(location\.id,null,room\.id\)/);
assert.match(app,/button\.onclick=\(\)=>enterMapDestination\(loc\.id\)/,'unpinned city locations share navigation');
assert.match(app,/e\.target\?\.closest\?\.\('button,input,select,textarea,a,#titleMapLocationCard'\)/,'map viewport does not capture Go There button presses');
assert.match(styles,/body\.city-room-open > #cityRoomOverlay/);
const context={window:{}};vm.runInNewContext(citySource,context);
assert.equal(context.window.FederalElectricCity.getLocation('star').defaultRoom,'star-room');
assert.equal(context.window.FederalElectricCity.getRoom('star','star-room').name,'Star Club Salon');
console.log('PASS: Go There room navigation, normal room permissions, paid time before relocation, rollback and autosave');
