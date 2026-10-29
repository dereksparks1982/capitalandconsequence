'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const engine=fs.readFileSync(path.join(__dirname,'../capital-travel-system.js'),'utf8');
const index=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const cut=(from,to)=>{
 const a=app.indexOf(from),b=app.indexOf(to,a+from.length);
 assert.ok(a>=0&&b>a,'Missing code section '+from);return app.slice(a,b);
};
const drag=cut("marker.addEventListener('pointermove',e=>{","const finish=e=>{");
assert.match(drag,/location\.x=Math\.max/);
assert.match(drag,/location\.y=Math\.max/);
assert.match(drag,/renderCapitalTravelPreview\(location\.id,true\)/,
 'Dragging must update the preview and all three travel times live');
const finish=cut("const finish=e=>{","marker.addEventListener('pointerup',finish)");
assert.match(finish,/saveTitleMapLocationLayout\(\)/,'Approved changes must persist');
assert.match(finish,/location\.x=before\.x;location\.y=before\.y/,
 'Canceled edits must restore the original coordinate');
assert.match(finish,/renderCapitalTravelPreview\(\)/,'Preview clears after edit');
const pathBuilder=cut('function capitalTravelPath(fromId,toId){',
 'function capitalTravelMeasurement(id){');
assert.match(pathBuilder,/TITLE_MAP_LOCATIONS\.find/,'Routes read current in-memory pin coordinates');
assert.match(pathBuilder,/titleMapDisplayCoordinate/,'Routes use same source anchors as pins');
assert.match(pathBuilder,/points\.length===1&&fromId!==toId/,'Overlapping pins still have a short trip');
const picker=cut('function renderCapitalTravelChoice(id){','function openTitleMapLocation(id){');
assert.match(picker,/capitalTravelMeasurement\(id\)/);
assert.match(picker,/renderCapitalTravelPreview\(id\)/);
const apply=cut('function titleMapApply(){','function titleMapDisplayCoordinate(');
assert.match(apply,/renderCapitalTravelPreview\(\)/,'Zooming and panning refreshes route overlay');
const action=cut('async function travelFromTitleMap(event){','function buildTitleMapMarkers(){');
assert.match(action,/const \{points,estimate:measurement\}=capitalTravelMeasurement\(id\)/);
assert.match(action,/samePins\(\)/,'Changes to source pins cancel stale in-flight journey');
assert.match(action,/routeType:points\.routeType\|\|'provisional-right-angle'/,
 'Saved trips preserve the actual road-network method or a declared fallback');
assert.match(engine,/function showPreview\(/);
assert.match(engine,/function clearPreview\(/);
assert.match(engine,/pointer-events:none/,'Route artwork never blocks map interactions');
assert.match(index,/id="capitalTravelEstimate"/);
console.log('PASS dynamic pin drag preview, safe save/revert, zoom synchronization and fresh journey debit contract');
