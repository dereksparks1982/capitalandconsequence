/* Capital & Consequence v0.7.73: incremental factory expansion.
 * Optional saved capacity upgrades use existing components, cash and Washington clock.
 * Salaries are incurred on Saturday, never paid by invisible offline simulation.
 */
(function(root){
'use strict';
const works=typeof module==='object'&&module.exports?require('./component-works.js'):root.FE_COMPONENT_WORKS;
if(!works)throw Error('Component works is required');
const ROLES=Object.freeze({
 bench:Object.freeze({label:'bench technician',hireCents:3500,toolCents:8500,trainCents:3200,weeklyCents:600}),
 winder:Object.freeze({label:'winding specialist',hireCents:4500,toolCents:11000,trainCents:4500,weeklyCents:750})
});
function fresh(){return {version:1,machines:{bench:1,winder:1},staff:{bench:{count:0,trained:false},winder:{count:0,trained:false}},payroll:{lastSaturday:null,owedCents:0},receipts:{}}}
function capacity(save){const data=save?.componentWorks?.factoryCapacity||fresh();
 if(data.version!==1||!data.machines||!data.staff||!data.payroll||!data.receipts)throw Error('Damaged factory expansion records');
 for(const kind of Object.keys(ROLES)){
  if(!Number.isSafeInteger(data.machines[kind])||data.machines[kind]<1||data.machines[kind]>2||
    !data.staff[kind]||!Number.isSafeInteger(data.staff[kind].count)||data.staff[kind].count<0||
    data.staff[kind].count>1||typeof data.staff[kind].trained!=='boolean')throw Error('Damaged factory staffing for '+kind);
 }
 if(!Number.isSafeInteger(data.payroll.owedCents)||data.payroll.owedCents<0)throw Error('Damaged factory salary account');
 return data;
}
function read(save){return JSON.parse(JSON.stringify(capacity(save)))}
function quoteOrder(save,orderId){
 works.verify(save.componentWorks);
 const order=save.componentWorks.orders.find(o=>o.id===orderId);
 if(!order)return {ok:false,reason:'Choose a real workshop order.'};
 const recipe=works.PRODUCTS[order.productId];
 if(!recipe)return {ok:false,reason:'Unknown component recipe.'};
 const remaining=Math.max(0,order.quantity-order.made);
 // Reserve normal materials for all remaining *attempts*. Lamp rejects may require
 // repeat lots: warn about scrap without manufacturing imaginary bulbs.
 const target=remaining;
 const requirements={},shortages={};
 let costCents=0;
 for(const [material,perUnit] of Object.entries(recipe.inputs)){
  const required=perUnit*target,available=save.componentWorks.materials[material]||0;
  const short=Math.max(0,required-available);
  requirements[material]={required,available,short};
  if(short){shortages[material]=short;costCents+=short*works.MATERIALS[material].costCents}
 }
 const shift=works.unitMinutes(save.componentWorks,order.productId);
 return {ok:true,orderId,productId:order.productId,remaining,requirements,shortages,
  costCents,minutesPerUnit:shift,estimatedWorkMinutes:remaining*shift,
  note:order.productId==='incandescent-lamp'?'Additional stock may be needed for failed bulb trials.':'Estimate assumes one finished unit per assembly attempt.'};
}
function transact(save,kind,details,token,spend,finishAtBell){
 if(!save?.componentWorks||save.characterRoute!=='industrialist'||save.phase!=='day'||save.paused)
  return {ok:false,reason:'Charlie must be on his active business day.'};
 if(save.currentLocation?.locationId!=='factory')return {ok:false,reason:'Visit Federal Electric before authorizing factory investments.'};
 if(root.FE_CORPORATE&&!root.FE_CORPORATE.canManage(save))return {ok:false,reason:'Corporate management approval required.'};
 if(!['hire','equipment','train','requisition'].includes(kind)||typeof token!=='string'||!/^[-a-z0-9:_]{1,120}$/i.test(token))
  return {ok:false,reason:'Invalid factory action.'};
 works.verify(save.componentWorks);
 const previous=capacity(save);
 // Component-workshop receipts and capacity receipts share transaction tokens.
 const cached=save.componentWorks.receipts[token]||previous.receipts[token];
 if(cached)return {...cached,repeated:true};
 const clock=root.FE_WASHINGTON_TIME?.now?.(save);
 if(!clock||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(clock.date)||
  !Number.isSafeInteger(clock.minuteOfDay))return {ok:false,reason:'Washington clock unavailable.'};
 const weekday=new Date(clock.date+'T12:00:00Z').getUTCDay();
 if(weekday===0||weekday===6||clock.minuteOfDay<540||clock.minuteOfDay>=1020)
  return {ok:false,reason:'Factory investment office operates 9–5 on weekdays.'};
 const cash=Math.round(save.companyCash*100);
 if(!Number.isSafeInteger(cash)||cash<0)return {ok:false,reason:'Invalid company balance.'};
 const data=read(save);
 let minutes=60,costCents=0,description='',stockAdd=null;
 if(kind==='requisition'){
  const quote=quoteOrder(save,details?.orderId);
  if(!quote.ok)return quote;
  if(!quote.remaining||!Object.keys(quote.shortages).length)return {ok:false,reason:'This order needs no new raw materials.'};
  if(Object.values(quote.shortages).some(v=>!Number.isSafeInteger(v)||v>100000))
   return {ok:false,reason:'Material requisition exceeds the permitted batch size.'};
  costCents=quote.costCents;minutes=5;stockAdd=quote.shortages;
  description='Purchased missing raw materials for '+quote.orderId+' against real company cash.';
 }else{
  const role=details?.role,setting=ROLES[role];
  if(!setting)return {ok:false,reason:'Choose a bench or winding speciality.'};
  const crew=data.staff[role];
  if(kind==='hire'){
   if(crew.count>=1)return {ok:false,reason:'Specialist already employed; train or equip this work station.'};
   crew.count=1;minutes=120;costCents=setting.hireCents;
   description='Hired an additional '+setting.label+'. Weekly wages are now incurred.';
  }else if(kind==='equipment'){
   if(data.machines[role]>=2)return {ok:false,reason:'That workstation already has its additional machine.'};
   data.machines[role]=2;minutes=180;costCents=setting.toolCents;
   description='Bought and installed a second '+role+' machine.';
  }else if(kind==='train'){
   if(!crew.count)return {ok:false,reason:'Hire the specialist before paying for training.'};
   if(crew.trained)return {ok:false,reason:'Specialist already completed advanced training.'};
   crew.trained=true;minutes=180;costCents=setting.trainCents;
   description='Completed advanced '+role+' specialist training.';
  }
 }
 if(costCents>cash)return {ok:false,reason:'Company cannot afford this equipment, payroll or material requisition.'};
 const seconds=minutes*60,remaining=(1020-clock.minuteOfDay)*60-(save.worldCalendarRemainder||0);
 if(seconds>remaining)return {ok:false,reason:'This work cannot be completed before the 5 PM closing bell.'};
 const atBell=seconds===remaining;
 if(atBell&&typeof finishAtBell!=='function')return {ok:false,reason:'Closing settlement callback required.'};
 if(typeof spend!=='function'||spend(seconds,true,atBell)!==seconds)
  return {ok:false,reason:'The authoritative world clock declined this action.'};
 // No production, inventory or cash changes precede the successful time charge.
 const nextMaterials={...save.componentWorks.materials};
 for(const [id,qty] of Object.entries(stockAdd||{}))nextMaterials[id]=(nextMaterials[id]||0)+qty;
 const nextCash=cash-costCents;
 save.componentWorks.materials=nextMaterials;save.companyCash=nextCash/100;
 save.componentWorks.cashCents=nextCash;
 save.lastExpenses=Math.round((save.lastExpenses||0)*100+costCents)/100;
 const receipt={ok:true,kind:'factory-'+kind,token,date:clock.date,role:details?.role||null,
  orderId:details?.orderId||null,costCents,elapsedSeconds:seconds,materialsAdded:stockAdd||{},message:description};
 data.receipts[token]=receipt;
 save.componentWorks.factoryCapacity=data;
 save.componentWorks.receipts[token]=receipt;
 if(!Array.isArray(save.componentWorks.ledger))save.componentWorks.ledger=[];
 save.componentWorks.ledger.push(receipt);
 if(save.componentWorks.ledger.length>128)save.componentWorks.ledger.splice(0,save.componentWorks.ledger.length-128);
 if(Array.isArray(save.notes))save.notes.push({date:clock.date,source:'Federal Electric factory expansion',text:description});
 if(atBell&&finishAtBell()!==true)throw Error('Closing bell could not settle after factory investment.');
 return {...receipt,repeated:false};
}
function settleSaturday(save){
 if(!save?.componentWorks||save.characterRoute!=='industrialist')return {ok:true,dueCents:0};
 const state=capacity(save);
 const count=Object.keys(ROLES).reduce((sum,k)=>sum+state.staff[k].count,0);
 if(!count&&!state.payroll.owedCents)return {ok:true,dueCents:0};
 const date=root.FE_WASHINGTON_TIME?.now?.(save)?.date||save.gameDate;
 if(typeof date!=='string'||new Date(date+'T12:00:00Z').getUTCDay()!==6)return {ok:true,dueCents:0};
 if(state.payroll.lastSaturday===date)return {ok:true,repeated:true,dueCents:0};
 const earned=Object.entries(ROLES).reduce((sum,[id,v])=>sum+state.staff[id].count*v.weeklyCents,0);
 const dueCents=earned+state.payroll.owedCents,cashCents=Math.round(save.companyCash*100);
 if(!Number.isSafeInteger(cashCents)||cashCents<0)return {ok:false,reason:'Invalid company cash during payroll'};
 const paidCents=Math.min(dueCents,cashCents);
 state.payroll.owedCents=dueCents-paidCents;state.payroll.lastSaturday=date;
 save.companyCash=(cashCents-paidCents)/100;
 save.componentWorks.cashCents=cashCents-paidCents;
 save.lastExpenses=Math.round((save.lastExpenses||0)*100+paidCents)/100;
 if(Array.isArray(save.notes))save.notes.push({date,source:'Federal Electric specialist payroll',
  text:'Bench and winding specialist wages $'+(paidCents/100).toFixed(2)+
   ' paid, $'+(state.payroll.owedCents/100).toFixed(2)+' outstanding.'});
 return {ok:true,date,earnedCents:earned,paidCents,owedCents:state.payroll.owedCents};
}
const api=Object.freeze({ROLES,fresh,read,quoteOrder,transact,settleSaturday});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_FACTORY_CAPACITY=api;
})(typeof window!=='undefined'?window:globalThis);
