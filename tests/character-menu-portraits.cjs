'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const get=name=>fs.readFileSync(path.join(root,name),'utf8');
const routeCtx={window:{},document:{querySelector:()=>null,getElementById:()=>null}};
vm.runInNewContext(get('character-routes.js'),routeCtx,{filename:'character-routes.js'});
const routes=routeCtx.window.FE_CHARACTERS.list();
assert.equal(routes.length,6,'six selectable routes');
const names=['Charles Whitecomb','Samuel Harlan','Elias Crowe','Edmund Wardman','Bridget Kennedy','Benjamin Leach'];
assert.deepEqual(Array.from(routes,r=>r.characterName),names,'full names and approved order');
assert.deepEqual(Array.from(routes,r=>r.id),['industrialist','investigator','criminal','wardman','proprietor','mariner'],'existing save route ids retained');
for(const route of routes){
 assert.ok(route.portrait,'portrait listed for '+route.characterName);
 assert.ok(fs.existsSync(path.join(root,route.portrait)),'portrait path is case-correct: '+route.portrait);
 assert.equal(route.portrait.startsWith('assets/artwork/characters/portraits/'),true);
 assert.equal(routeCtx.window.FE_CHARACTERS.normalize(route.id),route.id);
}
assert.ok(!/off duty he may visit/i.test(routes[1].summary),'no generic off-duty travel disclaimer');
const cityCtx={window:{}};
vm.runInNewContext(get('city.js'),cityCtx,{filename:'city.js'});
const city=cityCtx.window.FederalElectricCity;
assert.equal(routes[4].startingLocationId,'star');
assert.equal(routes[5].startingLocationId,'salemHarbor');
for(const r of routes){
 const place=city.getLocation(r.startingLocationId);
 assert.ok(place,'real starting location for '+r.id);
 assert.ok(city.getRoom(place.id,r.startingRoomId||place.defaultRoom),'real starting room for '+r.id);
}
assert.equal(city.getLocation('salemHarbor').map,null,'Salem is not an invented Washington pin');
const access=require('../city-access.js');
assert.equal(access.canRoom(city,{kind:'player',route:'proprietor'},'star','owner-office','1878-01-02').ok,true);
assert.equal(access.canRoom(city,{kind:'player',route:'investigator'},'star','owner-office','1878-01-02').ok,false);
assert.equal(access.canRoom(city,{kind:'player',route:'mariner'},'salemHarbor','leach-office','1878-01-02').ok,true);
assert.equal(access.canRoom(city,{kind:'player',route:'industrialist'},'salemHarbor','leach-office','1878-01-02').ok,false);
const menu=get('career-shell.js'),css=get('career-shell.css'),html=get('index.html');
assert.ok(menu.includes('class="career-menu-portrait"'),'cards render portrait images');
assert.ok(menu.includes("cardRail.addEventListener('wheel'"),'wheel is mapped to horizontal scrolling');
assert.ok(menu.includes("cardRail.addEventListener('keydown'"),'keyboard navigation');
assert.ok(css.includes('overflow-x:auto')&&css.includes('scroll-snap-type:x proximity'),'horizontal scrolling CSS');
for(const script of ['character-routes.js','career-shell.js']){
 const needle='src="'+script+'?v=';
 const i=html.indexOf(needle);
 assert.ok(i>=0,script+' must be loaded with a cache-busting key');
 assert.ok(/^\\d{8}-[^"]+/.test(html.slice(i+needle.length)),
  script+' must retain a dated revision');
}
assert.ok(html.indexOf('character-routes.js?v=')<html.indexOf('career-shell.js?v='),
 'Character route definitions must load before the active portrait cards');
console.log('PASS Six portraits, career IDs, locations, access, scroll and keyboard navigation');
