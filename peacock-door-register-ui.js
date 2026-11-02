/* Eli Crowe's Golden Peacock parcel register and actual shift reports. */
(function(root){
'use strict';
const api=root.FE_PEACOCK_DOOR_REGISTER;
if(!api)throw Error('Door register engine is not loaded.');
const get=id=>document.getElementById(id);
const location=()=>root.FE_CITY?.currentLocation?.()||{};
function mount(){
 const desk=get('doormanDoorPanel');
 if(!desk||get('peacockDoorRegisterPanel'))return;
 const panel=document.createElement('section');panel.id='peacockDoorRegisterPanel';
 panel.className='doorman-work-box';panel.setAttribute('aria-label','Nightclub entrance custody and work records');
 panel.innerHTML='<h4>Door Book · Deliveries & Shift Record</h4>'+
 '<p>Accepted parcels remain Eli’s responsibility until handed to the floor manager. Unverified contents never become usable inventory.</p>'+
 '<p id="pdrStatus"></p><div id="pdrParcels"></div>'+
 '<button type="button" id="pdrNightReport" data-pdr-action="report">Submit the completed four-contact night report · 5 min</button>'+
 '<h4>Filed door reports</h4><div id="pdrReports"></div>'+
 '<p id="pdrNotice" role="status" aria-live="polite"></p>';
 desk.appendChild(panel);
 panel.addEventListener('click',ev=>{
  const button=ev.target.closest('[data-pdr-action]');
  if(!button||button.disabled||typeof S==='undefined')return;
  const where=location(),args={
   kind:button.dataset.pdrAction,parcelId:button.dataset.pdrId||null,
   date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate,
   locationId:where.locationId,roomId:where.roomId
  };
  const allow=api.preview(S,args);
  if(!allow.ok){get('pdrNotice').textContent=allow.reason;return;}
  if(S.dayRemaining<=allow.seconds||root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=allow.seconds){
   get('pdrNotice').textContent='Not enough night shift time remains for this report.';return;
  }
  const paid=root.advanceWorldTime(allow.seconds,true);
  if(paid!==allow.seconds){get('pdrNotice').textContent='Game time was not charged; no record made.';return;}
  const seq=(S.peacockDoorTransactionSequence||0)+1,token='doorbook:'+seq;
  const result=api.transact(S,{...args,token,spentSeconds:paid});
  if(result.ok&&!result.repeated){S.peacockDoorTransactionSequence=seq;save(true);}
  get('pdrNotice').textContent=result.ok?result.message:result.reason;
  render();root.FE_DOORMAN_UI?.refresh?.();
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 mount();
 const panel=get('peacockDoorRegisterPanel');if(!panel)return;
 const where=location(),active=S.characterRoute==='criminal'&&where.locationId==='secondNightclub'&&
  where.roomId==='doorman-post'&&!get('doormanDoorPanel')?.hidden;
 panel.hidden=!active;if(!active)return;
 const state=api.read(S),date=root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;
 const pending=Object.values(state.parcels).filter(x=>x.status==='held-at-door');
 get('pdrStatus').textContent=state.events.length+' paid contacts recorded · '+pending.length+
  ' wrapped parcels still at the entrance · '+Object.keys(state.shiftReports).length+' submitted reports.';
 const rows=get('pdrParcels');rows.replaceChildren();
 for(const item of Object.values(state.parcels).slice(-20)){
  const row=document.createElement('p');
  row.textContent=item.id+' · '+item.description+' · '+item.status+' · chain entries '+item.chain.length+'. ';
  if(item.status==='held-at-door'){
   const b=document.createElement('button');b.type='button';
   b.textContent='Hand to floor manager · 5 min';b.dataset.pdrAction='handover';b.dataset.pdrId=item.id;
   const check=api.preview(S,{kind:'handover',parcelId:item.id,date,
    locationId:where.locationId,roomId:where.roomId});
   b.disabled=!check.ok;b.title=check.reason||'';row.appendChild(b);
  }
  rows.appendChild(row);
 }
 if(!Object.keys(state.parcels).length)rows.textContent='No physical deliveries have been taken into custody.';
 const nightly=get('pdrNightReport');
 if(nightly){const c=api.preview(S,{kind:'report',date,locationId:where.locationId,roomId:where.roomId});
  nightly.disabled=!c.ok;nightly.title=c.reason||'';}
 const reports=get('pdrReports');reports.replaceChildren();
 for(const r of Object.values(state.shiftReports).slice(-6).reverse()){
  const p=document.createElement('p');p.textContent=r.date+' · '+r.contacts+' documented contacts · '+
   r.requestsForManager+' referrals · '+r.tenseContacts+' complaints · '+
   r.untransferredParcels.length+' parcels outstanding when filed · '+r.status+
   ' · No automatic promotion.';reports.appendChild(p);
 }
 if(!Object.keys(state.shiftReports).length)reports.textContent='No completed four-contact night reports yet.';
}
root.FE_PEACOCK_DOOR_REGISTER_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
