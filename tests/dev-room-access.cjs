'use strict';
// v0.6.66: exercise the map guard from source and the floating panel integration.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const source=read('app.js'),menu=read('career-shell.js'),css=read('career-shell.css');
const cityContext={window:{}};vm.runInNewContext(read('city.js'),cityContext);
const city=cityContext.window.FederalElectricCity;
const fn=source.match(/function mapTravelRestriction\(location\)\{[\s\S]*?\n\}/);
assert.ok(fn,'Map access guard exists');
const ctx={S:{gameDate:'1890-01-03'},titleDevUnlockAllRooms:false,selected:true,
 activeProfileId:()=>ctx.selected?'profile-1':null,cityLocation:id=>city.getLocation(id),
 window:{FE_PATROL:{travel:()=>({ok:false,reason:'Patrol duty restricted'})},FE_VENUES:{canEnterLocation:()=>false}}};
vm.runInNewContext(fn[0]+'\nthis.guard=mapTravelRestriction;',ctx);
const ask=id=>ctx.guard({id});
assert.equal(ask('blackwoodAsylum'),'Patrol duty restricted');
assert.match(ask('licensedGamingHall'),/planned/);
assert.match(ask('capitalSpeedway'),/Not open/);
assert.match(ask('not-registered'),/no registered entrance/);
ctx.titleDevUnlockAllRooms=true;
for(const location of city.listLocations())assert.equal(ask(location.id),'',location.id+' available under developer override');
assert.match(ask('not-registered'),/no registered entrance/,'No fictitious rooms created');
ctx.selected=false;
assert.match(ask('factory'),/Select a player profile/,'No unselected travel');
const access=require('../city-access.js');
assert.equal(access.canRoom(city,{kind:'npc',id:'visitor'},'blackwoodAsylum','patient-ward','1890-01-03').ok,false);
assert.equal(access.canRoom(city,{kind:'player',route:'criminal'},'blackwoodAsylum','superintendent-office','1890-01-03').ok,false);
assert.ok(source.includes('if(!dev&&!titleDevUnlockAllRooms&&window.FE_PATROL?.travel?.(S,location.id)?.ok===false'));
assert.ok(source.includes('if(!dev&&!titleDevUnlockAllRooms&&window.FE_VENUES'));
assert.ok(source.includes('if(room?.restricted&&!dev&&!titleDevUnlockAllRooms'));
assert.ok(source.includes('button.disabled=(!!room.restricted&&!cityRoomSession.dev&&!titleDevUnlockAllRooms&&access?.ok!==true)'),
 'Restricted room buttons remain disabled without authorization or explicit developer override');
assert.ok(source.includes('if(!titleDevUnlockAllRooms)restoreNormalCityRoomAccess();'));
assert.ok(source.includes("payload=Object.assign({},payload,{currentLocation:{locationId:'hillsdale',roomId:'neighborhood-street'}})"));
assert.ok(menu.indexOf('document.body.appendChild(devPanel)')<menu.indexOf('if(legacy){legacy.hidden=true'));
assert.ok(css.includes('body > #titleDevPanel.title-dev-panel')&&css.includes('z-index:4000000'));
assert.ok(source.includes('const frame=document.documentElement'),'Dragged panel anchored to viewport');
assert.ok(read('index.html').includes('id="titleDevUnlockAllRooms"'));
console.log('PASS developer room unlock, '+city.listLocations().length+' locations, floating UI, NPC isolation, autosave safety');
