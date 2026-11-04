/* Finite, paid merchant cargo trade. Game-balance quotations, not 1878 historical prices.
 * No separate clock, global market, buyer NPC or new geography. Owned ships remain
 * in FE_EMPIRE; a lot only exists after cash-backed purchase and actual delivery.
 */
(function(root){
'use strict';
const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
const GOODS=Object.freeze({
 timber:Object.freeze({name:'Timber bundles',base:34,origins:['Baltimore','Philadelphia','New York']}),
 cotton:Object.freeze({name:'Cotton bales',base:65,origins:['Baltimore','New York','Havana']}),
 coffee:Object.freeze({name:'Coffee sacks',base:84,origins:['Havana','Singapore']}),
 textiles:Object.freeze({name:'Textile bolts',base:82,origins:['Liverpool','Hamburg','Philadelphia']}),
 tea:Object.freeze({name:'Tea chests',base:98,origins:['Singapore','Hong Kong']}),
 machinery:Object.freeze({name:'Machine fittings',base:110,origins:['Liverpool','Hamburg','New York']})
});
const MARKET_PREMIUM=Object.freeze({
 Baltimore:{coffee:1.82,tea:1.94,textiles:1.42,machinery:1.48,cotton:1.13,timber:.9},
 Philadelphia:{coffee:1.72,tea:1.85,textiles:1.22,machinery:1.36,cotton:1.1,timber:.96},
 'New York':{coffee:1.7,tea:1.8,textiles:1.26,machinery:1.28,cotton:1.05,timber:1.08},
 Liverpool:{cotton:1.85,coffee:1.8,tea:1.55,timber:1.75,textiles:.85,machinery:1.07},
 Hamburg:{cotton:1.72,coffee:1.78,tea:1.62,timber:1.55,textiles:.88,machinery:.92},
 Havana:{textiles:1.66,machinery:1.85,tea:1.51,timber:1.53,cotton:.92,coffee:.91},
 Singapore:{machinery:1.92,textiles:1.63,cotton:1.48,timber:1.75,coffee:.9,tea:1.05},
 'Hong Kong':{machinery:1.95,textiles:1.78,cotton:1.62,timber:1.82,coffee:1.32,tea:.88}
});
const CAPACITY=Object.freeze({schooner:12});
const money=n=>Math.round(Number(n)*100)/100;
const fail=reason=>({ok:false,reason});
function week(save){
 const date=typeof save?.gameDate==='string'?save.gameDate:'';
 const time=Date.parse(date+'T00:00:00Z');
 if(!Number.isFinite(time))return null;
 return Math.floor(time/604800000);
}
function key(port,item,weekNumber){return port+'|'+item+'|'+weekNumber}
function stockFor(port,item){
 if(!GOODS[item]?.origins.includes(port))return 0;
 return 24+(port.length*3+item.length*7)%17;
}
function remaining(save,port,item){
 const id=week(save);
 if(id===null)return 0;
 const used=save.merchantTrade?.used?.[key(port,item,id)]||0;
 return Math.max(0,stockFor(port,item)-used);
}
function ensure(save){
 if(!save.merchantTrade||save.merchantTrade.version!==1)
  save.merchantTrade={version:1,used:{},purchases:[],nextId:0};
 const st=save.merchantTrade;
 if(!st.used||typeof st.used!=='object')st.used={};
 if(!Array.isArray(st.purchases))st.purchases=[];
 if(!Number.isSafeInteger(st.nextId)||st.nextId<0)st.nextId=0;
 return st;
}
function price(port,item,side){
 const good=GOODS[item],factor=MARKET_PREMIUM[port]?.[item];
 if(!good||!factor)return null;
 return side==='buy'?good.base:money(good.base*factor);
}
function quote(save,ship,dest,item,units,insured,fleet){
 if(!save||save.characterRoute!=='industrialist'||save.paused||save.phase==='report')
  return fail('Only Charles may authorize an active merchant purchase.');
 if(!nav.gameMinute(save)||save.worldCalendarStatus!=='ready'||!Number.isSafeInteger(save.worldCalendar?.worldMinute))
  return fail('The saved Washington game clock is required.');
 if(!ship||ship.status!=='in-port'||!CAPACITY[ship.type])
  return fail('A real owned and berthed vessel is required.');
 if(!fleet||!fleet.ships?.some(s=>s.id===ship.id)||!fleet.ports?.includes(ship.port)||!fleet.ports.includes(dest))
  return fail('Both origin and destination must be established trade ports.');
 if(!GOODS[item]||!GOODS[item].origins.includes(ship.port))
  return fail('This origin port does not supply that cargo.');
 if(!Number.isSafeInteger(units)||units<1||units>CAPACITY[ship.type])
  return fail('The requested lot exceeds the vessel hold capacity.');
 const left=remaining(save,ship.port,item);
 if(units>left)return fail('The weekly port exchange has only '+left+' units remaining.');
 if(dest===ship.port)return fail('A vessel cannot sell cargo at its own departure berth.');
 const route=nav.plan(ship.port,dest,ship.type);
 if(!route)return fail('No charted commercial sea route connects these ports.');
 const buyUnit=price(ship.port,item,'buy'),saleUnit=price(dest,item,'sell');
 const purchase=buyUnit*units,loading=units*4,departure=110;
 const hullInsurance=insured?Math.ceil(14000*.0075):0;
 const cargoInsurance=insured?Math.ceil(purchase*.045):0;
 const due=money(purchase+loading+departure+hullInsurance+cargoInsurance);
 if(!Number.isFinite(fleet.cash)||fleet.cash<due)
  return fail('Fleet treasury requires $'+due.toFixed(2)+' to buy and ship this cargo.');
 const agent=Math.ceil(saleUnit*units*.06),duty=Math.ceil(saleUnit*units*.05);
 const projectedGross=money(saleUnit*units),projectedNet=money(projectedGross-agent-duty);
 const upkeepPerDay=9;
 return {ok:true,shipId:ship.id,shipName:ship.name,type:ship.type,
  from:ship.port,to:dest,item,units,insured:!!insured,
  productName:GOODS[item].name,remaining:left,capacity:CAPACITY[ship.type],
  pricePerUnit:buyUnit,purchase,loading,fee:departure,insurance:hullInsurance,
  cargoInsurance,due,expectedGross:projectedGross,expectedNet:projectedNet,
  forecastProfit:money(projectedNet-due-upkeepPerDay*route.days),
  upkeepEstimate:upkeepPerDay*route.days,agent,duty,
  days:route.days,nauticalMiles:route.nauticalMiles,
  points:route.points.map(p=>p.slice()),legs:route.legs.map(p=>({...p})),
  estimate:true,
  cargoDescription:units+' '+GOODS[item].name+'; physical purchase at '+ship.port};
}
function purchase(save,offer){
 const st=ensure(save),id=week(save);
 if(!offer?.ok||id===null||offer.units>remaining(save,offer.from,offer.item))
  return fail('Cargo offer is no longer available at this port.');
 const lot={id:++st.nextId,item:offer.item,name:GOODS[offer.item].name,
  units:offer.units,purchase:offer.purchase,from:offer.from,to:offer.to,
  shipId:offer.shipId,insured:offer.insured,depart:save.gameDate,
  expectedGross:offer.expectedGross,priceAtPurchase:offer.pricePerUnit};
 st.used[key(offer.from,offer.item,id)]=(st.used[key(offer.from,offer.item,id)]||0)+offer.units;
 st.purchases.push({id:lot.id,date:save.gameDate,item:lot.item,units:lot.units,
  origin:lot.from,destination:lot.to,amount:lot.purchase});
 st.purchases=st.purchases.slice(-160);
 // Clear old weekly keys only after eight weeks; receipts remain readable.
 for(const k of Object.keys(st.used))if(Number(k.split('|').at(-1))<id-8)delete st.used[k];
 return {ok:true,lot};
}
function saleQuote(save,port,lot){
 if(!lot||lot.to!==port||!GOODS[lot.item]||!Number.isSafeInteger(lot.units)||lot.units<1)
  return fail('The cargo receipt is invalid.');
 if(!MARKET_PREMIUM[port])return fail('Unknown port.');
 const gross=money(price(port,lot.item,'sell')*lot.units);
 const agent=money(Math.ceil(gross*.06)),duty=money(Math.ceil(gross*.05));
 return {ok:true,gross,agent,duty,net:money(gross-agent-duty),port,lotId:lot.id};
}
const api=Object.freeze({GOODS,CAPACITY,MARKET_PREMIUM,stockFor,week,remaining,ensure,price,quote,purchase,saleQuote});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MERCHANT_TRADE=api;
})(typeof window!=='undefined'?window:globalThis);
