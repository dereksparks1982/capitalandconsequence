'use strict';
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const economy=require('../npc-economy.js');
const staff=require('../workshop-staff.js');

const definition={id:staff.ASSISTANT_ID,traits:{caution:81,sociability:45}};
const assistant={energy:88};
const day='1878-01-02';
const morning={date:day,key:day+'|0',slot:0,weekday:3,seed:188,
 defaultLocation:'factory',defaultActivity:'preparing component tools',rest:false};
const action=economy.actionFor(definition,assistant,morning);
assert.equal(action.action.kind,'work','Assistant reports physical factory service');
assert.equal(assistant.economy.earnedCents,0,'NPC economy must not mint Federal Electric wages');
assert.equal(assistant.economy.balanceCents,2100,'Assistant is not paid by simply entering a shift');
const save={gameDate:day,companyCash:2500,lastExpenses:0,
 componentWorks:works.createState(),npcSimulation:{agents:{[staff.ASSISTANT_ID]:assistant}}};
assert.equal(staff.DAILY_WAGE_CENTS,100,'Provisional daily wage is one dollar');
const first=staff.settleDay(save);
assert.equal(first.worked,true);
assert.equal(first.paidCents,100);
assert.equal(save.companyCash,2499,'Company funds pay assistant');
assert.equal(save.componentWorks.cashCents,249900,'Component ledger balance reconciles');
assert.equal(save.lastExpenses,1,'Only one posted wage expense');
assert.equal(assistant.economy.earnedCents,100,'Assistant receives only company-funded pay');
assert.equal(assistant.economy.balanceCents,2200,'Personal wallet records actual pay');
const snapshot=JSON.stringify(save);
assert.equal(staff.settleDay(save).repeated,true,'Workday payroll settles once');
assert.equal(JSON.stringify(save),snapshot,'Repeat does not fabricate money');
assert.equal(staff.settleDay(JSON.parse(snapshot)).repeated,true,'Autosave maintains payment idempotence');

save.gameDate='1878-01-03';
const noWork=staff.settleDay(save);
assert.equal(noWork.worked,false,'An unworked shift is not paid');
assert.equal(noWork.paidCents,0);
assert.equal(save.companyCash,2499);

save.gameDate='1878-01-04';
economy.actionFor(definition,assistant,{...morning,date:save.gameDate,key:save.gameDate+'|0'});
save.companyCash=.35;
const unfunded=staff.settleDay(save);
assert.equal(unfunded.earnedCents,100);
assert.equal(unfunded.paidCents,35);
assert.equal(unfunded.owedCents,65,'Unpaid wages become an explicit debt');
assert.equal(save.companyCash,0,'Payroll cannot overdraw company');
assert.equal(save.componentWorks.cashCents,0);
assert.equal(save.lastExpenses,1.35,'Only actually paid wages count as cash expenses');
assert.equal(assistant.economy.earnedCents,135,'The assistant receives only transferred cash');
save.gameDate='1878-01-05';
save.companyCash=2;
const catchup=staff.settleDay(save);
assert.equal(catchup.worked,false);
assert.equal(catchup.paidCents,65,'New company cash can clear prior unpaid wages');
assert.equal(catchup.owedCents,0);
assert.equal(save.companyCash,1.35);
assert.equal(assistant.economy.earnedCents,200);
assert.equal(staff.settleDay(save).repeated,true);
assert.equal(staff.settleDay({componentWorks:null}).ok,false);
console.log('PASS founding owner plus one assistant, paid NPC wages, zero double charge, wage arrears and reload idempotence');
