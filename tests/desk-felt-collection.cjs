'use strict';
/* Full-width felt + desk/inventory mechanics, no fabricated starter items.
 * Runs without Electron or browser; interactive UI specifics are also guarded
 * by literal source and CSS contract checks.
 */
const assert=require('node:assert/strict'),fs=require('node:fs');
const path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const src=read('career-shell.js'),css=read('career-shell.css');
const desk=read('desk-collection.js'),effects=read('personal-effects.js');
const index=read('index.html');
for(const [name,code] of [['career-shell.js',src],['personal-effects.js',effects],
 ['desk-collection.js',desk]])new vm.Script(code,{filename:name});
assert.match(css,/\.career-desk \.career-desk-blotter\s*\{[^}]*width:100%;height:184px/s,
 'Blotter covers the entire width of desk, not only the right half.');
assert.ok(src.includes('id="careerDeskBlotter"'),'Full-width desk has an item placement surface');
assert.ok(src.includes('data-desk-move="map"')&&src.includes('data-desk-move="ledger"'),
 'Both original clickable map and ledger are draggable.');
assert.ok(desk.includes('event.stopImmediatePropagation()'),
 'A completed drag must not open the underlying map or book.');
assert.ok(desk.includes("layout()[drag.id]=p;save()"),
 'Map and ledger positions must persist in the active game.');
assert.ok(desk.includes("root.FE_PERSONAL_EFFECTS?.position?."),
 'Loose desk items persist their positions through the same inventory.');
assert.ok(index.indexOf('personal-effects.js?v=')<index.indexOf('desk-collection.js?v=')&&
 index.indexOf('desk-collection.js?v=')<index.indexOf('career-shell.js?v='),
 'Desk collector loads after personal effects and before career shell.');
const S={personalEffects:{version:1,items:[]}};
let location={locationId:'factory',roomId:'executive-office'},saves=0;
const window={};
const context={window,S,activeProfileId:()=> 'test-profile',
 currentCityLocation:()=>location,save:()=>{saves++},document:{getElementById:()=>null}};
vm.runInNewContext(effects,context,{filename:'personal-effects.js'});
const inv=window.FE_PERSONAL_EFFECTS;
assert.equal(inv.list('desk').length,0);
assert.equal(inv.carried().length,0,'No freebies are invented');
assert.equal(inv.acquire({id:'case-key',name:'Recovered key',kind:'key',description:'Only acquired by a story event.'}).ok,true);
assert.equal(inv.acquire({id:'case-key',name:'Second key'}).ok,false,'No duplicate ownership');
assert.equal(inv.carried().length,1);
assert.equal(inv.transfer('case-key','desk').ok,true);
assert.equal(inv.carried().length,0,'Putting a key on desk removes it from the pockets');
assert.equal(inv.list('desk').length,1);
assert.equal(inv.position('case-key',.21,.63).ok,true);
assert.equal(inv.list('desk')[0].x,.21);
location={locationId:'home',roomId:'storage'};
assert.equal(inv.list('desk').length,0,'Desk is inaccessible while away');
assert.equal(inv.transfer('case-key','left-pocket').ok,false,'No remote retrieval');
location={locationId:'factory',roomId:'executive-office'};
assert.equal(inv.transfer('case-key','left-pocket').ok,true);
assert.equal(inv.list('desk').length,0);
assert.equal(inv.carried()[0].id,'case-key');
assert.equal(saves,4,'Acquisition, deposit, placement and retrieval autosave');
vm.runInNewContext(desk,{window,document:{}},{filename:'desk-collection.js'});
assert.equal(window.FE_DESK_COLLECTION.defaults.map.x,.84);
assert.equal(window.FE_DESK_COLLECTION.defaults.ledger.x,.98);
console.log('PASS full felt, preserved map/ledger, draggable positions, real collected items, isolated pockets and location-bound desk');
