/* Capital & Consequence: real company-funded 1878 weekly staff and shop costs.
 * Salaries and prices are provisional gameplay estimates, not archived invoices.
 */
(function(root){
 'use strict';
 const ASSISTANT_ID='foremanSullivan',DAILY_WAGE_CENTS=120,WEEKLY_WAGE_CENTS=600;
 const LIGHTS_TOOLS_CENTS=55,WINTER_COAL_CENTS=70,DELIVERY_CENTS=115;
 function settleDay(save){
  if(!save?.componentWorks)return {ok:false,reason:'No founding workshop'};
  const date=save.gameDate;
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Company settlement date required');
  const weekday=new Date(date+'T12:00:00Z').getUTCDay(),cashCents=Math.round(save.companyCash*100);
  if(!Number.isSafeInteger(cashCents)||cashCents<0)throw Error('Invalid company cash');
  const books=save.workshopPayroll||(save.workshopPayroll={version:1,owedCents:0,accruedCents:0,shopOwedCents:0,entries:{}});
  if(!books.entries||!Number.isSafeInteger(books.owedCents)||books.owedCents<0)throw Error('Invalid payroll');
  for(const name of ['accruedCents','shopOwedCents']){
   if(books[name]===undefined)books[name]=0;
   else if(!Number.isSafeInteger(books[name])||books[name]<0)throw Error('Invalid '+name);
  }
  if(books.entries[date])return {...books.entries[date],repeated:true};
  const account=save.npcSimulation?.agents?.[ASSISTANT_ID]?.economy;
  const worked=weekday>=1&&weekday<=5&&Array.isArray(account?.history)&&
   account.history.some(a=>a?.date===date&&a.kind==='work');
  const earnedCents=worked?DAILY_WAGE_CENTS:0;
  books.accruedCents+=earnedCents;
  let paidCents=0,operatingCostsCents=0,paidCostsCents=0;
  if(weekday===6){
   const totalDue=books.owedCents+books.accruedCents;
   paidCents=Math.min(cashCents,totalDue);
   if(paidCents>0&&(!account||!Number.isSafeInteger(account.balanceCents)||
      !Number.isSafeInteger(account.earnedCents)))throw Error('Missing assistant wage account');
   if(paidCents){account.balanceCents+=paidCents;account.earnedCents+=paidCents}
   const month=Number(date.slice(5,7)),winter=month<=3||month>=11;
   const shipped=Object.values(save.componentWorks.receipts||{}).some(v=>v.kind==='shipment'&&v.date===date);
   operatingCostsCents=(books.accruedCents?LIGHTS_TOOLS_CENTS+(winter?WINTER_COAL_CENTS:0):0)+
    (shipped?DELIVERY_CENTS:0);
   const totalCosts=books.shopOwedCents+operatingCostsCents;
   paidCostsCents=Math.min(cashCents-paidCents,totalCosts);
   books.shopOwedCents=totalCosts-paidCostsCents;
   books.owedCents=totalDue-paidCents;books.accruedCents=0;
   const paidTotal=paidCents+paidCostsCents;
   if(paidTotal){
    save.companyCash=(cashCents-paidTotal)/100;save.componentWorks.cashCents=cashCents-paidTotal;
    save.lastExpenses=Math.round((save.lastExpenses||0)*100+paidTotal)/100;
   }
  }
  const receipt={date,assistantId:ASSISTANT_ID,worked,earnedCents,paidCents,
   accruedCents:books.accruedCents,owedCents:books.owedCents,
   operatingCostsCents,paidCostsCents,shopOwedCents:books.shopOwedCents};
  books.entries[date]=receipt;return {...receipt,repeated:false};
 }
 const api=Object.freeze({ASSISTANT_ID,DAILY_WAGE_CENTS,WEEKLY_WAGE_CENTS,
  LIGHTS_TOOLS_CENTS,WINTER_COAL_CENTS,DELIVERY_CENTS,settleDay});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORKSHOP_STAFF=api;
})(typeof window!=='undefined'?window:globalThis);
