'use strict';
// Contract checks for the immutable owner's 1938 Washington pictorial map.
// This test needs no external map download or Electron runtime.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const ctx={window:{}};vm.runInNewContext(source('city.js'),ctx);
const sites=ctx.window.FederalElectricCity.mapLocations();
assert.equal(sites.length,40,'all forty registered playable destinations have numbered pins');
assert.equal(new Set(sites.map(s=>s.n)).size,40,'no duplicate numbered pins');
assert.equal(sites.filter(s=>s.origin==='historical').length,17);
assert.equal(sites.filter(s=>s.origin==='fictional').length,23);
for(const site of sites){
 if(site.origin==='historical'){
  assert.ok(site.history&&site.history.summary&&site.history.query,'Non-fiction reading required: '+site.id);
  assert.equal(site.story,null,'Real destinations should not have fictional-location biographies: '+site.id);
  assert.match(site.history.summary, /\S/);
  assert.ok(!site.history.wikipedia || site.history.wikipedia.startsWith('https://en.wikipedia.org/wiki/'),
   'Historical Wikipedia link must be HTTPS and point to Wikipedia: '+site.id);
 }else{
  assert.equal(site.history,null,'Invented place cannot inherit a real historical reading: '+site.id);
  assert.ok(typeof site.story==='string'&&site.story.length>=35,'Fictional place needs its own in-universe history: '+site.id);
  assert.ok(!site.story.includes('Wikipedia article'),'Fictional lore must not masquerade as a historical source: '+site.id);
 }
}

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
assert.equal(byId('whiteHouse').grid,'12-I','White House aligns with original printed guide grid');
assert.equal(byId('washingtonAirport').grid,'9-P','Airport aligns with printed guide');
assert.equal(byId('governmentHospital').grid,'25-R','Southeastern hospital stays on the printed map');
assert.equal(byId('blackwoodAsylum').placement,'area-located','Fictional public District Asylum has an identifiable provisional area');
for(const site of sites.filter(s=>s.placement!=='unverified')){
 assert.notEqual(site.grid,'Outside map','located site must be on actual PRINTED map: '+site.id);
 assert.ok(site.x*2048>=286&&site.x*2048<=1778,'located point must not fall in the index columns: '+site.id);
 assert.ok(site.y*1159>=30&&site.y*1159<=864,'located point must not fall in margins: '+site.id);
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
assert.equal(byId('franciscanMonastery').grid,'21-E','Brookland monastery site sits in real printed grid 21-E');
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
assert.ok(app.includes("federalElectricTitleMapLocationsV5"),'New game uses a fresh map-pin layout store');
assert.ok(!app.includes('wasUntouchedOldDefault')&&!app.includes('TITLE_MAP_OLD_DEFAULTS'),'Old map-pin save migrations are not required');
assert.ok(app.includes('location.userPlaced=true'),'manually moved pins are displayed and stored');
assert.ok(app.includes("confirm('Save pin '+location.n"),'pin drops must receive explicit owner confirmation');
assert.ok(app.includes("if(!approved){"),'rejected map drops restore the previous saved position');
assert.ok(app.includes("if(moved&&!onPrintedMap)"),'drops outside A–R / 1–30 grid are rejected');
assert.ok(app.includes("location.x=before.x;location.y=before.y"),'rejected drops do not persist provisional placements');
assert.ok(app.includes("commerce:'Markets & Repairs'"),'market and repair venues have distinct category filter');
assert.ok(app.includes("marker.hidden=!location||!titleMapMatchesFilters(location)"),
 'all registered numbered map pins appear without an active filter');
assert.ok(app.includes("function titleMapDisplayCoordinate(location,img)"),
 'off-print coordinates get a display-only map-edge anchor');
assert.ok(app.includes("Math.hypot(p.x-other.x,p.y-other.y)>=31"),
 'overlapping pin centers are spread for readable clickable numbers');
assert.ok(app.includes("titleMapGridAt(location.x,location.y)==='Outside map'"),
 'actual out-of-print position remains documented; no source coordinate moves');
assert.ok(css.includes("#titleMapClose.title-map-close")&&
 css.includes("background:#9c282a;color:#fff7ec"),
 'red close X is pinned to the upper-right corner');
assert.ok(css.includes('data-origin="historical"')&&css.includes('data-origin="fictional"'));
assert.ok(css.includes('.title-map-swatch.historical')&&css.includes('.title-map-swatch.fictional'));
assert.ok(img.includes('id="titleMapLocationFact"')&&img.includes('id="cityRoomFact"'),
 'Fiction/Non-Fiction badges exist on both location cards');
assert.ok(img.includes('id="titleMapHistoricalReading"')&&img.includes('id="cityRoomHistoricalReading"'),
 'Map card and visited city room have separately labeled real-history panels');
assert.ok(app.includes("summary.textContent=isReal?'Real History · Further Reading':'Our Alternate History · Fiction'"),
 'Non-fiction links and in-universe fictional lore have separate headings');
assert.ok(app.includes("const story=!isReal?String(location?.story||location?.description||'').trim():''"),
 'Fiction narrative is drawn from venue-specific game canon');
assert.ok(app.includes('if(isReal){'), 'Only real places expose external historical reading links');
assert.ok(css.includes('.historical-reading.is-fiction-story'), 'Fictional history is visibly distinguished in blue');
assert.ok(app.includes("badge.textContent=isReal?'Non-Fiction':'Fiction'"),
 'Player sees literal Non-Fiction / Fiction, not just pin color');
assert.ok(app.includes('renderPlaceReference(location,true)')&&app.includes('renderPlaceReference(location)'),
 'Real-world reading appears on both map card and destination page');
assert.ok(app.includes("readingLink('Library of Congress archives"),'Each real place offers additional archive research');
assert.ok(css.includes('background:rgba(155,48,48,.68)!important')&&
 css.includes('background:rgba(36,94,154,.68)!important'),
 'Only colored pin background is semitransparent; pin labels stay legible');

assert.equal(sites.filter(s=>s.origin==='historical'&&!!s.history).length,17,
 'every historical place has a separate non-fiction reading note');
assert.equal(sites.filter(s=>s.origin==='fictional'&&!!s.history).length,0,
 'invented businesses cannot claim non-fiction reading metadata');
assert.ok(byId('franciscanMonastery').history.summary.includes('1899'),
 'the monastery note does not falsely place its real construction in the 1878 timeline');
for(const id of ['titleMapLocationFact','titleMapHistoricalReading','cityRoomFact','cityRoomHistoricalReading']){
 assert.ok(img.includes('id="'+id+'"'),id+' real/fiction education slot exists');
}
assert.ok(app.includes('renderPlaceReference(location,true)'), 'map card displays badge and reading');
assert.ok(app.includes('renderPlaceReference(location);'), 'city room displays badge and reading');
assert.ok(app.includes("badge.textContent=isReal?'Non-Fiction':'Fiction'"),
 'real versus invented displayed as explicit words on the card');
assert.ok(app.includes("link.rel='noopener noreferrer'"), 'educational links open safely');
assert.ok(css.includes('background:rgba(155,48,48,.68)!important')&&css.includes('background:rgba(36,94,154,.68)!important'),
 'red and blue numbered pin backgrounds are translucent');

console.log('PASS Washington guide: 40 numbered pins, 17 non-fiction / 23 fictional story cards, grid placement, export, pin confirmation and translucent colors');
