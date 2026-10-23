'use strict';
/* Executable integration regression for the REAL app.js 5 PM time gateway.
 * Source VM stubs only unrelated UI, market, and old factory systems.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const engine=require('../component-works.js'),live=require('../component-works-live.js');
const bridge=require('../calendar-bridge.js'),time=require('../washington-time.js');
const staff=require('../workshop-staff.js'),eco=require('../npc-economy.js');
global.FE_WASHINGTON_TIME=time;
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const start=app.indexOf("function advanceWorldSimulation(seconds,away=false,kind='action',deferWorkshopClose=false){");
const end=app.indexOf('function archiveToday(){',start);
assert.ok(start!==-1&&end>start,'The actual single master-clock advance/closing gateway is present');
const gatewaySource=app.slice(start,end);
function setup(minute,withOrder=false){
 const date='1878-01-02',assistant={energy:88};
 eco.actionFor({id:staff.ASSISTANT_ID,traits:{caution:81,sociability:45}},assistant,{
  date,key:date+'|0',slot:0,weekday:3,seed:188,
  defaultLocation:'factory',defaultActivity:'assisting at component works',rest:false
 });
 const S={paused:false,phase:'day',dayRemaining:3600,gameDate:date,companyCash:2500,
  lastRevenue:0,lastExpenses:0,componentTransactionSequence:0,
  componentWorks:engine.createState(),
  npcSimulation:{agents:{[staff.ASSISTANT_ID]:assistant}},notes:[],ledger:[]};
 bridge.start(S,date,minute);
 const closed=[],window={FE_WASHINGTON_TIME:time,FE_NPC_AI:{syncClock(){}}};
 const ctx={S,window,Number,Math,
  businessOpen:()=>S.phase==='day',activeContract:()=>null,
  advanceProduction(){},advanceHiddenMarket(){},
  closeBusinessDay(){
   assert.equal(S.phase,'day','Once-only company closing must begin during day');
   closed.push({cashBeforePayroll:S.companyCash,orders:S.componentWorks.orders.length,
    shipmentRevenue:S.lastRevenue,sequence:S.componentTransactionSequence});
   staff.settleDay(S);
   S.dailyReport={companyClose:S.companyCash,revenue:S.lastRevenue,expenses:S.lastExpenses};
   S.phase='night';
  },
  closeNight(){throw Error('Workshop must not end a night')},
  beginNextDay(){throw Error('Workshop must not fabricate new days')}};
 vm.runInNewContext(gatewaySource,ctx,{filename:'app.js-workshop-clock'});
 if(withOrder){
  const order=engine.order(S.componentWorks,{
   customer:engine.CUSTOMERS[0],productId:'telegraph-key',quantity:2,deadline:'1878-02-10'
  },'seed:order');
  assert.ok(order.ok);
  const made=engine.assemble(S.componentWorks,order.id,2,'seed:assemble');
  assert.equal(made.ok,true);
  return {S,window,closed,order};
 }
 return {S,window,closed};
}
const customer=engine.CUSTOMERS[0];
const args={customer,productId:'telegraph-key',quantity:1,deadline:'1878-02-10'};
{
 const {S,window,closed}=setup(1015);
 const no=JSON.stringify(S);
 assert.equal(live.transact(S,'order',args,'cw:1',(seconds)=>{throw Error('Clock should not run')}).ok,false,
  'Exact 5 PM requires an explicit finalization callback, before any time is spent');
 assert.equal(JSON.stringify(S),no,'Refused action cannot charge time or alter the save');
 const result=live.transact(S,'order',args,'cw:1',
  (seconds,away)=>window.advanceWorkshopTime(seconds,away),()=>{
   S.componentTransactionSequence=1;return window.finishWorkshopClosingBell();
  });
 assert.equal(result.ok,true);
 assert.equal(time.now(S).minuteOfDay,1020,'An action finishing at 5 PM reaches 5 PM');
 assert.equal(S.phase,'night','The closing bell settles after workshop receipt');
 assert.equal(S.componentWorks.orders.length,1);
 assert.equal(closed.length,1,'Exactly one company close');
 assert.equal(closed[0].orders,1,'Closing report sees committed workshop order');
 assert.equal(closed[0].sequence,1,'Closing autosave sees next transaction sequence');
 assert.equal(S.companyCash,2499,'Assistant payroll paid only after workshop action');
 assert.equal(S.dailyReport.expenses,1,'Only assistant wage entered into daily expenses');
 const snapshot=JSON.stringify(S);
 assert.equal(live.transact(S,'order',args,'cw:1',()=>{throw Error('Must not respend')}).repeated,true);
 assert.equal(JSON.stringify(S),snapshot,'Reload-equivalent repeated token cannot pay again');
}
{
 const {S,window,closed,order}=setup(1005,true); // 4:45 PM to 5:00 PM shipment
 const price=engine.PRODUCTS['telegraph-key'].unitPriceCents*2;
 const shipped=live.transact(S,'ship',{orderId:order.id,quantity:2},'cw:2',
  (seconds,away)=>window.advanceWorkshopTime(seconds,away),()=>{
   S.componentTransactionSequence=2;return window.finishWorkshopClosingBell();
  });
 assert.equal(shipped.ok,true);
 assert.equal(shipped.revenueCents,price);
 assert.equal(closed[0].shipmentRevenue,price/100,'Report sees shipment revenue');
 assert.equal(closed[0].cashBeforePayroll,2500+price/100,'Customer paid before assistant');
 assert.equal(S.companyCash,2500+price/100-1);
 assert.equal(S.dailyReport.revenue,price/100);
 assert.equal(S.dailyReport.expenses,1);
 assert.equal(S.phase,'night');
 assert.equal(closed.length,1);
}
{
 const {S,window,closed}=setup(1010); // 4:50 PM, action ends at 4:55 PM
 const accepted=live.transact(S,'order',args,'cw:1',
  (seconds,away)=>window.advanceWorkshopTime(seconds,away),()=>window.finishWorkshopClosingBell());
 assert.equal(accepted.ok,true);
 assert.equal(time.now(S).minuteOfDay,1015);
 assert.equal(S.phase,'day','Non-boundary actions cannot close early');
 assert.equal(closed.length,0);
 assert.equal(window.advanceWorldTime(300),300,'Normal 1:1 ticking reaches the real bell');
 assert.equal(S.phase,'night');
 assert.equal(closed.length,1);
 assert.equal(S.dailyReport.expenses,1);
}
{
 const {S,window,closed}=setup(1016);
 const old=JSON.stringify(S);
 const denied=live.transact(S,'order',args,'cw:1',
  (seconds,away)=>window.advanceWorkshopTime(seconds,away),()=>window.finishWorkshopClosingBell());
 assert.equal(denied.ok,false,'Overtime component actions are rejected before the time charge');
 assert.equal(JSON.stringify(S),old);
 assert.equal(closed.length,0);
}
console.log('PASS actual app 5 PM gateway, exact-time order/shipment cash then payroll, token-safe save, 1:1 idle close and overtime refusal');
