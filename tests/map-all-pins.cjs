'use strict';
/* Unfiltered Washington pins: every #1..#40 stays at its true image anchor.
 * This is an offline source/DOM simulation; no Electron or Actions needed. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const city={window:{}};vm.runInNewContext(read('city.js'),city);
vm.runInNewContext(read('map-pin-palette.js'),city);
const pins=city.window.FederalElectricCity.mapLocations();
assert.equal(pins.length,40,'The city registry contains 40 numbered locations');
assert.deepEqual(Array.from(pins,v=>v.n).sort((a,b)=>a-b),Array.from({length:40},(_,i)=>i+1));
const byN=n=>pins.find(x=>x.n===n);
assert.equal(byN(12).id,'home','Pin #12 is Charlie’s own residence');
assert.equal(byN(12).name,'Home','Pin #12 must be labeled Home, not Our Home');
const ownership=require('../industrial-empire.js');
assert.equal(ownership.ownedLocation({characterRoute:'industrialist'},'home'),true,'Charlies Home #12 uses the black owned-pin treatment');
assert.equal(ownership.ownedLocation({characterRoute:'industrialist'},'factory'),true,'Federal Electric also uses black owned-pin treatment');
assert.equal(ownership.ownedLocation({characterRoute:'investigator'},'home'),false,'Other playable characters do not automatically own Charlies residence');

assert.equal(byN(4).id,'workingPoker');
assert.equal(byN(11).id,'universityMaryland');
assert.equal(byN(14).id,'brokerOffice');
assert.equal(byN(39).id,'nationalTheatre');
assert.equal(byN(40).id,'districtBank');
const palette=city.window.FE_MAP_PIN_PALETTE;
assert.equal(palette.purpose(byN(14)),'commerce');
assert.equal(palette.purpose(byN(40)),'commerce');
assert.equal(palette.purpose(byN(39)),'entertainment');
assert.equal(palette.purpose(byN(11)),'green');
assert.equal(palette.purpose(byN(23)),'government');

const source=read('app.js');
function part(from,to){
 const i=source.indexOf(from),j=source.indexOf(to,i);
 assert.ok(i>=0&&j>i,'Must find the real map function '+from);
 return source.slice(i,j);
}
const snippets=[
 part('function titleMapGridAt(x,y){','function titleMapMatchesSearch(location){'),
 part('function titleMapMatchesSearch(location){','function focusTitleMapDirectoryLocation(id){'),
 part('function syncTitleMapFilters(){','function initTitleMapFilters(){'),
 part('function titleMapDisplayCoordinate(location,img){','function closeTitleMapLocation(){')
].join('\n');
const markers=pins.map(x=>({dataset:{mapLocation:x.id},hidden:false,style:{},
 classList:{toggle(){}},title:''}));
const layer={classList:{toggle(){}},querySelectorAll:()=>markers};
const mapViewport={getBoundingClientRect:()=>({left:0,top:0,right:940,bottom:555,width:940,height:555})};
const infoCard={hidden:true,getBoundingClientRect:()=>({left:610,top:90,right:940,bottom:535,width:330,height:445})};
const docElements={titleMapMarkers:layer,titleMapShowNames:{checked:false,setAttribute(){}},
 titleMapCategory:{value:'all'},titleMapOrigin:{value:'all'},titleMapLocationCard:infoCard};
const document={getElementById:id=>docElements[id]||null};
const image={naturalWidth:2048,naturalHeight:1159};
const sandbox={window:city.window,document,layer,img:image,mapViewport,infoCard,TITLE_MAP_LOCATIONS:pins};
sandbox.testCode=snippets+`
 const titleMapState={x:0,y:0,scale:.39},pinDisplayName=l=>l.name;
 let titleMapPinEdit=false,titleMapShowNames=false,titleMapSelectedLocationId=null;
 let titleMapCategory='all',titleMapOrigin='all',titleMapSearchQuery='';
 const $=id=>id==='#titleMapImage'?img:id==='#titleMapMarkers'?layer:id==='#titleMapViewport'?mapViewport:id==='#titleMapLocationCard'?infoCard:null;
 function renderTitleMapDirectory(){}
 function closeTitleMapLocation(){titleMapSelectedLocationId=null;}
 function checkPins(cat,origin,search){
  titleMapCategory=cat;titleMapOrigin=origin;titleMapSearchQuery=search;
  syncTitleMapFilters();
  return layer.querySelectorAll('[data-map-location]').filter(m=>!m.hidden);
 }
 const all=checkPins('all','all','');
 if(all.length!==40)throw Error('Expected 40 visible unfiltered map markers, found '+all.length);
 const coords=all.map(m=>({id:m.dataset.mapLocation,x:parseFloat(m.style.left),y:parseFloat(m.style.top),title:m.title}));
 for(const p of coords){
  if(!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error('No visible position for '+p.id);
 }
 // All forty markers are tied to one consistent image coordinate.
 // Overlap is intentional; the player explicitly rejected shifting pins.
 function expectedAnchor(id){
  const place=TITLE_MAP_LOCATIONS.find(v=>v.id===id);
  const point=titleMapDisplayCoordinate(place,img);
  return {x:titleMapState.x+point.x*titleMapState.scale,
   y:titleMapState.y+point.y*titleMapState.scale};
 }
 function assertAnchored(markers){
  for(const marker of markers){
   const point=expectedAnchor(marker.dataset.mapLocation);
   const x=parseFloat(marker.style.left),y=parseFloat(marker.style.top);
   if(Math.abs(x-point.x)>.001||Math.abs(y-point.y)>.001)
    throw Error('Map pin moved off assigned image coordinate: '+marker.dataset.mapLocation);
  }
 }
 assertAnchored(all);
 for(const id of ['capitalSpeedway','eastLivery','chainBridgeFishing']){
  const m=coords.find(x=>x.id===id);
  if(!m?.title.includes('map edge'))throw Error('Off-guide provisional pin not docked: '+id);
 }
 const finance=checkPins('finance','all','').map(m=>m.dataset.mapLocation);
 if(finance.join(',')!=='brokerOffice,districtBank')throw Error('Finance filter must show only broker and bank');
 if(checkPins('all','historical','').length!==17)throw Error('Historical filter must show 17');
 const broker=checkPins('all','all','broker').map(m=>m.dataset.mapLocation);
 if(broker.join(',')!=='brokerOffice')throw Error('Broker search must show broker #14');
 // Every fixed or area-located historical source retains its genuine
 // A–R / 1–30 grid. No algorithm is allowed to overwrite saved coordinates.
 for(const [id,expected] of [['whiteHouse','12-I'],['governmentHospital','25-R'],
  ['washingtonAirport','9-P'],['georgetownCanal','7-I'],['easternBranchFishing','24-M'],
  ['blackwoodAsylum','26-Q']]){
   const location=TITLE_MAP_LOCATIONS.find(v=>v.id===id);
   if(titleMapGridAt(location.x,location.y)!==expected)
    throw Error('Wrong coordinate '+id+' expected '+expected);
 }
 const exactAnchors=['whiteHouse','governmentHospital','washingtonAirport',
  'georgetownCanal','easternBranchFishing'];
 for(const id of exactAnchors){
  const location=TITLE_MAP_LOCATIONS.find(v=>v.id===id);
  const marker=coords.find(m=>m.id===id);
  const expectedX=location.x*img.naturalWidth*titleMapState.scale;
  const expectedY=location.y*img.naturalHeight*titleMapState.scale;
  if(Math.abs(marker.x-expectedX)>0.001||Math.abs(marker.y-expectedY)>0.001)
   throw Error('Map-anchored landmark badge shifted: '+id);
 }
 // Opening a location card MUST NOT move any map pin. A pin can be
 // covered by an information card; its directory entry remains accessible.
 infoCard.hidden=false;
 const beforeCard=Object.fromEntries(all.map(m=>[m.dataset.mapLocation,[m.style.left,m.style.top]]));
 checkPins('all','all','');
 assertAnchored(all);
 for(const marker of all){
  const before=beforeCard[marker.dataset.mapLocation];
  if(marker.style.left!==before[0]||marker.style.top!==before[1])
   throw Error('Info card repositioned pinned place '+marker.dataset.mapLocation);
 }
 if(!all.find(x=>x.dataset.mapLocation==='blackwoodAsylum'))throw Error('Asylum #22 missing');
 infoCard.hidden=true;
 // Zoom and pan must preserve fixed map-image anchor relationships.
 titleMapState.scale=.78;titleMapState.x=-250;titleMapState.y=-110;
 checkPins('all','all','');
 assertAnchored(all);
 titleMapState.scale=.39;titleMapState.x=0;titleMapState.y=0;
 checkPins('all','all','');
 assertAnchored(all);
`;
vm.runInNewContext(sandbox.testCode,sandbox,{filename:'map-view-simulation.js'});
const html=read('index.html'),css=read('styles.css');
assert.ok(html.includes('src="assets/artwork/maps/title-map-1938.jpg?'),'Immutable original guide map remains');
assert.ok(css.includes('#titleMapClose.title-map-close')&&css.includes('position:absolute;right:9px;top:9px;z-index:12;'),
 'Red X is pinned inside the game window independent of horizontal toolbar overflow');
assert.ok(!source.includes('titleMapPinTethers')&&!source.includes('title-map-pin-tether'),'White dots and pin tethers were removed');
console.log('PASS 40 anchored map pins, card/zoom/pan stability, edge warnings, filters, red X and original artwork');
