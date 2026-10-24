/* Capital & Consequence 1878: actual bounded NPC weekly market purchases.
 * No global price inflation, magic income, or exact daily egg-counting.
 * Payments leave a household account and enter recorded local business tills.
 */
(function(root){
 'use strict';
 const RENT_CENTS=25;
 const GOODS=Object.freeze([
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
 const weekday=iso=>new Date(iso+'T12:00:00Z').getUTCDay();
 function settleSaturday(save){
  if(!save?.componentWorks||typeof save.gameDate!=='string'||weekday(save.gameDate)!==6)
   return {ok:false,reason:'Household market settles Saturday only'};
  const date=save.gameDate;
  const market=save.washingtonCommerce||(save.washingtonCommerce={version:1,accounts:{},purchases:[],settlements:{}});
  if(market.version!==1||!market.accounts||!Array.isArray(market.purchases)||!market.settlements)
   throw Error('Invalid local market ledger');
  if(market.settlements[date])return {...market.settlements[date],repeated:true};
  const wallet=save.npcSimulation?.agents?.foremanSullivan?.economy;
  if(!wallet||!Number.isSafeInteger(wallet.balanceCents)||wallet.balanceCents<0)
   return {ok:false,reason:'Sullivan has no valid market wallet'};
  let rentCents=Math.min(RENT_CENTS,wallet.balanceCents);
  wallet.balanceCents-=rentCents;
  // The rented room is on the factory grounds: rent belongs in company books,
  // not Charlie's personal cash or a fictional second salary.
  const companyCents=Math.round(save.companyCash*100)+rentCents;
  if(!Number.isSafeInteger(companyCents))throw Error('Unrepresentable rental receipt');
  save.companyCash=companyCents/100;save.componentWorks.cashCents=companyCents;
  save.lastRevenue=Math.round((save.lastRevenue||0)*100+rentCents)/100;
  let groceriesCents=0;
  const purchase=(good)=>{
   if(wallet.balanceCents<good.cents)return;
   wallet.balanceCents-=good.cents;groceriesCents+=good.cents;
   market.accounts[good.vendor]=(market.accounts[good.vendor]||0)+good.cents;
   market.purchases.push({date,buyer:'foremanSullivan',good:good.id,
    label:good.label,units:good.units,cents:good.cents,vendor:good.vendor});
  };
  for(const good of GOODS)purchase(good);
  // Cloth and boots are durable. Spend only on occasional repairs or changes,
  // not a mandatory weekly replacement of an entire outfit.
  const week=Math.floor(Date.parse(date+'T12:00:00Z')/604800000);
  if(week%10===0)purchase({id:'cobbler',label:'Occasional boot repair',units:1,cents:45,vendor:'cobbler'});
  if(week%16===0)purchase({id:'clothing',label:'Occasional clothing repair',units:1,cents:65,vendor:'tailor'});
  if(market.purchases.length>1300)market.purchases.splice(0,market.purchases.length-1300);
  const receipt={ok:true,date,person:'foremanSullivan',rentCents,groceriesCents,
   cashRemainingCents:wallet.balanceCents};
  market.settlements[date]=receipt;
  return {...receipt,repeated:false};
 }
 const api=Object.freeze({RENT_CENTS,GOODS,settleSaturday});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WASHINGTON_COMMERCE=api;
})(typeof window!=='undefined'?window:globalThis);
