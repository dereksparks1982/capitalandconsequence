/* Federal Electric bench/winding workforce and material-requisition console.
 * Extends the existing Factory -> Component Works sheet, no map/UI relocation.
 */
(function(root){
'use strict';
const engine=root.FE_FACTORY_CAPACITY,works=root.FE_COMPONENT_WORKS;
if(!engine||!works)throw Error('Factory expansion modules must load in order.');
function setup(){
 const workshop=document.getElementById('componentWorkshop');
 if(!workshop||document.getElementById('factoryExpansion'))return;
 const section=document.createElement('section');
 section.id='factoryExpansion';section.className='sheet factory-capacity';
 section.innerHTML=[
  '<h3>Federal Electric · Factory Expansion & Materials</h3>',
  '<p>Train specialists and fit additional equipment to reduce real production minutes. Each worker requires a matching second machine. Payroll continues even while a contract is unfinished.</p>',
  '<p id="fcBalance"></p>',
  '<h4>Bench assembly</h4><p id="fcBench"></p>',
  '<button type="button" data-fc-action="hire" data-fc-role="bench">Hire bench technician · $35, 2 hours</button> ',
  '<button type="button" data-fc-action="equipment" data-fc-role="bench">Fit second workbench · $85, 3 hours</button> ',
  '<button type="button" data-fc-action="train" data-fc-role="bench">Train bench technician · $32, 3 hours</button>',
  '<h4>Wire winding</h4><p id="fcWinder"></p>',
  '<button type="button" data-fc-action="hire" data-fc-role="winder">Hire winding specialist · $45, 2 hours</button> ',
  '<button type="button" data-fc-action="equipment" data-fc-role="winder">Install second winder · $110, 3 hours</button> ',
  '<button type="button" data-fc-action="train" data-fc-role="winder">Train winding specialist · $45, 3 hours</button>',
  '<h4>Production order requisition</h4>',
  '<p>Choose a real order to compare its remaining production needs against the factory bins. This report is free to inspect and does not reserve or create supplies.</p>',
  '<label>Order <select id="fcOrder"></select></label>',
  '<p id="fcPlan"></p>',
  '<button type="button" id="fcBuy" data-fc-action="requisition">Buy this order’s missing raw materials · 5 min</button>',
  '<p id="fcMessage" role="status" aria-live="polite"></p>'
 ].join('');
 workshop.appendChild(section);
 section.querySelector('#fcOrder').addEventListener('change',render);
 section.addEventListener('click',e=>{
  const button=e.target.closest('[data-fc-action]');
  if(!button||button.disabled||typeof S==='undefined'||!S.componentWorks)return;
  const action=button.dataset.fcAction;
  const options={role:button.dataset.fcRole||null,orderId:section.querySelector('#fcOrder').value};
  const sequence=(S.componentTransactionSequence||0)+1,token='cw:'+sequence;
  button.disabled=true;
  try{
   const result=engine.transact(S,action,options,token,
    (seconds,away)=>root.advanceWorkshopTime(seconds,away),()=>{
     S.componentTransactionSequence=Math.max(S.componentTransactionSequence||0,sequence);
     return root.finishWorkshopClosingBell();
    });
   section.querySelector('#fcMessage').textContent=result.ok?result.message:result.reason;
   if(result.ok&&!result.repeated){
    S.componentTransactionSequence=Math.max(S.componentTransactionSequence||0,sequence);
    save(true);
   }
  }catch(err){section.querySelector('#fcMessage').textContent='Factory expansion error: '+String(err.message||err).slice(0,180)}
  finally{render()}
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 setup();
 const panel=document.getElementById('factoryExpansion');if(!panel)return;
 const active=!!S.componentWorks&&S.characterRoute==='industrialist';
 panel.hidden=!active;
 if(!active)return;
 const state=engine.read(S),clock=root.FE_WASHINGTON_TIME?.now?.(S),date=clock?.date||S.gameDate;
 const weekday=date?new Date(date+'T12:00:00Z').getUTCDay():0;
 const allowed=S.currentLocation?.locationId==='factory'&&S.phase==='day'&&!S.paused&&
  weekday>0&&weekday<6&&clock?.minuteOfDay>=540&&clock?.minuteOfDay<1020;
 const staff=state.staff,payroll=state.payroll;
 const weekly=Object.keys(engine.ROLES).reduce((sum,id)=>sum+staff[id].count*engine.ROLES[id].weeklyCents,0);
 panel.querySelector('#fcBalance').textContent='Company $'+(+S.companyCash||0).toFixed(2)+
  ' · extra specialists $'+(weekly/100).toFixed(2)+' weekly'+
  ' · wages owed $'+(payroll.owedCents/100).toFixed(2)+
  (allowed?' · Charlie is at the factory':' · Visit the factory during the weekday shift to authorize purchases.');
 for(const id of ['bench','winder']){
  const r=staff[id],rate=engine.ROLES[id],upgraded=r.count>=1&&state.machines[id]>=2;
  const sample=id==='bench'?'switch-contact':'insulated-wire';
  panel.querySelector('#fc'+(id==='bench'?'Bench':'Winder')).textContent=
   (r.count?'One paid '+rate.label:'No additional specialist')+
   ' · '+state.machines[id]+' machine(s) · '+(r.trained?'advanced training completed':'basic competency')+
   ' · '+(upgraded?'Enhanced production: ':'Standard production: ')+
   works.unitMinutes(S.componentWorks,sample)+' min per '+works.PRODUCTS[sample].name+'.';
 }
 const selector=panel.querySelector('#fcOrder'),selected=selector.value;
 const orders=S.componentWorks.orders.filter(o=>o.made<o.quantity&&works.PRODUCTS[o.productId]);
 const ids=new Set(orders.map(o=>o.id));
 selector.replaceChildren();
 for(const o of orders){
  const opt=document.createElement('option');opt.value=o.id;
  opt.textContent=o.id+' · '+works.PRODUCTS[o.productId].name+' · '+(o.quantity-o.made)+' left · '+o.deadline;
  selector.appendChild(opt);
 }
 if(ids.has(selected))selector.value=selected;
 const quote=selector.value?engine.quoteOrder(S,selector.value):{ok:false,reason:'No unfinished production orders.'};
 panel.querySelector('#fcPlan').textContent=quote.ok?
  'Estimated remaining workshop time '+quote.estimatedWorkMinutes+' min ('+quote.minutesPerUnit+' min/unit)'+
  ' · missing: '+(Object.keys(quote.shortages).length?
   Object.entries(quote.shortages).map(([id,qty])=>qty+' '+works.MATERIALS[id].name).join(', '):'none')+
  ' · purchase cost $'+(quote.costCents/100).toFixed(2)+'. '+quote.note:quote.reason;
 for(const button of panel.querySelectorAll('[data-fc-action]')){
  const action=button.dataset.fcAction,id=button.dataset.fcRole;
  let can=allowed;
  if(action==='hire')can=can&&!staff[id].count;
  if(action==='equipment')can=can&&state.machines[id]<2;
  if(action==='train')can=can&&staff[id].count>0&&!staff[id].trained;
  if(action==='requisition')can=can&&quote.ok&&Object.keys(quote.shortages).length>0;
  button.disabled=!can;
 }
}
root.FE_FACTORY_CAPACITY_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
