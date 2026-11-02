'use strict';
/* Local Node regression for the separate maritime survey board.
 * The survey cursor never changes the playable character's Washington location.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const regions=require('../merchant-regions.js');
const nav=require('../merchant-navigation.js');
const walk=require('../merchant-harbor-walk.js');
const ui=require('../merchant-harbor-ui.js');
const parent=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(parent,'index.html'),'utf8');
const desk=fs.readFileSync(path.join(parent,'career-shell.js'),'utf8');
const world=fs.readFileSync(path.join(parent,'merchant-world-map.js'),'utf8');
const css=fs.readFileSync(path.join(parent,'merchant-harbor-ui.css'),'utf8');
const save={characterRoute:'industrialist',gameDate:'1878-03-11',personalCash:1500,
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 worldCalendar:{worldMinute:2},industrialEmpire:{version:1,fleet:{cash:0}}};
const beforeLocation=JSON.stringify(save.currentLocation),beforeCash=save.personalCash;
assert.equal(walk.W,12);assert.equal(walk.H,9);
for(const port of Object.keys(nav.PORTS)){
 for(const zone of regions.ZONES){
  const scene=walk.preview(save,port,zone.id);
  assert(scene,port+' '+zone.id+' scene missing');
  assert.equal(scene.tiles.length,9);assert(scene.tiles.every(row=>row.length===12));
  assert(walk.passable(scene.tiles[scene.y][scene.x]));
  assert(ui.render(save,port).includes('12 by 9'));
 }
}
assert.equal(walk.preview(save,'Not a port'),null);
assert.equal(walk.preview(save,'mark:999'),null);
const added=regions.addPin(save,412,383);
assert(added.ok);
assert.equal(walk.preview(save,'mark:'+added.pin.id),null);
assert(regions.classify(save,added.pin.id,'harbor').ok);
assert(walk.preview(save,'mark:'+added.pin.id,'market'));
assert.equal(walk.step(save,'mark:'+added.pin.id,2,0).ok,false);
assert.equal(walk.step(save,'mark:'+added.pin.id,-1,0).ok,true);
assert.equal(walk.walkTo(save,'mark:'+added.pin.id,10,10).ok,false);
const snapshot=JSON.stringify(save.merchantMap.harborSurvey);
walk.preview(save,'mark:'+added.pin.id,'market');
assert.equal(JSON.stringify(save.merchantMap.harborSurvey),snapshot,'reading survey must not invent steps');
const outside=walk.step(save,'mark:'+added.pin.id,-1,0);
assert(outside.ok);
for(let i=0;i<10;i++)walk.step(save,'mark:'+added.pin.id,-1,0);
assert(save.merchantMap.harborSurvey.x>=1,'collision must stop at the boundary');
assert.equal(JSON.stringify(save.currentLocation),beforeLocation,'survey must not teleport Charlie');
assert.equal(save.personalCash,beforeCash,'survey must not charge cash');
assert(html.includes('merchant-harbor-walk.js')&&html.includes('merchant-harbor-ui.js'));
assert(html.includes('merchant-harbor-ui.css')&&html.includes('title-map-1938.jpg'));
assert(desk.includes('careerDeskShippingMap'),'owner desk chart missing');
assert(css.includes('.merchant-harbor-tile'));
assert(world.includes("walk-open:")&&world.includes("walk-step:")&&world.includes("walk-zone:"));
assert(world.includes("session.walking")&&world.includes("session.onChange?.()"));
assert(world.includes('e.key===\'Escape\''),'survey escape gate missing');
console.log('merchant harbor: 8 ports × 6 zones, tiles, character isolation, collision and UI wiring passed');
