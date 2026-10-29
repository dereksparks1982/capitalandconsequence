'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const duel=fs.readFileSync(path.join(__dirname,'../duel-ui.js'),'utf8');
const engine=fs.readFileSync(path.join(__dirname,'../duel-engine.js'),'utf8');
assert.match(html,/id="cityRoomDuel" hidden/,'Challenge must not display in unrelated rooms');
assert.match(html,/duel\.css\?v=/,'Duel display must load CSS');
assert.ok(html.indexOf('duel-engine.js')<html.indexOf('duel-ui.js'));
assert.ok(html.indexOf('duel-ui.js')<html.indexOf('app.js?v='),
 'Duel services must be available before app boot');
assert.match(app,/window\.FE_DUEL_UI\?\.bind\?\.\(/);
assert.match(app,/window\.FE_DUEL_UI\?\.refresh\?\.\(\)/);
assert.match(app,/FE_WASHINGTON_TIME\.advance\(S,seconds,'action','duel:'\+challenge\.id\)/,
 'Formal duels use one saved time transaction, not free teleport or local timer');
assert.match(app,/window\.FE_DUELS\.settle\(S,challenge\.id,outcome/);
assert.match(app,/window\.FE_SKILLS\?\.practice\?\.\(S,'marksmanship'/);
assert.match(app,/S\.notes\.push\(\{date:S\.gameDate,source:'formal duel'/);
assert.match(duel,/id='capitalDuelOverlay'/);
assert.match(duel,/id="capitalDuelSignal"/);
assert.match(duel,/id="capitalDuelAim"/);
assert.match(duel,/setCountdown\(3\)/);
assert.match(duel,/session\.phase='shoot'/);
assert.match(engine,/ROUNDS_LIMIT=3/);
assert.match(engine,/date:typeof gameDate/);
console.log('PASS loaded duel UI, hidden room gating, saved time transaction, skill practice and game journal wiring');
