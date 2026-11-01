/* Capital & Consequence: 1878 municipal electric contracts and lamp research.
 * All payments, stock and time use the EXISTING Federal Electric save/clock.
 * 50 streetlamp points and 100 Fair bulbs are tunable scenario quantities,
 * not a claim of owner-fixed historical numbers or an actual Fair opening.
 */
(function(root){
'use strict';
const works=typeof module==='object'&&module.exports?require('./component-works.js'):root.FE_COMPONENT_WORKS;
const ops=typeof module==='object'&&module.exports?require('./workshop-operations.js'):root.FE_WORKSHOP_OPERATIONS;
if(!works||!ops)throw Error('1878 component works and workshop operations required');
const STREET_SITES=50,FAIR_BULBS=100;
const STREET_INPUTS=Object.freeze({'insulated-wire':1,'switch-contact':1,'insulator':1});
const RESEARCH=Object.freeze([
 Object.freeze({name:'Carbon-filament trials',minutes:180,costCents:2800}),
 Object.freeze({name:'Glass envelopes and lead seals',minutes:180,costCents:3500}),
 Object.freeze({name:'Vacuum-pump experiments',minutes:240,costCents:4800}),
 Object.freeze({name:'Burn-life and failure testing',minutes:180,costCents:4000})
]);
const CASH={ 'street-bid':1000,'street-dispatch':0,'street-certify':0,
 research:null,license:9000,'prototype-line':22500,'hire-crew':5000,
 'upgrade-line':65000,'fair-bid':1500,'fair-dispatch':0};
const MINUTES={'street-bid':30,'street-dispatch':15,'street-certify':90,
 license:60,'prototype-line':240,'hire-crew':120,
 'upgrade-line':360,'fair-bid':30,'fair-dispatch':20};
function hash(x){let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function initial(){return {version:1,street:{status:'open',sites:STREET_SITES,shipped:0,certified:0,playerBidCents:null,rivalBidCents:null},
 lamps:{stage:0,attempts:0,license:false,prototype:false,crew:0,upgraded:false},
 fair:{status:'not-open',bulbs:FAIR_BULBS,shipped:0,playerBidCents:null,rivalBidCents:null},
 payroll:{lastSaturday:null,owedCents:0},receipts:{}}}
function state(save){const data=save?.electricCampaign||initial();
 if(data.version!==1||!data.street||!data.lamps||!data.fair||!data.payroll||!data.receipts)throw Error('Invalid electric campaign record');
 return data}
function read(save){return JSON.parse(JSON.stringify(state(save)))}
function fail(reason){return {ok:false,reason}}
function integer(v,min,max){return Number.isSafeInteger(v)&&v>=min&&v<=max}
function shippedComponents(save){return Object.values(save?.componentWorks?.receipts||{}).some(r=>r.kind==='shipment'&&r.ok)}
function canResearch(save,progress,date){
 if(!shippedComponents(save))return fail('Deliver a real electrical component order first.');
 if(progress.street.status==='open')return fail('Compete for the District streetlight tender before lamp development.');
 if(date<'1878-03-01')return fail('Experimental lamp research begins after the first 1878 component and streetlight phase.');
 return {ok:true};
}
function canOperate(save,kind,date){
 const saturday=new Date(date.date+'T12:00:00Z').getUTCDay()===6;
 const sunday=new Date(date.date+'T12:00:00Z').getUTCDay()===0;
 if(sunday)return fail('The factory is closed Sunday.');
 if(kind.endsWith('dispatch')&&!saturday)return fail('Physical consignments leave on Saturday.');
 if(!kind.endsWith('dispatch')&&saturday)return fail('Saturday is reserved for dispatch and weekly payroll.');
 if(date.minuteOfDay<540||date.minuteOfDay>=1020)return fail('Workshop actions run between 9 AM and 5 PM.');
 return {ok:true};
}
function transact(save,kind,args,token,spend,finishAtBell){
 if(!save?.componentWorks||save.characterRoute!=='industrialist'||save.paused||save.phase!=='day')
  return fail('Charlie must be working at an active Federal Electric factory.');
 if(save.currentLocation?.locationId!=='factory')return fail('Return to Federal Electric to use the workshop.');
 if(root.FE_CORPORATE&&!root.FE_CORPORATE.canManage(save))return fail('Corporate management authority is required.');
 if(!Object.hasOwn(CASH,kind)||typeof token!=='string'||!/^[-a-z0-9:_]{1,120}$/i.test(token))return fail('Invalid electric contract action.');
 const old=state(save);
 if(Object.hasOwn(old.receipts,token))return {...old.receipts[token],repeated:true};
 const clock=root.FE_WASHINGTON_TIME?.now?.(save);
 if(!clock||!/^\d{4}-\d{2}-\d{2}$/.test(clock.date)||!integer(clock.minuteOfDay,0,1440))
  return fail('Authoritative Washington clock unavailable.');
 const operating=canOperate(save,kind,clock);if(!operating.ok)return operating;
 if(!Number.isFinite(save.companyCash)||save.companyCash<0)return fail('Invalid company cash balance.');
 const cashCents=Math.round(save.companyCash*100);
 if(!Number.isSafeInteger(cashCents))return fail('Invalid company cash precision.');
 const data=JSON.parse(JSON.stringify(old)),inventory=JSON.parse(JSON.stringify(save.componentWorks.warehouse));
 const orders=JSON.parse(JSON.stringify(save.componentWorks.orders));
 const lamps=data.lamps,street=data.street,fair=data.fair,seed=save.npcSimulation?.seed||0;
 let minutes=MINUTES[kind],costCents=CASH[kind],incomeCents=0,outcome={},inputs={};
 if(kind==='street-bid'){
  if(clock.date<'1878-02-01'||clock.date>'1878-06-30')return fail('The first District streetlight tender is open February to June 1878.');
  if(street.status!=='open')return fail('The District has already adjudicated this tender.');
  if(!shippedComponents(save))return fail('First deliver a real Federal Electric component order.');
  const bid=Number(args?.priceCents);
  if(![1450,1650,1850].includes(bid))return fail('Choose an official bid price.');
  street.rivalBidCents=1520+hash('street|'+seed)%340;
  street.playerBidCents=bid;
  street.status=bid<=street.rivalBidCents?'awarded':'lost';
  street.deadline='1878-09-30';
  outcome={won:street.status==='awarded',rivalBidCents:street.rivalBidCents,
   message:street.status==='awarded'?'District tender awarded. Make, dispatch and certify the 50 lighting sites.':'A rival won the streetlight tender. Federal Electric may still research lamps.'};
 }
 else if(kind==='street-dispatch'){
  if(street.status!=='awarded'&&street.status!=='in-progress')return fail('No awarded streetlight contract awaiting physical stock.');
  const qty=Number(args?.quantity);
  if(!integer(qty,1,10)||qty>street.sites-street.shipped)return fail('Dispatch 1–10 remaining lighting sites per Saturday.');
  for(const [id,each] of Object.entries(STREET_INPUTS)){
   inputs[id]=each*qty;
   if((inventory[id]||0)<inputs[id])return fail('Insufficient finished '+works.PRODUCTS[id].name+' in the workshop warehouse.');
  }
  for(const [id,used] of Object.entries(inputs)){
   const order=orders.find(o=>o.special==='street-1878'&&o.productId===id);
   if(!order||order.delivered+qty>order.quantity)return fail('The District production order is missing or overdrawn: '+id);
   inventory[id]-=used;order.delivered+=qty;
   order.status=order.delivered===order.quantity?'delivered':'partial';
  }
  street.shipped+=qty;street.status='in-progress';
  outcome={quantity:qty,shipped:street.shipped,message:'Physical parts dispatched for '+qty+' city light sites; installation inspection remains.'};
 }
 else if(kind==='street-certify'){
  if(street.status!=='in-progress'&&street.status!=='awarded')return fail('No streetlight installation awaiting certification.');
  const qty=Number(args?.quantity);
  if(!integer(qty,1,10)||qty>street.shipped-street.certified)return fail('Inspect 1–10 dispatched but unapproved lighting sites.');
  street.certified+=qty;
  incomeCents=qty*street.playerBidCents;
  if(street.certified===street.sites)street.status='completed';
  outcome={quantity:qty,certified:street.certified,message:'City inspector accepted '+qty+' installed lights. Only accepted work is paid.'};
 }
 else if(kind==='research'){
  const eligible=canResearch(save,data,clock.date);if(!eligible.ok)return eligible;
  if(lamps.stage>=RESEARCH.length)return fail('Lamp research is complete; obtain the rights and install a prototype line.');
  const step=RESEARCH[lamps.stage];minutes=step.minutes;costCents=step.costCents;
  lamps.attempts++;
  const passed=hash('lamp-research|'+seed+'|'+lamps.stage+'|'+lamps.attempts)%5!==0;
  if(passed)lamps.stage++;
  outcome={passed,stage:lamps.stage,step:step.name,
   message:passed?step.name+' passed; research stage '+lamps.stage+' of '+RESEARCH.length+'.':
    step.name+' failed testing. Materials and laboratory time were spent; retry is necessary.'};
 }
 else if(kind==='license'){
  if(lamps.stage!==RESEARCH.length||lamps.license)return fail('Complete the research first; rights can only be secured once.');
  lamps.license=true;outcome={message:'Licensed the experimental lamp method. Production tooling still required.'};
 }
 else if(kind==='prototype-line'){
  if(!lamps.license||lamps.prototype)return fail('Secure the lamp rights first; the prototype line is bought once.');
  lamps.prototype=true;outcome={message:'Installed a hand-assembly lamp bench and vacuum pump. Individual bulbs still take hours and may fail.'};
 }
 else if(kind==='hire-crew'){
  if(!lamps.prototype||lamps.crew)return fail('An operating prototype bench is required before hiring lamp specialists.');
  lamps.crew=2;outcome={message:'Two specialist lamp workers hired. Weekly wages are payable on Saturdays, with arrears if funds run short.'};
 }
 else if(kind==='upgrade-line'){
  if(!lamps.prototype||lamps.crew<2||lamps.upgraded)return fail('Prototype bench and two hired specialists are required for a production line.');
  if((save.componentWorks.lampDevelopment?.good||0)<3)return fail('Produce at least three sound prototype lamps before scaling up.');
  lamps.upgraded=true;outcome={message:'Installed the specialized high-volume line. Workers can now assemble lamps in shorter batches, still with defects.'};
 }
 else if(kind==='fair-bid'){
  if(clock.date<'1878-08-01'||clock.date>'1878-11-30')return fail('Fair electrical supplier bidding opens in late 1878.');
  if(fair.status!=='not-open')return fail('The Fair has already decided this supplier tender.');
  if(!lamps.upgraded||(save.componentWorks.lampDevelopment?.good||0)<5)
   return fail('A working specialist line and five verified lamps are needed to qualify.');
  const bid=Number(args?.priceCents);
  if(![240,285,330].includes(bid))return fail('Choose a valid Fair supply price.');
  fair.rivalBidCents=250+hash('fair|'+seed)%65;fair.playerBidCents=bid;
  fair.status=bid<=fair.rivalBidCents?'awarded':'lost';
  outcome={won:fair.status==='awarded',rivalBidCents:fair.rivalBidCents,
   message:fair.status==='awarded'?'Fair supply contract awarded for 100 tested lamps. Manufacture and dispatch them.':'A competing exhibitor supplied the Fair. The Fair still takes place.'};
 }
 else if(kind==='fair-dispatch'){
  if(fair.status!=='awarded'&&fair.status!=='in-progress')return fail('No awarded Fair lamp supply contract.');
  if(clock.date<'1878-10-01')return fail('The Fair has not reached the provisional late-1878 delivery window.');
  const qty=Number(args?.quantity);
  if(!integer(qty,1,25)||qty>fair.bulbs-fair.shipped)return fail('Dispatch 1–25 remaining Fair lamps per Saturday.');
  if((inventory['incandescent-lamp']||0)<qty)return fail('Not enough passed incandescent bulbs in the actual warehouse.');
  const order=orders.find(o=>o.special==='fair-1878'&&o.productId==='incandescent-lamp');
  if(!order||order.delivered+qty>order.quantity)return fail('The Fair manufacturing order is missing or overdrawn.');
  inventory['incandescent-lamp']-=qty;
  order.delivered+=qty;order.status=order.delivered===order.quantity?'delivered':'partial';
  fair.shipped+=qty;incomeCents=qty*fair.playerBidCents;
  fair.status=fair.shipped===fair.bulbs?'completed':'in-progress';
  outcome={quantity:qty,shipped:fair.shipped,message:'Dispatched and invoiced '+qty+' tested Fair lamps.'};
 }
 else return fail('Unsupported contract action.');
 const balance=cashCents-costCents+incomeCents;
 if(!Number.isSafeInteger(balance)||balance<0)return fail('Insufficient company funds for this action.');
 const seconds=minutes*60,remaining=(1020-clock.minuteOfDay)*60-(save.worldCalendarRemainder||0);
 if(!integer(seconds,1,28800)||seconds>remaining)return fail('Not enough time before the 5 PM bell; resume another workday.');
 const atBell=seconds===remaining;
 if(atBell&&typeof finishAtBell!=='function')return fail('5 PM requires an authorized closing callback.');
 if(typeof spend!=='function'||spend(seconds,true,atBell)!==seconds)
  return fail('The real game clock could not record this work.');
 // Commit only after payment, inventory and time have all passed preflight.
 save.componentWorks.warehouse=inventory;
 // Awarded municipal contracts generate actual, unpaid factory orders, not stock.
 if(kind==='street-bid'&&street.status==='awarded'){
  for(const id of Object.keys(STREET_INPUTS))orders.push({
   id:'FE-1878-ARC-'+id,customer:'District Streetlighting Office',productId:id,
   quantity:STREET_SITES,priceCents:0,made:0,delivered:0,status:'accepted',deadline:'1878-09-30',special:'street-1878'});
 }
 if(kind==='fair-bid'&&fair.status==='awarded')orders.push({
  id:'FE-1878-FAIR-BULBS',customer:'Washington World’s Fair',productId:'incandescent-lamp',
  quantity:FAIR_BULBS,priceCents:0,made:0,delivered:0,status:'accepted',deadline:'1878-12-31',special:'fair-1878'});
 save.componentWorks.orders=orders;
 save.companyCash=balance/100;save.componentWorks.cashCents=balance;
 if(costCents)save.lastExpenses=(save.lastExpenses||0)+costCents/100;
 if(incomeCents)save.lastRevenue=(save.lastRevenue||0)+incomeCents/100;
 if(kind==='prototype-line'){save.componentWorks.stations['lamp-line']=1;
  if(!save.componentWorks.licenses.includes('incandescent-rights'))save.componentWorks.licenses.push('incandescent-rights');}
 if(kind==='upgrade-line')save.componentWorks.stations['lamp-line']=2;
 const receipt={ok:true,kind,token,date:clock.date,costCents,incomeCents,elapsedSeconds:seconds,...outcome};
 data.receipts[token]=receipt;save.electricCampaign=data;
 if(Array.isArray(save.notes)&&(kind==='street-bid'||kind==='fair-bid'||street.status==='completed'||fair.status==='completed')){
  save.notes.push({date:clock.date,source:'Federal Electric municipal contract register',text:outcome.message});
 }
 if(atBell&&finishAtBell()!==true)throw Error('Closing bell did not settle after electric contract action');
 return {...receipt,repeated:false};
}
function settleWeek(save){
 if(!save?.electricCampaign||!save.componentWorks||save.characterRoute!=='industrialist'||save.electricCampaign.lamps?.crew<1)return {ok:true,dueCents:0};
 const date=root.FE_WASHINGTON_TIME?.now?.(save)?.date||save.gameDate;
 if(typeof date!=='string'||new Date(date+'T12:00:00Z').getUTCDay()!==6)return {ok:true,dueCents:0};
 const record=state(save).payroll;
 if(record.lastSaturday===date)return {ok:true,dueCents:0,repeated:true};
 const dueCents=(record.owedCents||0)+save.electricCampaign.lamps.crew*900;
 const cash=Math.round((save.companyCash||0)*100);
 const paidCents=Math.min(Math.max(0,cash),dueCents);
 record.owedCents=dueCents-paidCents;record.lastSaturday=date;
 save.companyCash=(cash-paidCents)/100;save.componentWorks.cashCents=cash-paidCents;
 save.lastExpenses=(save.lastExpenses||0)+paidCents/100;
 if(Array.isArray(save.notes))save.notes.push({date,source:'Federal Electric payroll',text:'Lamp specialists paid '+(paidCents/100).toFixed(2)+' dollars; unpaid wages '+(record.owedCents/100).toFixed(2)+' dollars.'});
 return {ok:true,dueCents,paidCents,owedCents:record.owedCents};
}
const api=Object.freeze({initial,read,transact,settleWeek,RESEARCH,STREET_SITES,FAIR_BULBS,STREET_INPUTS});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ELECTRIC_CAMPAIGN=api;
})(typeof window!=='undefined'?window:globalThis);
