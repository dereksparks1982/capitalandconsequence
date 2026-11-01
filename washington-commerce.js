/* Capital & Consequence v0.6.88: shared Washington physical market.
 * NPC and player purchases remove the same physical stock and transfer cents
 * to merchant tills. Supplier deliveries are recorded; no infinite restock.
 * Keep Sullivan's six-day wage / 25c rent / weekly grocery constraint.
 */
(function(root){
'use strict';
const RENT_CENTS=25;
const STARTING_GOODS=Object.freeze([
 {id:'bread',label:'Bread loaf',units:1,cents:5,vendor:'bakery'},
 {id:'milk',label:'Quart milk bottles',units:2,cents:16,vendor:'dairy'},
 {id:'eggs',label:'Eggs',units:12,cents:24,vendor:'provisions'},
 {id:'bacon',label:'Bacon',units:1,cents:25,vendor:'butcher'},
 {id:'stew-beef',label:'Beef for stew',units:1,cents:45,vendor:'butcher'},
 {id:'potatoes',label:'Potatoes',units:1,cents:15,vendor:'provisions'},
 {id:'onions',label:'Onions',units:1,cents:4,vendor:'provisions'},
 {id:'beans-grains',label:'Beans, oats and flour',units:1,cents:45,vendor:'provisions'},
 {id:'produce',label:'Seasonal produce',units:1,cents:25,vendor:'provisions'},
 {id:'tea-sugar',label:'Tea, coffee and sweetener allowance',units:1,cents:20,vendor:'grocer'},
 {id:'seasoning',label:'Salt, pepper and other seasonings',units:1,cents:15,vendor:'grocer'},
 {id:'lamp-fuel',label:'Home heating and lamp fuel',units:1,cents:30,vendor:'fuel'},
 {id:'soap',label:'Soap',units:1,cents:10,vendor:'grocer'}
]);
// Extend the SAME merchant stock and bag ledger with catalog groceries.
const EXTRA_GOODS=(root.FE_FOOD_CATALOG?.GOODS||[])
 .filter(g=>!STARTING_GOODS.some(old=>old.id===g.id))
 .map(g=>({id:g.id,label:g.label,cents:g.cents,units:g.units,vendor:g.vendor,
  section:g.section,storage:g.storage,shelfDays:g.shelfDays,markets:g.markets}));
const GOODS=Object.freeze([...STARTING_GOODS,...EXTRA_GOODS]);
const BY_GOOD=Object.fromEntries(GOODS.map(g=>[g.id,g]));
const SITES=Object.freeze({
 'hillsdale-market':new Set(['bread','milk','eggs','potatoes','onions','beans-grains','produce','tea-sugar','seasoning','lamp-fuel','soap']),
 'hillsdale-butcher':new Set(GOODS.filter(g=>g.vendor==='butcher').map(g=>g.id)),
 'easternMarket':new Set(GOODS.filter(g=>g.markets!=='chinatown').map(g=>g.id)),
 'georgetownMarketHouse':new Set(GOODS.filter(g=>g.markets!=='chinatown').map(g=>g.id)),
 'centerMarket':new Set(GOODS.map(g=>g.id)),
 'oldChinatown':new Set(GOODS.filter(g=>g.markets==='chinatown'||g.vendor==='provisions'||g.vendor==='grocer'||g.vendor==='fishmonger').map(g=>g.id))
});
function allowedAt(id,site){
 if(!BY_GOOD[id])return false;
 if(!site)return true;
 if(site==='hillsdale-market')return !['butcher','fishmonger'].includes(BY_GOOD[id].vendor)&&BY_GOOD[id].markets!=='chinatown';
 return !!SITES[site]?.has(id);
}
const weekday=date=>new Date(date+'T12:00:00Z').getUTCDay();
const whole=v=>Number.isSafeInteger(v)&&v>=0;
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Saved world required for Washington market');
 let m=save.washingtonCommerce;
 if(!m||typeof m!=='object'){
  m={version:2,accounts:{},purchases:[],settlements:{},stock:{},deliveries:{},supplierDebts:{},suppliersPaidCents:0,playerBag:[],nextPurchase:0};
  save.washingtonCommerce=m;
 }
 if(!m.accounts||typeof m.accounts!=='object')m.accounts={};
 if(!Array.isArray(m.purchases))m.purchases=[];
 if(!m.settlements||typeof m.settlements!=='object')m.settlements={};
 if(!m.stock||typeof m.stock!=='object')m.stock={};
 if(!m.deliveries||typeof m.deliveries!=='object')m.deliveries={};
 if(!m.supplierDebts||typeof m.supplierDebts!=='object')m.supplierDebts={};
 if(!Array.isArray(m.playerBag))m.playerBag=[];
 if(!m.siteStocks||typeof m.siteStocks!=='object')m.siteStocks={};
 for(const [site,goods] of Object.entries(SITES)){
  if(site==='hillsdale-market')for(const g of GOODS)if(allowedAt(g.id,site))goods.add(g.id);
  if(!m.siteStocks[site]||typeof m.siteStocks[site]!=='object')m.siteStocks[site]={};
  for(const id of goods)if(!whole(m.siteStocks[site][id]))m.siteStocks[site][id]=12;
 }
 if(!whole(m.suppliersPaidCents))m.suppliersPaidCents=0;
 if(!whole(m.nextPurchase))m.nextPurchase=m.purchases.length;
 // Initial stocks are starting physical inventories, not an automatic purchase-time refill.
 for(const g of GOODS)if(!whole(m.stock[g.id]))m.stock[g.id]=g.id==='bread'?24:g.vendor==='butcher'?8:12;
 m.version=2;
 return m;
}
function purchase(save,buyer,goodId,opts={}){
 const good=BY_GOOD[goodId];
 if(!good)return {ok:false,reason:'Unknown merchandise'};
 if(buyer!=='player'&&(typeof buyer!=='string'||!buyer))return {ok:false,reason:'Unknown customer'};
 const m=ensure(save),date=typeof opts.date==='string'?opts.date:save.gameDate;
 const site=opts.siteId||null;
 if(site&&!allowedAt(goodId,site))return {ok:false,reason:'Goods not sold at this stall'};
 const stock=site?m.siteStocks[site]:m.stock;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return {ok:false,reason:'Invalid saved calendar date'};
 if(typeof opts.token==='string'&&m.purchases.some(r=>r.token===opts.token))
  return {ok:false,repeated:true,reason:'Transaction already recorded'};
 if(stock[good.id]<1)return {ok:false,reason:'Sold out: '+good.label,stockRemaining:0};
 if(buyer==='player'&&m.playerBag.length>=24)return {ok:false,reason:'Your market bag is full'};
 const wallet=buyer==='player'?null:save.npcSimulation?.agents?.[buyer]?.economy;
 const cashCents=buyer==='player'?Math.round(Number(save.personalCash)*100):wallet?.balanceCents;
 if(!whole(cashCents))return {ok:false,reason:'Customer account unavailable'};
 if(cashCents<good.cents)return {ok:false,reason:'Not enough personal money'};
 // A single, atomic physical sale: decrease buyer balance and stock, credit the merchant.
 if(buyer==='player')save.personalCash=(cashCents-good.cents)/100;
 else wallet.balanceCents=cashCents-good.cents;
 stock[good.id]--;
 const merchant=site?site+':'+good.vendor:good.vendor;
 m.accounts[merchant]=(m.accounts[merchant]||0)+good.cents;
 const receipt={id:++m.nextPurchase,date,buyer,good:good.id,label:good.label,
  units:good.units,cents:good.cents,vendor:good.vendor,
  ...(site?{siteId:site}:{}),
  ...(opts.token?{token:String(opts.token).slice(0,120)}:{})};
 m.purchases.push(receipt);
 if(m.purchases.length>1300)m.purchases.splice(0,m.purchases.length-1300);
 if(buyer==='player'){
  const t=save.worldCalendar?.worldMinute,p=root.FE_FOOD_CATALOG?.find?.(good.id);
  m.playerBag.push({id:'purchase-'+receipt.id,good:good.id,label:good.label,units:good.units,date,
    boughtAt:Number.isSafeInteger(t)?t:null,
    expiresAt:Number.isSafeInteger(t)&&Number.isFinite(p?.shelfDays)?t+p.shelfDays*1440:null});
 }
 return {ok:true,receipt,stockRemaining:stock[good.id]};
}
/* Single all-or-nothing shopping-basket settlement. No phantom packages. */
function quoteBasket(save,siteId,lines){
 if(siteId!==''&&(!siteId||!Object.hasOwn(SITES,siteId)))return {ok:false,reason:'Unknown market.'};
 if(!Array.isArray(lines)||!lines.length||lines.length>24)
  return {ok:false,reason:'Choose one to 24 distinct groceries.'};
 const m=ensure(save),stock=siteId?m.siteStocks[siteId]:m.stock;
 let packages=0,totalCents=0;const unique=new Set();
 for(const x of lines){
  const g=BY_GOOD[x?.id],n=x?.packages;
  if(!g||unique.has(x.id)||!Number.isSafeInteger(n)||n<1||n>24||!allowedAt(x.id,siteId))
   return {ok:false,reason:'Invalid basket or goods unavailable at this stall.'};
  unique.add(x.id);packages+=n;totalCents+=g.cents*n;
  if(stock[g.id]<n)return {ok:false,reason:'Not enough '+g.label+' in stock.'};
 }
 if(packages>24||m.playerBag.length+packages>24)return {ok:false,reason:'The 24-package shopping bag is full.'};
 if(!Number.isSafeInteger(totalCents)||totalCents>Math.round(Number(save.personalCash||0)*100))
  return {ok:false,reason:'Not enough personal cash for this basket.'};
 return {ok:true,packages,totalCents,lines:lines.map(x=>({id:x.id,packages:x.packages}))};
}
function purchaseBasket(save,siteId,lines,opts={}){
 const q=quoteBasket(save,siteId,lines),date=opts.date||save.gameDate;
 if(!q.ok)return q;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return {ok:false,reason:'Invalid date.'};
 const m=ensure(save),stock=siteId?m.siteStocks[siteId]:m.stock,receipts=[];
 save.personalCash=(Math.round(Number(save.personalCash||0)*100)-q.totalCents)/100;
 for(const line of q.lines){
  const good=BY_GOOD[line.id],account=siteId?siteId+':'+good.vendor:good.vendor;
  stock[good.id]-=line.packages;m.accounts[account]=(m.accounts[account]||0)+good.cents*line.packages;
  for(let i=0;i<line.packages;i++){
   const receipt={id:++m.nextPurchase,date,buyer:'player',good:good.id,
    label:good.label,units:good.units,cents:good.cents,vendor:good.vendor,batch:true,
    ...(siteId?{siteId}:{})};
   receipts.push(receipt);m.purchases.push(receipt);
   const t=save.worldCalendar?.worldMinute,p=root.FE_FOOD_CATALOG?.find?.(good.id);
   m.playerBag.push({id:'purchase-'+receipt.id,good:good.id,label:good.label,
    units:good.units,date,boughtAt:Number.isSafeInteger(t)?t:null,
    expiresAt:Number.isSafeInteger(t)&&Number.isFinite(p?.shelfDays)?t+p.shelfDays*1440:null});
  }
 }
 if(m.purchases.length>1300)m.purchases.splice(0,m.purchases.length-1300);
 return {ok:true,receipts,packages:q.packages,totalCents:q.totalCents};
}
function consume(save,id){
 const m=ensure(save),index=m.playerBag.findIndex(x=>x.id===id);
 if(index<0)return {ok:false,reason:'Goods not carried'};
 const [good]=m.playerBag.splice(index,1);
 return {ok:true,good};
}
function deliveryForCalendar(save,date,slot){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||slot!==0)return {ok:false,reason:'Delivery not due in this observed morning slot'};
 if(![1,4].includes(weekday(date)))return {ok:false,reason:'No scheduled wholesale delivery today'};
 const m=ensure(save);
 if(m.deliveries[date])return {ok:true,repeated:true,delivery:m.deliveries[date]};
 const manifest=[];
 for(const g of STARTING_GOODS){
  const qty=g.id==='bread'?10:6,previousDebt=m.supplierDebts[g.vendor]||0;
  const wholesaleCents=Math.round(g.cents*qty*.6);
  // Deliveries may be on supplier credit, explicitly owed, not generated money.
  const available=m.accounts[g.vendor]||0,pay=Math.min(available,previousDebt+wholesaleCents);
  m.accounts[g.vendor]=available-pay;
  m.supplierDebts[g.vendor]=previousDebt+wholesaleCents-pay;
  m.suppliersPaidCents+=pay;
  m.stock[g.id]+=qty;
  manifest.push({good:g.id,vendor:g.vendor,qty,wholesaleCents,paidCents:pay});
 }
 // Hillsdale shop stock is independent from Chinatown.
 for(const [site,ids] of Object.entries(SITES))for(const id of ids){
  const good=BY_GOOD[id],qty=4,account=site+':'+good.vendor;
  const wholesale=Math.round(good.cents*qty*.6);
  const previous=m.supplierDebts[account]||0,available=m.accounts[account]||0;
  const paid=Math.min(available,previous+wholesale);
  m.accounts[account]=available-paid;
  m.supplierDebts[account]=previous+wholesale-paid;
  m.suppliersPaidCents+=paid;
  m.siteStocks[site][id]+=qty;
  manifest.push({site,good:id,vendor:good.vendor,qty,wholesaleCents:wholesale,paidCents:paid});
 }
 const delivery={date,manifest,units:manifest.reduce((t,x)=>t+x.qty,0)};
 m.deliveries[date]=delivery;
 // Bounded delivery history but keep idempotence for recorded dates.
 return {ok:true,repeated:false,delivery};
}
function settleSaturday(save){
 if(!save?.componentWorks||typeof save.gameDate!=='string'||weekday(save.gameDate)!==6)
  return {ok:false,reason:'Household market settles Saturday only'};
 const date=save.gameDate,m=ensure(save);
 if(m.settlements[date])return {...m.settlements[date],repeated:true};
 const wallet=save.npcSimulation?.agents?.foremanSullivan?.economy;
 if(!wallet||!whole(wallet.balanceCents))return {ok:false,reason:'Sullivan has no valid market wallet'};
 const rentCents=Math.min(RENT_CENTS,wallet.balanceCents);
 wallet.balanceCents-=rentCents;
 // Room belongs to Federal Electric: rent goes to company, never to Charlie personally.
 const companyCents=Math.round(save.companyCash*100)+rentCents;
 if(!Number.isSafeInteger(companyCents))throw Error('Unrepresentable rental receipt');
 save.companyCash=companyCents/100;save.componentWorks.cashCents=companyCents;
 save.lastRevenue=Math.round((save.lastRevenue||0)*100+rentCents)/100;
 let groceriesCents=0;
 for(const good of STARTING_GOODS){
  const result=purchase(save,'foremanSullivan',good.id,{date,token:'weekly|'+date+'|'+good.id});
  if(result.ok)groceriesCents+=result.receipt.cents;
 }
 // Shoes/clothes are repaired occasionally. These services have no physical stock.
 const week=Math.floor(Date.parse(date+'T12:00:00Z')/604800000);
 function service(id,label,cents,vendor){
  if(wallet.balanceCents<cents)return;
  wallet.balanceCents-=cents;groceriesCents+=cents;
  m.accounts[vendor]=(m.accounts[vendor]||0)+cents;
  m.purchases.push({id:++m.nextPurchase,date,buyer:'foremanSullivan',good:id,label,units:1,cents,vendor,token:'weekly|'+date+'|'+id});
 }
 if(week%10===0)service('cobbler','Occasional boot repair',45,'cobbler');
 if(week%16===0)service('clothing','Occasional clothing repair',65,'tailor');
 const receipt={ok:true,date,person:'foremanSullivan',rentCents,groceriesCents,cashRemainingCents:wallet.balanceCents};
 m.settlements[date]=receipt;
 return {...receipt,repeated:false};
}
const api=Object.freeze({RENT_CENTS,GOODS,STARTING_GOODS,SITES,allowedAt,ensure,purchase,quoteBasket,purchaseBasket,consume,deliveryForCalendar,settleSaturday});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WASHINGTON_COMMERCE=api;
})(typeof window!=='undefined'?window:globalThis);
