'use strict';
/* Source-integration guard for physical breaks and passive character needs.
 * No browser, external packages, GitHub Actions, or live career mutation. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(base,'app.js'),'utf8');
const career=fs.readFileSync(path.join(base,'career-shell.js'),'utf8');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const notice=fs.readFileSync(path.join(base,'character-needs-ui.js'),'utf8');
const source=fs.readFileSync(path.join(base,'character-needs.js'),'utf8');
assert.match(html,/character-needs\.js\?v=/);
assert.match(html,/character-needs-ui\.js\?v=/);
assert.ok(html.indexOf('character-needs.js')<html.indexOf('<script src="app.js'),
 'needs service must load before game state and office logic');
assert.match(app,/characterNeeds:null/,'new profiles include condition state');
assert.match(app,/fresh\.characterNeeds=window\.FE_CHARACTER_NEEDS\?\.sanitize/,
 'loaded careers migrate saved condition and cooldown values');
assert.match(app,/humanCondition=window\.FE_CHARACTER_NEEDS\?\.sync/,
 'every authoritative time jump must update condition');
assert.match(app,/FE_CHARACTER_NEEDS_UI\?\.notify/,
 'crossing the hunger/thirst threshold must notify without offering destinations');
assert.match(app,/STAFF_REFRESHMENT_KINDS/,'all factory refreshments share rules');
const factory=app.slice(app.indexOf('function takeFactoryBreak(key){'),app.indexOf('function titleDevPopulateRooms('));
assert.ok(factory.indexOf('availability?.ok===false')<factory.indexOf('window.advanceWorldTime'),
 'reject cooldown before charging time');
assert.ok(factory.indexOf('window.advanceWorldTime')<factory.indexOf('FE_CHARACTER_NEEDS?.take'),
 'after successful time action, record the break');
assert.match(factory,/S\.personalCash=Math\.round/,'factory treats refreshment charges as personal cash');
const office=career.slice(career.indexOf("panel.querySelector('.career-desk-coffee-actions')"),career.indexOf("panel.querySelector('#careerDeskCoffeePeople')"));
assert.match(career,/data-desk-refreshment="coffee"/);
assert.match(career,/data-desk-refreshment="water"/);
assert.match(career,/data-desk-refreshment="snack"/);
assert.match(career,/data-desk-refreshment="rest"/);
assert.ok(office.indexOf('availability?.(S,choice)')<0||
 office.indexOf('availability?.(S,choice)')<office.indexOf('window.advanceWorldTime'),
 'desk cooldown checked before time is charged');
assert.match(office,/here\.locationId!=='factory'/,'refreshments require physical office presence');
assert.match(office,/FE_CHARACTER_NEEDS\?\.take/,'desk action writes same cooldown state as factory');
assert.match(notice,/aria-live/,'readable non-modal condition notice');
assert.doesNotMatch(notice,/<button|<a\s|location\.href|openTitleMap/,'no hunger notification shortcuts or option menus');
assert.match(source,/SHARED_COOLDOWN=90/);
assert.match(source,/coffee:Object\.freeze\(\{label:'Coffee',cooldown:180/);
assert.match(source,/water:Object\.freeze\(\{label:'Water',cooldown:60/);
assert.match(source,/snack:Object\.freeze\(\{label:'Small Snack',cooldown:180/);
assert.match(source,/rest:Object\.freeze\(\{label:'Rest Break',cooldown:90/);
console.log('PASS needs source wiring, all four breaks, real location rules and no forced destinations');
