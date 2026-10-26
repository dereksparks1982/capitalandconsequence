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
 function transfer(save,action,amount,location,route){
  const spec=OPS[action];if(!spec)return {ok:false,reason:'Unknown cash operation.'};
  if(route!=='industrialist'&&(spec[0]==='companyCash'||spec[0]==='companyCarried'||spec[0]==='businessBank'))
   return {ok:false,reason:'Business funds belong to Federal Electric.'};
  if(spec[2]!==location)return {ok:false,reason:'Go to '+(spec[2]==='factory'?'Federal Electric':'the District Bank')+' to handle that cash.'};
  const n=cents(Number(amount));
  if(!nonnegative(n)||n<1)return {ok:false,reason:'Enter a positive cash amount.'};
  const a=ensure(save),[from,to]=spec;
  const source=from==='personalCash'||from==='companyCash'?save:a;
  const target=to==='personalCash'||to==='companyCash'?save:a;
  const available=cents(+source[from]||0);
  if(available<n)return {ok:false,reason:'Insufficient money at this physical source.'};
  source[from]=money(available-n);
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
  const n=cents(Number(amount));
  if(!nonnegative(n)||n<1)return {ok:false,reason:'Invalid wager amount.'};
  const a=ensure(save),src=funding==='company'?a:save,key=funding==='company'?'companyCarried':'personalCash';
  if(cents(+src[key]||0)<n)return {ok:false,reason:'Not enough '+(funding==='company'?'carried company':'personal')+' cash.'};
  src[key]=money(cents(+src[key]||0)-n);
  if(funding==='company'){
   save.unaccountedFunds=(+save.unaccountedFunds||0)+n/100;
   save.corporateMisuseCount=(+save.corporateMisuseCount||0)+1;
  }
  const entry={id:a.nextId++,date:save.gameDate||null,action:'wager',funding,amount:n/100,location};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,ticket:{funding,stake:n/100,custodyId:entry.id},balances:balances(save)};
 }
 function settle(save,ticket,payout){
  if(!ticket||!['personal','company'].includes(ticket.funding)||!nonnegative(cents(Number(payout)))||
      !Number.isFinite(ticket.stake)||ticket.stake<=0)return {ok:false,reason:'Invalid wager ticket.'};
  const a=ensure(save);
  const id=ticket.custodyId;
  if(!nonnegative(id)||!a.history.some(h=>h.id===id&&h.action==='wager'&&h.funding===ticket.funding))
   return {ok:false,reason:'Wager not found in this profile.'};
  if(a.history.some(h=>h.action==='wager-settlement'&&h.wagerId===id))
   return {ok:false,reason:'Wager already settled.'};
  const n=cents(Number(payout)),dst=ticket.funding==='company'?a:save,key=ticket.funding==='company'?'companyCarried':'personalCash';
  dst[key]=money(cents(+dst[key]||0)+n);
  if(ticket.funding==='company')
   save.unaccountedFunds=Math.max(0,money(cents(+save.unaccountedFunds||0)-Math.min(n,cents(ticket.stake))));
  const entry={id:a.nextId++,date:save.gameDate||null,action:'wager-settlement',wagerId:id,
   funding:ticket.funding,payout:n/100,net:n/100-ticket.stake};
  a.history.push(entry);if(a.history.length>160)a.history.splice(0,a.history.length-160);
  return {ok:true,entry};
 }
 const api=Object.freeze({ensure,balances,transfer,stake,settle});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CASH_CUSTODY=api;
})(typeof window!=='undefined'?window:globalThis);
