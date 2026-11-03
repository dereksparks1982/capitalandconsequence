'use strict';
// Whitcomb's authored 1878 prelude: unique choices, real family confidence,
// exact opening ledger/clock preservation, save-resume and old-profile safety.
const assert=require('node:assert/strict');
const family=require('../whitcomb-family.js');
const intro=require('../whitcomb-intro.js');
const corporate=require('../corporate-governance.js');
const fs=require('node:fs');
const path=require('node:path');
const source=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const base=()=>({characterRoute:'industrialist',gameDate:'1878-01-02',
 paused:false,phase:'day',companyCash:2500,personalCash:800,
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 worldCalendarStatus:'ready',worldCalendar:{worldMinute:-48399990},
 componentWorks:{cashCents:250000,warehouse:{'telegraph-key':4}},
 stocks:{FEC:{shares:0}}});
const s=base();
assert.equal(family.ensure(s).principalCents,750000);
assert.equal(corporate.ownership(s).family,2500);
const money=s.companyCash,clock=s.worldCalendar.worldMinute,warehouse=JSON.stringify(s.componentWorks.warehouse);
const first=intro.begin(s);
assert(first.ok);
assert.equal(intro.begin(s).ok,false);
assert.equal(intro.current(s).id,'alexandria');
assert.equal(intro.choose(s,'start-works').ok,false,'no skipping to arrival');
assert.equal(intro.choose(s,'clear-accounts').ok,true);
assert.equal(family.report(s).confidence,56);
assert.equal(intro.current(s).id,'departure');
assert.equal(intro.choose(s,'clear-accounts').ok,false,'old choice cannot repeat');
assert.equal(s.whitcombIntro.history.length,1);
const same=JSON.parse(JSON.stringify(s));
assert.equal(intro.current(same).id,'departure','reload resumes saved scene');
assert.equal(intro.choose(same,'mother-letter').ok,true);
assert.equal(family.report(same).confidence,57);
assert.equal(intro.current(same).id,'cabin');
assert.equal(intro.choose(same,'reserve').ok,true);
assert.equal(family.report(same).confidence,61);
assert.equal(intro.current(same).id,'washington');
assert.equal(intro.choose(same,'start-books').ok,true);
assert.equal(family.report(same).confidence,65);
assert.equal(intro.current(same),null);
assert.equal(intro.ensure(same).finished,true);
assert.equal(intro.ensure(same).stage,4);
assert.equal(intro.choose(same,'start-books').ok,false,'a saved scene never pays twice');
assert.equal(same.whitcombIntro.history.length,4);
assert.equal(same.whitcombFamily.introDecisions.length,4);
assert.equal(same.whitcombFamily.introTokens['intro:alexandria:clear-accounts'],true);
assert.equal(same.gameDate,'1878-01-02');
assert.equal(same.worldCalendar.worldMinute,clock,'the intro cannot progress the game clock');
assert.equal(same.companyCash,money);
assert.equal(same.componentWorks.cashCents,250000);
assert.equal(same.personalCash,800);
assert.equal(JSON.stringify(same.componentWorks.warehouse),warehouse);
assert.equal(corporate.ownership(same).family,2500);
assert.equal(corporate.ownership(same).founder,7500);
const old=base();assert.equal(intro.ensure(old).finished,true,'existing saves never auto-restart');
assert.equal(intro.begin(old).ok,false);
const officer={characterRoute:'patrolman',gameDate:'1878-01-02'};
assert.equal(intro.begin(officer).ok,false);
assert.equal(intro.ensure(officer),null);
assert.equal(officer.whitcombIntro,undefined);
const alternate=base();family.ensure(alternate);intro.begin(alternate);
assert(intro.choose(alternate,'independence').ok);
assert.equal(family.report(alternate).confidence,48);
assert.notEqual(family.report(alternate).confidence,family.report(s).confidence);
alternate.paused=true;
assert.equal(intro.choose(alternate,'quiet').ok,false);
assert.equal(intro.current(alternate).id,'departure');
const rootScript=source('app.js');
assert(rootScript.includes('window.FE_WHITCOMB_INTRO?.begin?.(S)'));
assert(rootScript.includes('refreshWhitcombIntro()'));
assert(rootScript.includes("S.whitcombIntro?.started&&!S.whitcombIntro?.finished"));
const html=source('index.html');
assert(html.indexOf('whitcomb-family.js')<html.indexOf('whitcomb-intro.js'));
assert(html.indexOf('whitcomb-intro.js')<html.indexOf('whitcomb-intro-ui.js'));
assert(html.indexOf('whitcomb-intro-ui.js')<html.indexOf('app.js'));
assert(html.includes('whitcomb-intro.css'));
console.log('Whitcomb intro: four saved scenes, 12 choices, father trust, no free funds or clock, old-save and career guards passed');
