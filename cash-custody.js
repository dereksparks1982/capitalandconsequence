/* Capital & Consequence: optional physical cash and bank custody.
 * All amounts are game dollars; operations use integer cents internally.
 * companyCash is cash at the Federal Electric works; personalCash is carried.
 * companyCarried remains COMPANY property, never personal, until an explicit
 * owner draw or irregular diversion occurs at a legitimate physical location.
 * The bank is optional; accounts do not teleport or earn invented interest.
 */
(function(root){
 'use strict';
 const KEYS=Object.freeze(['companyCarried','businessBank','personalChecking','personalSavings']);
 const cents=n=>Number.isFinite(n)?Math.round(n*100):NaN;
 const money=n=>Math.round(n)/100;
 const nonnegative=v=>Number.isSafeInteger(v)&&v>=0;
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('Saved profile required');
  let a=save.cashCustody;
  if(!a||a.version!==1){
   a={version:1,companyCarried:0,businessBank:0,personalChecking:0,personalSavings:0,
    history:[],nextId:1};
   save.cashCustody=a;
  }
  for(const k of KEYS)if(!Number.isFinite(a[k])||a[k]<0)a[k]=0;
  if(!Array.isArray(a.history))a.history=[];
  // Open escrow survives the 160-entry bounded activity display history.
  if(!a.openWagers||typeof a.openWagers!=='object')a.openWagers={};
  if(!Array.isArray(a.closedWagers))a.closedWagers=[];
  if(!nonnegative(a.nextId)||!a.nextId)a.nextId=1;
  return a;
 }
 function balances(save){
  const a=ensure(save);
  return Object.freeze({companyAtWorks:+save.companyCash||0,companyCarried:a.companyCarried,
   businessBank:a.businessBank,personalCarried:+save.personalCash||0,
   personalChecking:a.personalChecking,personalSavings:a.personalSavings});
 }
 const OPS=Object.freeze({
  collectCompany:['companyCash','companyCarried','factory'],
  returnCompany:['companyCarried','companyCash','factory'],
  depositBusiness:['companyCarried','businessBank','districtBank'],
  withdrawBusiness:['businessBank','companyCarried','districtBank'],
  depositChecking:['personalCash','personalChecking','districtBank'],
  withdrawChecking:['personalChecking','personalCash','districtBank'],
  depositSavings:['personalCash','personalSavings','districtBank'],
  withdrawSavings:['personalSavings','personalCash','districtBank'],
  checkingToSavings:['personalChecking','personalSavings','districtBank'],
  savingsToChecking:['personalSavings','personalChecking','districtBank'],
  ownerDistribution:['companyCash','personalCash','factory'],
  irregularDraw:['companyCash','personalCash','factory'],
  ownerDistributionCarried:['companyCarried','personalCash','factory'],
  irregularDrawCarried:['companyCarried','personalCash','factory']
 });
 function quote(save,action,amount,location,route){
  const spec=OPS[action];if(!spec)return {ok:false,reason:'Unknown cash operation.'};
  if(!save||typeof save!=='object')return {ok:false,reason:'No active profile.'};
  if(route!=='industrialist'&&(spec[0]==='companyCash'||spec[0]==='companyCarried'||spec[0]==='businessBank'))
   return {ok:false,reason:'Business funds belong to Federal Electric.'};
  if(spec[2]!==location)return {ok:false,reason:'Go to '+(spec[2]==='factory'?'Federal Electric':'the District Bank')+' to handle that cash.'};
  // The saved player room, not the caller's building label, authorizes handling cash.
  const required=location==='factory'?'executive-office':'banking-hall';
  if(save.currentLocation?.locationId!==location||save.currentLocation?.roomId!==required)
   return {ok:false,reason:location==='factory'?'Use the Federal Electric Executive Office.':'Use the District Bank Banking Hall teller.'};
  const raw=Number(amount),n=cents(raw);
  if(!Number.isFinite(raw)||Math.abs(raw*100-n)>0.000001)
   return {ok:false,reason:'Cash amounts must be exact dollars and cents.'};
  if(!nonnegative(n)||n<1)return {ok:false,reason:'Enter a positive cash amount.'};
  const a=ensure(save),[from,to]=spec;
  const source=from==='personalCash'||from==='companyCash'?save:a;
  const available=cents(+source[from]||0);
  if(!nonnegative(available)||available<n)return {ok:false,reason:'Insufficient money at this physical source.'};
  return {ok:true,from,to,cents:n};
 }
 function transfer(save,action,amount,location,route){
  const proposal=quote(save,action,amount,location,route);
  if(!proposal.ok)return proposal;
  const a=ensure(save),{from,to,cents:n}=proposal;
  const source=from==='personalCash'||from==='companyCash'?save:a;
  const target=to==='personalCash'||to==='companyCash'?save:a;
  source[from]=money(cents(+source[from]||0)-n);
  target[to]=money(cents(+target[to]||0)+n);
  const diverted=action==='irregularDraw'||action==='irregularDrawCarried';
  const distribution=action==='ownerDistribution'||action==='ownerDistributionCarried';
  if(distribution)save.ownerDistributionsToday=(+save.ownerDistributionsToday||0)+n/100;
  if(diverted){
   save.divertedToday=(+save.divertedToday||0)+n/100;
   save.unaccountedFunds=(+save.unaccountedFunds||0)+n/100;
   save.corporateMisuseCount=(+save.corporateMisuseCount||0)+1;
  }
  const entry={id:a.nextId++,date:save.gameDate||null,action,amount:n/100,location};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,entry,balances:balances(save)};
 }
 function stake(save,funding,amount,location){
  if(!location||!['races','washingtonArena','privateFightHall','cockfightingDen',
   'workingPoker','commercePoker','embassyPoker'].includes(location))
   return {ok:false,reason:'Go to a real gambling venue to wager.'};
  if(!['personal','company'].includes(funding))return {ok:false,reason:'Select cash to wager.'};
  if(funding==='company'&&save.characterRoute&&save.characterRoute!=='industrialist')
   return {ok:false,reason:'Only the Federal Electric owner controls these company funds.'};
  const raw=Number(amount),n=cents(raw);
  if(!Number.isFinite(raw)||Math.abs(raw*100-n)>0.000001)
   return {ok:false,reason:'Cash amounts must be exact dollars and cents.'};
  if(!nonnegative(n)||n<1)return {ok:false,reason:'Invalid wager amount.'};
  const a=ensure(save),src=funding==='company'?a:save,key=funding==='company'?'companyCarried':'personalCash';
  if(cents(+src[key]||0)<n)return {ok:false,reason:'Not enough '+(funding==='company'?'carried company':'personal')+' cash.'};
  src[key]=money(cents(+src[key]||0)-n);
  if(funding==='company'){
   save.unaccountedFunds=(+save.unaccountedFunds||0)+n/100;
   save.corporateMisuseCount=(+save.corporateMisuseCount||0)+1;
  }
  const entry={id:a.nextId++,date:save.gameDate||null,action:'wager',funding,amount:n/100,location};
  a.openWagers[entry.id]={funding,stake:n/100,location};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,ticket:{funding,stake:n/100,custodyId:entry.id},balances:balances(save)};
 }
 function settle(save,ticket,payout){
  if(!ticket||!['personal','company'].includes(ticket.funding)||!nonnegative(cents(Number(payout)))||
      !Number.isFinite(ticket.stake)||ticket.stake<=0)return {ok:false,reason:'Invalid wager ticket.'};
  const a=ensure(save);
  const id=ticket.custodyId;
  if(!nonnegative(id)||!id)return {ok:false,reason:'Invalid wager reference.'};
  if(a.closedWagers.includes(id))return {ok:false,reason:'Wager already settled.'};
  const opened=a.openWagers[id];
  if(!opened||opened.funding!==ticket.funding||cents(opened.stake)!==cents(ticket.stake))
   return {ok:false,reason:'Wager not found in this profile.'};
  const n=cents(Number(payout)),dst=ticket.funding==='company'?a:save,key=ticket.funding==='company'?'companyCarried':'personalCash';
  dst[key]=money(cents(+dst[key]||0)+n);
  if(ticket.funding==='company')
   save.unaccountedFunds=Math.max(0,money(cents(+save.unaccountedFunds||0)-Math.min(n,cents(ticket.stake))));
  const entry={id:a.nextId++,date:save.gameDate||null,action:'wager-settlement',wagerId:id,
   funding:ticket.funding,payout:n/100,net:n/100-ticket.stake};
  delete a.openWagers[id];
  a.closedWagers.push(id);if(a.closedWagers.length>512)a.closedWagers.splice(0,a.closedWagers.length-512);
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,entry};
 }
 // An undealt/unopened ticket is a void, not a genuine wager outcome.
 // Only callers that verified the game never began should use this.
 function cancel(save,ticket){
  if(!ticket||!['personal','company'].includes(ticket.funding))return {ok:false,reason:'Invalid stake reference.'};
  const a=ensure(save),id=ticket.custodyId,opened=a.openWagers[id];
  if(!nonnegative(id)||!opened||opened.funding!==ticket.funding||cents(opened.stake)!==cents(ticket.stake))
   return {ok:false,reason:'Unsettled reservation not found.'};
  const dst=ticket.funding==='company'?a:save,key=ticket.funding==='company'?'companyCarried':'personalCash';
  dst[key]=money(cents(+dst[key]||0)+cents(opened.stake));
  if(ticket.funding==='company'){
   save.unaccountedFunds=Math.max(0,money(cents(+save.unaccountedFunds||0)-cents(opened.stake)));
   save.corporateMisuseCount=Math.max(0,(+save.corporateMisuseCount||0)-1);
  }
  delete a.openWagers[id];a.closedWagers.push(id);
  if(a.closedWagers.length>512)a.closedWagers.splice(0,a.closedWagers.length-512);
  const entry={id:a.nextId++,date:save.gameDate||null,action:'wager-canceled',
   wagerId:id,funding:ticket.funding,returned:opened.stake};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,entry};
 }
 // A physically travelled cash bag is at risk. The outcome is evaluated
 // ONCE on a real trip, never for an inactive game, save or rendered location.
 const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 function travelRisk(save,trip,forcedRoll=null){
  if(!trip||!trip.from||!trip.to||trip.from===trip.to||!Number.isSafeInteger(trip.minute))
   return {ok:false,reason:'Only a physical journey can risk carried cash.'};
  const a=ensure(save),id=trip.from+'>'+trip.to+'|'+trip.minute;
  if(!Array.isArray(a.travelChecks))a.travelChecks=[];
  if(a.travelChecks.includes(id))return {ok:true,repeated:true,lost:0};
  a.travelChecks.push(id);if(a.travelChecks.length>100)a.travelChecks.splice(0,a.travelChecks.length-100);
  const total=(+save.personalCash||0)+a.companyCarried;
  if(total<100)return {ok:true,lost:0};
  const risk=Math.min(520,Math.round(45+(trip.night?125:0)+Math.max(0,total-100)/15));
  const roll=Number.isSafeInteger(forcedRoll)&&forcedRoll>=0&&forcedRoll<10000?
   forcedRoll:hash(String(save.gameDate)+'|'+id+'|'+String(save.characterRoute||''))%10000;
  if(roll>=risk)return {ok:true,lost:0};
  const loss=Math.min(total,Math.max(2,Math.round(total*(.09+hash(id+'|severity')%24/100)*100)/100));
  const companyLoss=Math.min(a.companyCarried,Math.round(loss*100*(a.companyCarried/total))/100);
  const personalLoss=Math.min(+save.personalCash||0,Math.round((loss-companyLoss)*100)/100);
  a.companyCarried=money(cents(a.companyCarried)-cents(companyLoss));
  save.personalCash=money(cents(+save.personalCash||0)-cents(personalLoss));
  if(companyLoss>0)save.unaccountedFunds=(+save.unaccountedFunds||0)+companyLoss;
  const entry={id:a.nextId++,date:save.gameDate||null,action:'journey-cash-loss',
   location:trip.to,from:trip.from,amount:companyLoss+personalLoss,companyLoss,personalLoss};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,occurred:true,lost:entry.amount,companyLoss,personalLoss,entry};
 }
 const api=Object.freeze({ensure,balances,quote,transfer,stake,settle,cancel,travelRisk});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CASH_CUSTODY=api;
})(typeof window!=='undefined'?window:globalThis);
