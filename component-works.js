/* Capital & Consequence v0.6.62: independent 1878 component works foundation.
 * Production, payment, warehouse delivery and raw material procurement are
 * integer-cents transactional facts, kept distinct from 1890 bulb saves.
 * The v0.6.72 adapter and live game now integrate this reusable core with the new 1878 start and player clock.
 * Prices, recipes, wages and customer names are provisional game balancing.
 */
(function(root){
 'use strict';
 const START_DATE='1878-01-02';
 const MATERIALS=Object.freeze({
  copper:Object.freeze({name:'Copper stock',costCents:14}),
  brass:Object.freeze({name:'Brass fittings',costCents:19}),
  iron:Object.freeze({name:'Iron and steel stock',costCents:12}),
  timber:Object.freeze({name:'Worked wood',costCents:9}),
  insulation:Object.freeze({name:'Insulating material',costCents:16}),
  glass:Object.freeze({name:'Glass apparatus',costCents:11}),
  carbon:Object.freeze({name:'Carbon stock',costCents:8})
 });
 const PRODUCTS=Object.freeze({
  'telegraph-key':Object.freeze({name:'Telegraph key apparatus',unitPriceCents:420,minutes:9,
   inputs:{brass:2,copper:1,timber:1},station:'bench'}),
  'telegraph-relay':Object.freeze({name:'Telegraph relay assemblies',unitPriceCents:760,minutes:16,
   inputs:{copper:3,iron:2,insulation:2,timber:1},station:'winder'}),
  'switch-contact':Object.freeze({name:'Electrical switch contacts',unitPriceCents:240,minutes:7,
   inputs:{brass:2,copper:1,insulation:1},station:'bench'}),
  'insulated-wire':Object.freeze({name:'Insulated wiring lengths',unitPriceCents:190,minutes:6,
   inputs:{copper:2,insulation:2},station:'winder'}),
  'battery-fitting':Object.freeze({name:'Battery terminal fittings',unitPriceCents:310,minutes:8,
   inputs:{brass:2,copper:1,glass:1},station:'bench'}),
  'insulator':Object.freeze({name:'Electrical insulator assemblies',unitPriceCents:260,minutes:9,
   inputs:{glass:2,iron:1,timber:1},station:'bench'}),
  // Deliberately impossible on the 1878 starting day. Actual late-era
  // licensing, inventions, tools and process realism remain future work.
  'incandescent-lamp':Object.freeze({name:'Experimental incandescent lamps',
   unitPriceCents:160,minutes:24,inputs:{glass:2,copper:2,carbon:1},
   station:'lamp-line',availableFrom:'1880-01-01',license:'incandescent-rights'})
 });
 const CUSTOMERS=Object.freeze([
  'Potomac Telegraph Office','District Signal Supply','Capital Railway Telegraph',
  'Columbia Instrument Dealers'
 ]);
 const validToken=t=>typeof t==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9:_./-]{0,119}$/.test(t);
 const positive=n=>Number.isSafeInteger(n)&&n>0&&n<=100000;
 const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T00:00:00Z'));
 function createState(date=START_DATE){
  if(!validDate(date))throw Error('Explicit valid company date required');
  return {version:1,ownerRoute:'industrialist',company:'Federal Electric',date,
   cashCents:250000,materials:{copper:200,brass:180,iron:120,timber:100,insulation:180,glass:80,carbon:0},
   warehouse:Object.fromEntries(Object.keys(PRODUCTS).map(k=>[k,0])),
   stations:{bench:1,winder:1,'lamp-line':0},licenses:[],
   orders:[],receipts:{},ledger:[],minutesCommitted:0};
 }
 function verify(state){
  if(!state||state.version!==1||state.ownerRoute!=='industrialist'||
   !validDate(state.date)||!Number.isSafeInteger(state.cashCents)||state.cashCents<0||
   !state.materials||!state.warehouse||!state.stations||!Array.isArray(state.licenses)||
   !Array.isArray(state.orders)||!state.receipts||!Array.isArray(state.ledger))
   throw Error('Unrecognized component-works save; never reset it silently');
  return state;
 }
 function eligibility(state,productId){
  verify(state);
  const p=PRODUCTS[productId];
  if(!p)return {ok:false,reason:'unknown product'};
  if(p.availableFrom&&state.date<p.availableFrom)return {ok:false,reason:'technology date not reached'};
  if(p.license&&!state.licenses.includes(p.license))return {ok:false,reason:'licensing unavailable'};
  if(!positive(state.stations[p.station]))return {ok:false,reason:'required station unavailable'};
  return {ok:true};
 }
 function cached(state,token){return Object.prototype.hasOwnProperty.call(state.receipts,token)?
  {...state.receipts[token],repeated:true}:null}
 function record(state,token,kind,details){
  const r={token,kind,...details,sequence:Object.keys(state.receipts).length+1};
  state.receipts[token]=r;state.ledger.push(r);
  if(state.ledger.length>128)state.ledger.splice(0,state.ledger.length-128);
  return {...r,repeated:false};
 }
 function authorize(state,token){
  verify(state);
  if(!validToken(token))throw Error('Stable unique transaction token required');
  return cached(state,token);
 }
 function order(state,details,token){
  const earlier=authorize(state,token);if(earlier)return earlier;
  const {customer,productId,quantity,deadline}=details||{},p=PRODUCTS[productId];
  if(!CUSTOMERS.includes(customer)||!p||!positive(quantity)||!validDate(deadline)||deadline<state.date)
   return {ok:false,reason:'invalid component customer, order or deadline'};
  const gate=eligibility(state,productId);if(!gate.ok)return gate;
  const id='FE-CMP-'+String(state.orders.length+1).padStart(3,'0');
  state.orders.push({id,customer,productId,quantity,priceCents:p.unitPriceCents,
   made:0,delivered:0,status:'accepted',deadline});
  return record(state,token,'order',{ok:true,id,productId,quantity});
 }
 function purchase(state,materialId,quantity,token){
  const earlier=authorize(state,token);if(earlier)return earlier;
  const material=MATERIALS[materialId];
  if(!material||!positive(quantity))return {ok:false,reason:'invalid material order'};
  const costCents=material.costCents*quantity;
  if(costCents>state.cashCents)return {ok:false,reason:'insufficient company cash'};
  state.cashCents-=costCents;
  state.materials[materialId]=(state.materials[materialId]||0)+quantity;
  return record(state,token,'material-purchase',{ok:true,materialId,quantity,costCents});
 }
 function assemblyQuote(state,orderId,units){
  verify(state);
  const job=state.orders.find(o=>o.id===orderId);
  if(!job||!positive(units)||units>job.quantity-job.made)
   return {ok:false,reason:'invalid or fulfilled production order'};
  const gate=eligibility(state,job.productId);if(!gate.ok)return gate;
  const p=PRODUCTS[job.productId],inputs=Object.fromEntries(
   Object.entries(p.inputs).map(([k,v])=>[k,v*units]));
  for(const [k,v] of Object.entries(inputs)){
   if(!Number.isSafeInteger(state.materials[k])||state.materials[k]<v)
    return {ok:false,reason:'insufficient '+k};
  }
  // Charlie's manual assembly has no per-unit wage charge. The paid assistant
   // is salaried once from company funds at daily close, not per assembly.
  const minutesRequired=p.minutes*units,laborCostCents=0;
  if(!Number.isSafeInteger(minutesRequired)||minutesRequired>1000000)
   return {ok:false,reason:'production run too large'};
  if(laborCostCents>state.cashCents)return {ok:false,reason:'insufficient operating cash'};
  return {ok:true,productId:job.productId,units,inputs,minutesRequired,laborCostCents};
 }
 function assemble(state,orderId,units,token){
  const earlier=authorize(state,token);if(earlier)return earlier;
  const quote=assemblyQuote(state,orderId,units);if(!quote.ok)return quote;
  // All preflight validation completes before any inventory/cash mutation.
  for(const [k,v] of Object.entries(quote.inputs))state.materials[k]-=v;
  state.cashCents-=quote.laborCostCents;
  state.minutesCommitted+=quote.minutesRequired;
  const job=state.orders.find(o=>o.id===orderId);
  job.made+=units;state.warehouse[job.productId]+=units;
  job.status='in-production';
  return record(state,token,'assembly',{ok:true,orderId,units,productId:job.productId,
   minutesRequired:quote.minutesRequired,laborCostCents:quote.laborCostCents});
 }
 function ship(state,orderId,units,token){
  const earlier=authorize(state,token);if(earlier)return earlier;
  const job=state.orders.find(o=>o.id===orderId);
  if(!job||!positive(units)||units>job.quantity-job.delivered)
   return {ok:false,reason:'invalid shipment'};
  if(!Number.isSafeInteger(state.warehouse[job.productId])||state.warehouse[job.productId]<units)
   return {ok:false,reason:'insufficient finished warehouse stock'};
  const revenueCents=units*job.priceCents;
  if(!Number.isSafeInteger(revenueCents)||state.cashCents+revenueCents>Number.MAX_SAFE_INTEGER)
   return {ok:false,reason:'unsafe payment amount'};
  state.warehouse[job.productId]-=units;
  job.delivered+=units;job.status=job.delivered===job.quantity?'delivered':'partial';
  state.cashCents+=revenueCents;
  return record(state,token,'shipment',{ok:true,orderId,units,productId:job.productId,
   revenueCents,complete:job.status==='delivered',late:state.date>job.deadline});
 }
 const api=Object.freeze({START_DATE,MATERIALS,PRODUCTS,CUSTOMERS,createState,verify,
  eligibility,order,purchase,assemblyQuote,assemble,ship});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_COMPONENT_WORKS=api;
})(typeof window!=='undefined'?window:globalThis);
