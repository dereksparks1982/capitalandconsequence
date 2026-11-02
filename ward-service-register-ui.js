/* District Asylum ordinary service register, shown only in the orderly station. */
(function(root){
'use strict';
const journal=root.FE_WARD_SERVICE_REGISTER;
if(!journal)throw Error('Ward service register must load before its staff controls.');
const el=id=>document.getElementById(id),at=()=>root.FE_CITY?.currentLocation?.()||{};
function mount(){
 const room=el('orderlyWardPanel');if(!room||el('wardServiceRegisterPanel'))return;
 const box=document.createElement('section');box.id='wardServiceRegisterPanel';
 box.className='doorman-work-box';
 box.setAttribute('aria-label','Orderly ward service and supply ledger');
 box.innerHTML='<h4>Ward Supplies & Shift Handover</h4>'+
 '<p>Only filed routine ward work enters this register. No patient medical files or administrator privileges are available here.</p>'+
 '<p id="wsrStatus"></p>'+
 '<button type="button" id="wsrHandover" data-wsr-action="handover">Submit completed three-round handover · 5 minutes</button>'+
 '<h4>Outstanding ward supply requests</h4><div id="wsrRequests"></div>'+
 '<h4>Recent handovers</h4><div id="wsrHistory"></div>'+
 '<p id="wsrNotice" role="status" aria-live="polite"></p>';
 room.appendChild(box);
 box.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-wsr-action]');
  if(!b||b.disabled||typeof S==='undefined')return;
  const p=at(),args={action:b.dataset.wsrAction,id:b.dataset.wsrId||null,
   date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate,
   locationId:p.locationId,roomId:p.roomId};
  const pre=journal.preview(S,args);
  if(!pre.ok){el('wsrNotice').textContent=pre.reason;return;}
  if(S.dayRemaining<=pre.seconds||root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=pre.seconds){
   el('wsrNotice').textContent='Not enough shift time to file this record.';return;
  }
  const seconds=root.advanceWorldTime(pre.seconds,true);
  if(seconds!==pre.seconds){el('wsrNotice').textContent='Washington time did not advance; no register entry was made.';return;}
  const number=(S.wardServiceReceiptSequence||0)+1,token='wardbook:'+number;
  const result=journal.transact(S,{...args,token,spentSeconds:seconds});
  if(result.ok&&!result.repeated){S.wardServiceReceiptSequence=number;save(true);}
  el('wsrNotice').textContent=result.ok?result.message:result.reason;
  render();root.FE_ORDERLY_UI?.refresh?.();
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 mount();
 const box=el('wardServiceRegisterPanel');if(!box)return;
 const room=at();
 const visible=S.characterRoute==='wardman'&&room.locationId==='blackwoodAsylum'&&room.roomId==='orderly-station'&&!el('orderlyWardPanel')?.hidden;
 box.hidden=!visible;if(!visible)return;
 const data=journal.read(S),date=root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;
 const outstanding=Object.values(data.requests).filter(x=>!x.received);
 el('wsrStatus').textContent=Object.keys(data.service).length+' actually filed services · '+
  outstanding.length+' unresolved supplies requests · '+
  Object.keys(data.handover).length+' shift handovers recorded.';
 const pre=journal.preview(S,{action:'handover',date,locationId:room.locationId,roomId:room.roomId});
 const handover=el('wsrHandover');
 handover.disabled=!pre.ok;handover.title=pre.reason||'';
 const list=el('wsrRequests');list.replaceChildren();
 for(const item of outstanding.slice(-25)){
  const section=document.createElement('section');
  const p=document.createElement('p');
  p.textContent=item.id+' · from actual assignment '+item.sourceId+' · '+item.created+
   ' · '+item.description+' · '+item.status+' · no supplies received.';
  section.appendChild(p);
  for(const [action,label] of [['followup','Ask stores for update · 5 min'],['escalate','Refer unresolved request to supervisor · 5 min']]){
   const b=document.createElement('button');b.type='button';b.textContent=label;
   b.dataset.wsrAction=action;b.dataset.wsrId=item.id;
   const can=journal.preview(S,{action,id:item.id,date,
    locationId:room.locationId,roomId:room.roomId});
   b.disabled=!can.ok;b.title=can.reason||'';
   section.appendChild(b);
  }
  list.appendChild(section);
 }
 if(!outstanding.length)list.textContent='No outstanding ward supplies requests in Edmund’s recorded assignments.';
 const history=el('wsrHistory');history.replaceChildren();
 for(const shift of Object.values(data.handover).slice(-7).reverse()){
  const p=document.createElement('p');p.textContent=shift.date+' · '+shift.services.length+
   ' filed services · '+shift.supplyRequests.length+' new supply requests · '+
   shift.status+' · supervisor decision not yet established.';
  history.appendChild(p);
 }
 if(!Object.keys(data.handover).length)history.textContent='No complete three-round shift handovers yet.';
}
root.FE_WARD_SERVICE_REGISTER_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
