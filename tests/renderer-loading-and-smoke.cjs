'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),html=read('index.html');
assert.equal([...html.matchAll(/<script\b[^>]*>/gi)].length,[...html.matchAll(/<\/script\s*>/gi)].length,'Every renderer script must close');
const external=[...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/gi)].length;
const complete=[...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>\s*<\/script\s*>/gi)].length;
assert.equal(external,complete,'External scripts close before the next script tag');
const order=['vendor/pathfinding/pathfinding-browser.min.js','vendor/konva/konva.min.js','vendor/yuka/yuka.min.js','road-layout.js','capital-travel-system.js','app.js','road-editor.js'];
let at=-1;
for(const name of order){const next=html.indexOf('src="'+name+'?');assert.ok(next>at,'Missing or misordered script: '+name);at=next;}
const investigationOrder=['shared-world.js','asylum-incident.js','asylum-evidence.js',
 'wardman-politics.js','wardman-records.js','asylum-casework.js','asylum-story.js','app.js','asylum-story-ui.js'];
let inquiryPrevious=-1;
for(const file of investigationOrder){
 const scriptPosition=html.indexOf('src="'+file+'?');
 assert.ok(scriptPosition>inquiryPrevious,'Asylum module must load after its dependencies: '+file);
 inquiryPrevious=scriptPosition;
}
assert.ok(read('asylum-casework.js').includes('function review(world)'),'Casework review module must ship in offline bundle');
assert.ok(read('wardman-records.js').includes('function advanceWorld(world)'),'Wardman institutional record module must ship offline');
const ctx={window:{},document:{getElementById:()=>null}};
vm.createContext(ctx);vm.runInContext(read('road-layout.js'),ctx);vm.runInContext(read('road-editor.js'),ctx);
assert.equal(typeof ctx.window.FE_ROAD_LAYOUT.sanitize,'function');
ctx.window.FE_ROAD_EDITOR.mount({getSave:()=>({}),persist(){},refresh(){}});
assert.equal(ctx.window.FE_ROAD_LAYOUT.sanitize(null).active,false);
const smoke=read('desktop/main.cjs');
assert.ok(smoke.includes('const cityTravelTest=await win.webContents.executeJavaScript(' + String.fromCharCode(96) + '(async () => {'));
assert.equal((smoke.match(/await goAndWait\(\);/g)||[]).length,3,'Commerce, Star and Chinatown journeys finish before checking arrival');
assert.ok(smoke.includes('out.commerceTravelStarted=await goAndWait()'),'Commerce must confirm animation began');
assert.ok(smoke.includes('await Promise.race([')&&smoke.includes('guide.decode()'),'Cold map image must decode before first travel');
assert.ok(smoke.includes('out.commerceDiagnostic='),'A failed first journey must provide useful diagnostics');
assert.ok(smoke.includes("window.FE_CASH_CUSTODY.stake(S,'personal',25,'workingPoker')"));
assert.ok(smoke.includes("window.FE_CASH_CUSTODY.stake(S,'personal',20,'commercePoker')"));
assert.ok(smoke.includes('S.cashCustody=originalCustody'),'Poker smoke restores actual custody state');
assert.ok(smoke.includes('const cityTravel=await win.webContents.executeJavaScript(' + String.fromCharCode(96) + '(async () => {'));
assert.ok(smoke.includes('context.firstTravelCompleted=await travelFromTitleMap()'));
assert.ok(smoke.includes('context.secondTravelCompleted=await travelFromTitleMap()'));
assert.ok(smoke.includes("context.sameLocationButtonEnters=!go.hidden"),'Enter Location control remains visible when already at location');
console.log('Renderer script integrity and asynchronous travel smoke: passed.');
