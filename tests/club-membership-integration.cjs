'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const poker=read('poker.js'),app=read('app.js'),venues=read('venue-opportunities.js'),html=read('poker.html'),index=read('index.html');
assert.match(poker,/completedHands:0/);
assert.match(poker,/G\.completedHands\+\+/);
assert.match(poker,/G\.roomKey,delta,G\.completedHands,elapsed,G\.etiquette/);
assert.match(app,/FE_CLUB_MEMBERSHIPS\?\.trial/);
assert.match(app,/hands,conduct:behavior,sessionId/,'Membership trials must receive the actual settled session identifier');
assert.match(app,/recordPokerResult\(circle,delta,hands,false,0,false,\[[^\n]+,token\)/,
 'Popup settlement must forward the authorized poker ticket into club trials');
assert.match(app,/trialResult\?\.hospitality&&!trialResult\.repeated/,
 'Replayed club results cannot double-charge hospitality');
assert.match(app,/state\.settled\.some\(p=>p\.id===token\)/,
 'Real poker custody settlement must block duplicate payouts');
assert.match(app,/clubMemberships:\{version:1,middle:\{\},elite:\{\}\}/);
assert.match(app,/pokerClubStatus\(circle\)\.allowed/);
assert.match(venues,/FE_CLUB_MEMBERSHIPS\?\.access\(S,tier,S\.gameDate,introduced\)/);
assert.match(html,/id="pokerCourtesy"/);
assert.match(index,/club-memberships\.js\?v=/);
assert.ok(index.indexOf('club-memberships.js?v=')<index.indexOf('app.js?v='));
console.log('PASS club trial integrated at real poker window and venue; first completed hand required');
