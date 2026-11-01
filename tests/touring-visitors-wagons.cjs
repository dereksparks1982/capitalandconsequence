'use strict';
/* Touring wagons use the real street network and saved Washington calendar.
 * Do not reveal people before discovery, and never guess their destinations.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const circus=require('../circus-tour.js');
const street=require('../npc-street-travel.js');
const tours=require('../touring-visitors.js');
const discovery=require('../npc-discovery.js');
global.FE_CIRCUS_TOUR=circus;
global.FE_NPC_STREET_TRAVEL=street;
global.FE_NPC_DISCOVERY=discovery;
global.FE_NPC_MAP_PIN=id=>({star:{x:.2,y:.1},hillsdale:{x:.8,y:.7},races:{x:.6,y:.4}}[id]||null);
global.FederalElectricCity={
 listLocations:()=>[{id:'star',defaultRoom:'club'},{id:'hillsdale',defaultRoom:'street'},{id:'races',defaultRoom:'grounds'}],
 getLocation:id=>({id,defaultRoom:id==='races'?'grounds':'street'})
};
const routes=[];
global.FE_CAPITAL_TRAVEL={
 route:(a,b)=>{const points=[a,{x:(a.x+b.x)/2,y:a.y},b];points.routeType='provisional-street-network';return points},
 weatherEstimate:(points)=>({minutes:{walk:48},guidePixels:180,weather:'clear'}),
 positionAt:(points,f)=>points[Math.min(points.length-1,Math.floor(f*(points.length-1)))]
};
const start=Date.UTC(1878,4,3,9)/60000;
const end=Date.UTC(1878,4,9,20)/60000;
const save={worldCalendarStatus:'ready',worldCalendar:{worldMinute:start-80},
 characterRoute:'industrialist',npcSimulation:{agents:{}},personalCash:12};
assert.equal(tours.PEOPLE.length,2);
assert.equal(tours.sync(save).ok,true);
assert.equal(tours.agent(save,'silasPike').status,'off-duty');
save.worldCalendar.worldMinute=start-20;
assert.equal(tours.sync(save).changed,true);
const inWagon=tours.agent(save,'visiting-fortune-teller');
assert.equal(inWagon.status,'travelling');
assert.equal(inWagon.journey.vehicle,'wagon');
assert.equal(inWagon.journey.to,'races');
assert.equal(inWagon.journey.routeType,'provisional-street-network');
assert.equal(inWagon.journey.arrivesAt-inWagon.journey.departedAt,41,'street distance sets wagon journey time');
assert.equal(street.valid(inWagon.journey),true);
assert.equal(discovery.known(save,'visiting-fortune-teller'),false,'stranger stays unknown');
let marks=Object.values(save.npcSimulation.agents).filter(a=>a.status==='travelling'&&discovery.known(save,a.id));
assert.equal(marks.length,0,'no map marker until introduced');
discovery.learn(save,'visiting-fortune-teller','reported','an acquaintance identified her wagon');
marks=Object.values(save.npcSimulation.agents).filter(a=>a.status==='travelling'&&discovery.known(save,a.id));
assert.equal(marks.length,1);
save.worldCalendar.worldMinute=start;
const arrived=tours.visibleAt(save,'races');
assert.equal(arrived.length,2,'real show site has both visitors');
assert.ok(arrived.every(v=>v.roomId==='grounds'));
assert.equal(tours.agent(save,'visiting-fortune-teller').journey,null,'old route cleared after arrival');
assert.equal(tours.visibleAt(save,'star').length,0,'can only talk where the visitor actually stopped');
save.worldCalendar.worldMinute=end+20;
assert.equal(circus.active(save),null,'public circus gone after departure');
const leaving=tours.agent(save,'silasPike');
assert.equal(leaving.status,'travelling','salesman is genuinely leaving town');
assert.equal(leaving.journey.from,'races');
assert.equal(leaving.journey.vehicle,'wagon');
assert.equal(tours.visibleAt(save,'races').length,0,'no talking to traveler after departure');
save.worldCalendar.worldMinute=end+250;
assert.equal(tours.agent(save,'silasPike').status,'off-duty');
assert.equal(tours.agent(save,'silasPike').journey,null,'past festival route never lingers');
const app=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const map=fs.readFileSync(path.join(__dirname,'../npc-street-travel.js'),'utf8');
assert.match(app,/!def\.touring/,'touring characters not forced into the ordinary shift planner');
assert.match(app,/FE_TOURING_VISITORS\?\.visibleAt/,'visiting characters appear in normal room conversation cards');
assert.match(map,/knownToPlayer\(save,a\.id\)/,'only discovered travelers get map markers');
assert.doesNotMatch(map,/Show destination|traveling toward/,'known travel destination remains private');
assert.ok(html.indexOf('touring-visitors.js?v=')<html.indexOf('npc-ai.js?v='));
console.log('PASS touring wagons, real road pace, known-person privacy, arrival dialogue access and public circus departure');
