/* Federal Electric production office: queued supervised shifts, shared material
 * requisitions and an auditable production ledger. No new window geometry.
 */
(function(root){
'use strict';
const desk=root.FE_FACTORY_DISPATCH,works=root.FE_COMPONENT_WORKS;
if(!desk||!works)throw Error('Production office engine and component works required.');
function setup(){
 const parent=document.getElementById('componentWorkshop');
 if(!parent||document.getElementById('factoryProductionDesk'))return;
 const section=document.createElement('section');
 section.id='factoryProductionDesk';section.className='sheet factory-production-desk';
 section.innerHTML=[
  '<h3>Factory Production Office · Delegated Shifts</h3>',
  '<p>Assign a hired specialist to an actual open order. Only fitted, staffed stations can produce. Sullivan must be present. Each supervised shift advances Washington time and uses the existing warehouse, machinery and wages. No production occurs offline.</p>',
  '<p id="fdForecast"></p>',
  '<h4>Order priority</h4>',
  '<label>Open order <select id="fdOrder"></select></label> ',
  '<button type="button" data-fd="prioritize">Make first priority · 5 min</button>',
  '<h4>Staffed factory shift</h4>',
  '<label>Shift budget <select id="fdMinutes"><option value="60">1 hour</option><option value="120">2 hours</option><option value="180">3 hours</option><option value="240" selected>4 hours</option></select></label> ',
  '<button type="button" data-fd="run">Run next staffed lot · actual production minutes</button>',
  '<p>Jobs without enough materials or a qualified crew are skipped, never fabricated. Short shifts may complete fewer units than requested. The factory does not run past 5 PM.</p>',
  '<h4>Whole-queue raw material purchase</h4>',
  '<p id="fdShortages"></p>',
  '<button type="button" data-fd="procure">Buy shortages for all open orders · 15 min</button>',
  '<h4>Open manufacturing obligations</h4><div id="fdQueue"></div>',
  '<h4>Recent factory transactions</h4><div id="fdLedger"></div>',
  '<p id="fdMessage" role="status" aria-live="polite"></p>'
 ].join('');
 parent.appendChild(section);
 section.addEventListener('click',e=>{
  const button=e.target.closest('[data-fd]');
  if(!button||button.disabled||typeof S==='undefined'||!S.componentWorks)return;
  const kind=button.dataset.fd,details={
   orderId:section.querySelector('#fdOrder').value,
   minutes:Number(section.querySelector('#fdMinutes').value)
  };
  const seq=(S.componentTransactionSequence||0)+1,token='cw:'+seq;
  button.disabled=true;
  try{
   const result=desk.transact(S,kind,details,token,
    (seconds,away)=>root.advanceWorkshopTime(seconds,away),()=>{
     S.componentTransactionSequence=Math.max(S.componentTransactionSequence||0,seq);
     return root.finishWorkshopClosingBell();
    });
   section.querySelector('#fdMessage').textContent=result.ok?result.message:result.reason;
   if(result.ok&&!result.repeated){
    S.componentTransactionSequence=Math.max(S.componentTransactionSequence||0,seq);
    save(true);
   }
  }catch(err){section.querySelector('#fdMessage').textContent='Production desk action failed: '+String(err.message||err).slice(0,180)}
  finally{render()}
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 setup();
 const panel=document.getElementById('factoryProductionDesk');if(!panel)return;
 const active=!!S.componentWorks&&S.characterRoute==='industrialist';
 panel.hidden=!active;if(!active)return;
 const forecast=desk.forecast(S),queue=forecast.orders;
 const selected=panel.querySelector('#fdOrder'),before=selected.value;
 selected.replaceChildren();
 for(const job of queue){
  const option=document.createElement('option');option.value=job.id;
  option.textContent=job.id+' · '+job.name+' · '+job.remaining+' pending · '+job.deadline;
  selected.appendChild(option);
 }
 if(queue.some(job=>job.id===before))selected.value=before;
 const clock=root.FE_WASHINGTON_TIME?.now?.(S);
 const dow=clock?new Date(clock.date+'T12:00:00Z').getUTCDay():0;
 const valid=!!clock&&dow>0&&dow<6&&clock.minuteOfDay>=540&&clock.minuteOfDay<1020&&
  !S.paused&&S.phase==='day'&&S.currentLocation?.locationId==='factory';
 panel.querySelector('#fdForecast').textContent=queue.length+' active orders · '+forecast.overdue+
  ' past due · estimated work '+forecast.estimatedMinutes+' min · theoretical outstanding invoice $'+
  (forecast.potentialInvoiceCents/100).toFixed(2)+' · bench/winder specialists $'+
  (forecast.specialistWeeklyCents/100).toFixed(2)+' weekly. '+forecast.note;
 const shortages=Object.entries(forecast.shortages);
 panel.querySelector('#fdShortages').textContent=shortages.length?
  shortages.map(([id,n])=>n+' '+works.MATERIALS[id].name).join(', ')+
  ' · combined purchase $'+(forecast.costCents/100).toFixed(2):
  'No shared raw-material shortages across the current order queue.';
 const list=panel.querySelector('#fdQueue');list.replaceChildren();
 if(!queue.length)list.textContent='No unfinished component, District or Fair manufacturing orders.';
 for(const job of queue){
  const p=document.createElement('p');
  p.textContent=job.id+' · '+job.name+' → '+job.customer+' · '+job.remaining+' to manufacture · '+
   job.minutesPerUnit+' min/attempt · '+job.possibleNow+' units supported by present materials · '+
   'delivery '+job.deadline+(job.due?' (OVERDUE)':'')+
   (job.staffed?' · qualified crew ready':' · no paired paid specialist and machine')+
   (!job.enabled?' · technology or licensing locked':'');
  list.appendChild(p);
 }
 const ledger=panel.querySelector('#fdLedger');ledger.replaceChildren();
 const recent=(S.componentWorks.ledger||[]).slice(-8).reverse();
 if(!recent.length)ledger.textContent='No component works transactions recorded yet.';
 for(const receipt of recent){
  const p=document.createElement('p');
  const amount=receipt.revenueCents??receipt.incomeCents??0;
  p.textContent=(receipt.date||'Undated')+' · '+(receipt.kind||'workshop')+
   (receipt.productId?' · '+works.PRODUCTS[receipt.productId]?.name:'')+
   (receipt.orderId?' · '+receipt.orderId:'')+
   (receipt.delegated?' · delegated':'')+
   (receipt.goodUnits!==undefined?' · '+receipt.goodUnits+' accepted'+(receipt.rejectedUnits?', '+receipt.rejectedUnits+' rejected':''):'')+
   (amount?' · received $'+(amount/100).toFixed(2):'')+
   (receipt.costCents?' · spent $'+(receipt.costCents/100).toFixed(2):'');
  ledger.appendChild(p);
 }
 for(const button of panel.querySelectorAll('[data-fd]')){
  const action=button.dataset.fd;
  let enabled=valid;
  if(action==='prioritize')enabled=enabled&&!!selected.value&&desk.state(S).priority[0]!==selected.value;
  if(action==='procure')enabled=enabled&&shortages.length>0&&forecast.costCents<=forecast.cashCents;
  if(action==='run')enabled=enabled&&queue.some(job=>job.staffed&&job.enabled&&job.possibleNow>0);
  button.disabled=!enabled;
 }
}
root.FE_FACTORY_DISPATCH_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
