'use strict';
// Contract checks for the immutable owner's 1938 Washington pictorial map.
// This test needs no external map download or Electron runtime.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const ctx={window:{}};vm.runInNewContext(source('city.js'),ctx);
const sites=ctx.window.FederalElectricCity.mapLocations();
assert.equal(sites.length,38,'retain original destinations plus monastery cobbler and two historical markets');
assert.equal(new Set(sites.map(s=>s.n)).size,38,'no duplicate numbered pins');
assert.equal(sites.filter(s=>s.origin==='historical').length,16);
assert.equal(sites.filter(s=>s.origin==='fictional').length,22);
const byId=id=>sites.find(s=>s.id===id);
for(const site of sites){
 assert.ok(Number.isFinite(site.x)&&Number.isFinite(site.y),'finite position: '+site.id);
 assert.ok(site.x>=0&&site.x<=1&&site.y>=0&&site.y<=1,site.id+' in raster');
 assert.ok(site.origin==='historical'||site.origin==='fictional',site.id+' colored by identity');
 assert.ok(typeof site.grid==='string'&&site.grid.length>0,site.id+' has grid status');
 if(!site.evidence)assert.equal(site.provisional,true,site.id+' cannot masquerade as verified');
}
for(const id of ['whiteHouse','washingtonAirport','governmentHospital']){
 const site=byId(id);
 assert.equal(site.origin,'historical');
 assert.equal(site.placement,'map-anchored');
 assert.equal(site.provisional,false);
 assert.notEqual(site.grid,'Outside map');
}
assert.equal(byId('franciscanMonastery').n,35,'Franciscan Monastery is pin 35');
assert.equal(byId('cobblerShop').n,36,'Cobbler is pin 36');
assert.equal(byId('cobblerShop').origin,'fictional','Cobbler storefront is blue');
assert.equal(byId('easternMarket').n,37,'Eastern Market is pin 37');
assert.equal(byId('georgetownMarketHouse').n,38,'Georgetown Market House is pin 38');
assert.equal(byId('easternMarket').origin,'historical','Eastern Market is red');
assert.equal(byId('georgetownMarketHouse').origin,'historical','Georgetown Market House is red');
assert.equal(byId('franciscanMonastery').origin,'historical','Monastery pin is red');
assert.equal(byId('franciscanMonastery').placement,'area-located','Monastery is grounded by address, not falsely labelled printed');
assert.equal(byId('franciscanMonastery').grid,'21-E','Brookland monastery sits in grid 21-E');
assert.equal(byId('metropolitanPolice').origin,'historical','Real DC police institution is historical');
assert.equal(byId('chainBridgeFishing').grid,'Outside map','Chain Bridge bank is not falsely mapped to Georgetown');
assert.equal(byId('hillsdale').placement,'area-located','Barry Farm neighbourhood is placed southeast of river');
assert.equal(byId('star').origin,'fictional','Star Club is invented inside Hay-Adams houses');
assert.equal(byId('embassyPoker').origin,'fictional','Embassy Room is an invented poker venue');
assert.equal(byId('factory').origin,'fictional','Federal Electric is an invented company');
assert.equal(byId('babcockLake').provisional,true,'a filled historical basin is not visible in the fixed map');
const img=source('index.html'),app=source('app.js'),css=source('styles.css');
for(const id of ['titleMapSearch','titleMapOrigin','titleMapExportPins','titleMapDirectory','titleMapLocationGrid']){
 assert.ok(img.includes('id="'+id+'"'),id+' exists in UI');
}
assert.ok(img.includes('src="assets/artwork/maps/title-map-1938.jpg?'),'original artwork retained');
assert.ok(app.includes("titleMapSearchQuery=search.value.trim().toLocaleLowerCase()"));
assert.ok(app.includes("titleMapOrigin==='all'||location.origin===titleMapOrigin"));
assert.ok(app.includes("titleMapGridAt(location.x,location.y)"));
assert.ok(app.includes("format:'capital-consequence-map-pins'"));
assert.ok(app.includes("$('#titleMapLocationCard').addEventListener('pointerdown',e=>e.stopPropagation())"),
 'rename field stops pointerdown before map captures it');
assert.ok(app.includes('viewport.setPointerCapture(e.pointerId)'),'existing map pan remains intact');
assert.ok(app.includes('const TITLE_MAP_OLD_DEFAULTS=Object.freeze({'),'old map defaults identified without clearing V2 storage');
assert.ok(app.includes('wasUntouchedOldDefault'),'untouched old pins receive reviewed defaults');
assert.ok(app.includes('location.userPlaced=true'),'manually moved pins are displayed and stored');
assert.ok(app.includes("confirm('Save pin '+location.n"),'pin drops must receive explicit owner confirmation');
assert.ok(app.includes("if(!approved){"),'rejected map drops restore the previous saved position');
assert.ok(app.includes("if(moved&&!onPrintedMap)"),'drops outside A–R / 1–30 grid are rejected');
assert.ok(app.includes("location.x=before.x;location.y=before.y"),'rejected drops do not persist provisional placements');
assert.ok(app.includes("commerce:'Markets & Repairs'"),'market and repair venues have distinct category filter');
assert.ok(app.includes("(location.placement==='unverified'&&!location.userPlaced)"),
 'unsurveyed coordinates do not appear as confirmed markers');
assert.ok(app.includes("titleMapGridAt(location.x,location.y)==='Outside map'"),
 'outside-index locations are not rendered over the printed map');
assert.ok(css.includes('data-origin="historical"')&&css.includes('data-origin="fictional"'));
assert.ok(css.includes('.title-map-swatch.historical')&&css.includes('.title-map-swatch.fictional'));
console.log('PASS Washington guide: 38 numbered pins, 16 historical/22 invented, verified versus unverified placements, grid/search, export and rename-card isolation');
