/* Capital & Consequence v0.6.74: one paid founding-era workshop assistant.
 * Charlie Whitcomb works as the owner, never on employee payroll.
 * Salaries transfer real company funds to the assistant's NPC account.
 * Amount is a provisional game-balancing value, not a researched 1878 wage.
 */
(function(root){
 'use strict';
 const ASSISTANT_ID='foremanSullivan'; // Existing NPC identity, now a workshop assistant.
 const DAILY_WAGE_CENTS=100;
 function settleDay(save){
  if(!save?.componentWorks) return {ok:false,reason:'No founding workshop'};
  const date=save.gameDate;
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Company settlement date required');
  const cashCents=Math.round(save.companyCash*100);
  if(!Number.isSafeInteger(cashCents)||cashCents<0)throw Error('Invalid company cash');
  const books=save.workshopPayroll||(save.workshopPayroll={version:1,owedCents:0,entries:{}});
  if(!books.entries||!Number.isSafeInteger(books.owedCents)||books.owedCents<0)throw Error('Invalid workshop payroll');
  if(books.entries[date])return {...books.entries[date],repeated:true};
  const account=save.npcSimulation?.agents?.[ASSISTANT_ID]?.economy;
  const worked=Array.isArray(account?.history)&&account.history.some(a=>a?.date===date&&a.kind==='work');
  const earnedCents=worked?DAILY_WAGE_CENTS:0;
  const totalDue=books.owedCents+earnedCents;
  if(!Number.isSafeInteger(totalDue))throw Error('Invalid wage liability');
  const paidCents=Math.min(totalDue,cashCents);
  if(paidCents>0&&(!account||!Number.isSafeInteger(account.balanceCents)||!Number.isSafeInteger(account.earnedCents)))
   throw Error('Missing assistant wage account');
  const endCashCents=cashCents-paidCents;
  if(paidCents>0){
   account.balanceCents+=paidCents;
   account.earnedCents+=paidCents;
   save.companyCash=endCashCents/100;
   save.componentWorks.cashCents=endCashCents;
   save.lastExpenses=Math.round(((save.lastExpenses||0)*100)+paidCents)/100;
  }
  books.owedCents=totalDue-paidCents;
  const receipt={date,assistantId:ASSISTANT_ID,worked,earnedCents,paidCents,owedCents:books.owedCents};
  books.entries[date]=receipt;
  return {...receipt,repeated:false};
 }
 const api=Object.freeze({ASSISTANT_ID,DAILY_WAGE_CENTS,settleDay});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORKSHOP_STAFF=api;
})(typeof window!=='undefined'?window:globalThis);
