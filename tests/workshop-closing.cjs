'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const engine=require('../component-works.js'),live=require('../component-works-live.js');
const bridge=require('../calendar-bridge.js'),time=require('../washington-time.js');
const staff=require('../workshop-staff.js'),eco=require('../npc-economy.js');
global.FE_WASHINGTON_TIME=time;
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const start=app.indexOf("function advanceWorldSimulation(seconds,away=false,kind='action',deferWorkshopClose=false){");
const end=app.indexOf('function archiveToday(){',start);
assert.ok(start!==-1&&end>start);
const gatewaySource=app.slice(start,end);
function setup(iso,minute,withOrder=false){
 const assistant={energy:88,locationId:'factory',status:'present'};
 eco.actionFor({id:staff.ASSISTANT_ID,traits:{caution:81,sociability:45}},assistant,{
  date:iso,key:iso+'|0',slot:0,weekday:new Date(iso+'T12:00:00Z').getUTCDay(),
  seed:188,defaultLocation:'factory',defaultActivity:'work',rest:false});
 const S={paused:false,phase:'day',gameDate:iso,companyCash:2500,
  lastRevenue:0,lastExpenses:0,componentTransactionSequence:0,
  componentWorks:engine.createState(iso),npcSimulation:{agents:{[staff.ASSISTANT_ID]:assistant}},notes:[],ledger:[]};
 bridge.start(S,iso,minute);
 const closed=[],window={FE_WASHINGTON_TIME:time,FE_NPC_AI:{syncClock(){}}};
 vm.runInNewContext(gatewaySource,{S,window,Number,Math,businessOpen:()=>S.phase==='day',
  activeContract:()=>null,advanceProduction(){},advanceHiddenMarket(){},
  closeBusinessDay(){
   closed.push({before:S.companyCash,orders:S.componentWorks.orders.length,revenue:S.lastRevenue,
    sequence:S.componentTransactionSequence});
   staff.settleDay(S);S.phase='night';
  },
  closeNight(){throw Error('Workshop must not end night')},
  beginNextDay(){throw Error('Workshop cannot fabricate morning')}},{filename:'app.js-workshop-clock'});
 if(withOrder){
  const seeded=engine.order(S.componentWorks,{customer:engine.CUSTOMERS[0],
   productId:'telegraph-key',quantity:1,deadline:'1878-01-12'},'seed:order');
  assert.ok(seeded.ok);assert.equal(engine.assemble(S.componentWorks,seeded.id,1,'seed:make').ok,true);
  return {S,window,closed,order:seeded};
 }
 return {S,window,closed};
}
{
 const {S,window,closed}=setup('1878-01-11',1015);
 const args={customer:engine.CUSTOMERS[0],productId:'telegraph-key',quantity:1,deadline:'1878-01-12'};
 assert.equal(live.transact(S,'order',args,'cw:1',()=>{throw Error('No spending')}).ok,false);
 const result=live.transact(S,'order',args,'cw:1',
  (sec,away)=>window.advanceWorkshopTime(sec,away),()=>{
   S.componentTransactionSequence=1;return window.finishWorkshopClosingBell();
  });
 assert.equal(result.ok,true);assert.equal(time.now(S).minuteOfDay,1020);
 assert.equal(closed.length,1);assert.equal(closed[0].orders,1);assert.equal(closed[0].sequence,1);
 assert.equal(S.companyCash,2500,'Friday cannot pay wages early');
 assert.equal(S.workshopPayroll.accruedCents,120,'Friday attendance accrues salary');
 const snap=JSON.stringify(S);
 assert.equal(live.transact(S,'order',args,'cw:1',()=>{throw Error('No respend')}).repeated,true);
 assert.equal(JSON.stringify(S),snap);
}
{
 const {S,window,closed,order}=setup('1878-01-12',1005,true);
 S.workshopPayroll={version:1,accruedCents:600,owedCents:0,shopOwedCents:0,entries:{}};
 const revenue=engine.PRODUCTS['telegraph-key'].unitPriceCents;
 const shipped=live.transact(S,'ship',{orderId:order.id,quantity:1},'cw:2',
  (sec,away)=>window.advanceWorkshopTime(sec,away),()=>{
   S.componentTransactionSequence=2;return window.finishWorkshopClosingBell();
  });
 assert.equal(shipped.ok,true);assert.equal(closed.length,1);
 assert.equal(closed[0].before,2500+revenue/100,'Revenue comes in before payroll');
 assert.equal(closed[0].revenue,revenue/100);
 assert.equal(S.workshopPayroll.accruedCents,0);
 assert.equal(S.companyCash,2500+revenue/100-6-2.4);
 assert.equal(S.phase,'night');
}
{
 const {S,window,closed}=setup('1878-01-11',1010);
 const args={customer:engine.CUSTOMERS[0],productId:'telegraph-key',quantity:1,deadline:'1878-01-12'};
 assert.equal(live.transact(S,'order',args,'cw:1',
  (sec,away)=>window.advanceWorkshopTime(sec,away),()=>window.finishWorkshopClosingBell()).ok,true);
 assert.equal(window.advanceWorldTime(300),300);
 assert.equal(closed.length,1);assert.equal(S.phase,'night');
}
console.log('PASS actual clock gateway Friday accrual and Saturday shipment-before-payroll, exact 5 PM and no replay');
