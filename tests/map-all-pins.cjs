'use strict';
/* Unfiltered Washington pins: every #1..#40 must be visible and clickable.
 * This is an offline source/DOM simulation; no Electron or Actions needed. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const city={window:{}};vm.runInNewContext(read('city.js'),city);
vm.runInNewContext(read('map-pin-palette.js'),city);
const pins=city.window.FederalElectricCity.mapLocations();
assert.equal(pins.length,40,'The city registry contains 40 numbered locations');
assert.deepEqual(pins.map(v=>v.n).sort((a,b)=>a-b),Array.from({length:40},(_,i)=>i+1));
const byN=n=>pins.find(x=>x.n===n);
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
const docElements={titleMapMarkers:layer,titleMapShowNames:{checked:false,setAttribute(){}},
 titleMapCategory:{value:'all'},titleMapOrigin:{value:'all'}};
const document={getElementById:id=>docElements[id]||null};
const image={naturalWidth:2048,naturalHeight:1159};
const sandbox={window:city.window,document,layer,img:image,TITLE_MAP_LOCATIONS:pins};
sandbox.testCode=snippets+`
 const titleMapState={x:0,y:0,scale:.39},pinDisplayName=l=>l.name;
 let titleMapPinEdit=false,titleMapShowNames=false,titleMapSelectedLocationId=null;
 let titleMapCategory='all',titleMapOrigin='all',titleMapSearchQuery='';
 const $=id=>id==='#titleMapImage'?img:id==='#titleMapMarkers'?layer:null;
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
 for(let a=0;a<coords.length;a++)for(let b=a+1;b<coords.length;b++){
  if(Math.hypot(coords[a].x-coords[b].x,coords[a].y-coords[b].y)<30)
   throw Error('Unfiltered map pins overlap: '+coords[a].id+' / '+coords[b].id);
 }
 for(const id of ['capitalSpeedway','eastLivery','chainBridgeFishing']){
  const m=coords.find(x=>x.id===id);
  if(!m?.title.includes('map edge'))throw Error('Off-guide provisional pin not docked: '+id);
 }
 const finance=checkPins('finance','all','').map(m=>m.dataset.mapLocation);
 if(finance.join(',')!=='brokerOffice,districtBank')throw Error('Finance filter must show only broker and bank');
 if(checkPins('all','historical','').length!==17)throw Error('Historical filter must show 17');
 const broker=checkPins('all','all','broker').map(m=>m.dataset.mapLocation);
 if(broker.join(',')!=='brokerOffice')throw Error('Broker search must show broker #14');
`;
vm.runInNewContext(sandbox.testCode,sandbox,{filename:'map-view-simulation.js'});
const html=read('index.html'),css=read('styles.css');
assert.ok(html.includes('src="assets/artwork/maps/title-map-1938.jpg?'),'Immutable original guide map remains');
assert.ok(css.includes('#titleMapClose.title-map-close')&&css.includes('position:absolute;right:9px;top:9px;z-index:12;'),
 'Red X is pinned inside the game window independent of horizontal toolbar overflow');
console.log('PASS all 40 map pins, edge docking, no overlapping centers, filter, colors, red X and original art');
