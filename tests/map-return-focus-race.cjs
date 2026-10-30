'use strict';
// Regression: the M-key from a city room schedules a requestAnimationFrame
// focus for that room. It must not overwrite an explicitly selected destination
// during an actual animated trip (the packaged Commerce Club smoke failure).
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function section(begin,end){
 const a=app.indexOf(begin),b=app.indexOf(end,a);
 assert.ok(a>0&&b>a,'Missing real map handler '+begin);
 return app.slice(a,b);
}
const roomReturn=section('function returnCityRoomToMap(){','function returnCityRoomToOffice(){');
const close=section('function closeTitleMapLocation(){','function mapTravelRestriction(');
const selection=section('function openTitleMapLocation(id){','function renameSelectedTitleMapPin(');
assert.match(app,/titleMapSelectedLocationId=null,titleMapReturnFocusEpoch=0/);
assert.match(close,/titleMapReturnFocusEpoch\+\+/,'Closing map selection invalidates pending room focus');
assert.match(selection,/titleMapReturnFocusEpoch\+\+/,'Explicit map selection invalidates pending room focus');
function scenario(change){
 const calls=[],pending=[],viewer={hidden:true},current={id:'home'};
 const ctx={
  cityRoomSession:{locationId:'home'},TITLE_MAP_LOCATIONS:[{id:'home'},{id:'commercePoker'}],
  document:{getElementById:id=>id==='titleMapViewer'?viewer:null},
  requestAnimationFrame(fn){pending.push(fn)},
  closeCityRoom(){ctx.cityRoomSession.locationId=null},
  openTitleMap(){viewer.hidden=false},
  currentCityLocation(){return {locationId:current.id}},
  openTitleMapLocation(id){calls.push(id);ctx.markSelection(id)}
 };
 vm.createContext(ctx);
 vm.runInContext("let titleMapReturnFocusEpoch=0,titleMapSelectedLocationId=null,capitalTravelBusy=false;\n"+
  roomReturn+"\n"+
  "this.enter=returnCityRoomToMap;\n"+
  "this.markSelection=id=>{titleMapReturnFocusEpoch++;titleMapSelectedLocationId=id;};\n"+
  "this.closeCard=()=>{titleMapReturnFocusEpoch++;titleMapSelectedLocationId=null;};\n"+
  "this.setBusy=value=>{capitalTravelBusy=value;};",ctx);
 ctx.enter();
 assert.equal(pending.length,1,'Map return schedules one deferred focus');
 if(change==='explicit-destination')ctx.markSelection('commercePoker');
 if(change==='active-journey')ctx.setBusy(true);
 if(change==='closed-map')viewer.hidden=true;
 if(change==='different-location')current.id='factory';
 if(change==='dismissed-then-reopened'){ctx.closeCard();viewer.hidden=true;viewer.hidden=false;}
 pending.shift()();
 return calls;
}
assert.deepEqual(scenario('none'),['home'],'Ordinary room return still focuses its room');
for(const kind of ['explicit-destination','active-journey','closed-map','different-location','dismissed-then-reopened'])
 assert.deepEqual(scenario(kind),[],'Stale room focus must not win: '+kind);
console.log('PASS stale M-key room focus cannot override Commerce Club, cancel travel or reopen a dismissed card');
