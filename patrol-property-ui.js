/* Metropolitan Police property desk; inside Sam's existing duty book.
 * All actions require station access and use the same saved Washington clock.
 */
(function(root){
'use strict';
const logic=root.FE_PATROL_PROPERTY;
if(!logic)throw Error('Patrol property engine must load before its station desk.');
const get=id=>document.getElementById(id);
const place=()=>root.FE_CITY?.currentLocation?.()||{};
function mount(){
 const parent=get('patrolDutyDesk');
 if(!parent||get('patrolPropertyDesk'))return;
 const panel=document.createElement('section');panel.id='patrolPropertyDesk';panel.className='patrol-duty-box';
 panel.setAttribute('aria-label','Metropolitan Police lost property register');
 panel.innerHTML='<h4>Lost Property · Station Register</h4>'+
  '<p>Only property actually taken into custody on the Hillsdale beat can be sealed, inspected and handed to the station clerk. A witness account does not create an item.</p>'+
  '<p id="patrolPropertyStatus"></p><div id="patrolPropertyRows"></div>'+
  '<p id="patrolPropertyNotice" role="status" aria-live="polite"></p>';
 parent.appendChild(panel);
 panel.addEventListener('click',ev=>{
  const btn=ev.target.closest('[data-property-kind]');
  if(!btn||btn.disabled||typeof S==='undefined')return;
  const kind=btn.dataset.propertyKind,id=btn.dataset.propertyId,where=place();
  const args={id,kind,date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate,
   locationId:where.locationId,roomId:where.roomId};
  const allowed=logic.preview(S,args);
  if(!allowed.ok){get('patrolPropertyNotice').textContent=allowed.reason;return;}
  if(root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(S)<=allowed.seconds||
     S.dayRemaining<=allowed.seconds){
   get('patrolPropertyNotice').textContent='Not enough time remains for five minutes of property paperwork.';
   return;
  }
  const spent=root.advanceWorldTime(allowed.seconds,true);
  if(spent!==allowed.seconds){get('patrolPropertyNotice').textContent='The Washington clock declined the property work.';return;}
  const seq=(S.patrolPropertySequence||0)+1,token='prop:'+seq;
  const result=logic.manage(S,{...args,token,spentSeconds:spent});
  if(result.ok&&!result.repeated){S.patrolPropertySequence=seq;save(true);}
  get('patrolPropertyNotice').textContent=result.ok?result.message:result.reason;
  render();
  root.FE_PATROL_UI?.refresh?.();
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 mount();
 const panel=get('patrolPropertyDesk');if(!panel)return;
 const active=S.characterRoute==='investigator'&&!!S.patrolDuty;
 panel.hidden=!active;if(!active)return;
 const data=logic.read(S),entries=Object.values(data.items).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
 const location=place(),date=root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;
 const station=location.locationId==='metropolitanPolice'&&location.roomId==='station-duty-room';
 get('patrolPropertyStatus').textContent=entries.length+' property records · '+
  entries.filter(x=>x.status==='station-intake').length+' awaiting clerk transfer · '+
  (station?'Station duty room':'Visit the station duty room to process property.');
 const rows=get('patrolPropertyRows');rows.replaceChildren();
 for(const item of entries.slice(0,40)){
  const box=document.createElement('section');box.className='patrol-property-record';
  const text=document.createElement('p');
  text.textContent=item.id+' · '+item.date+' · '+item.description+' · '+item.status+
   ' · '+(item.sealed?'sealed':'unsealed')+' · '+(item.inspected?'checked':'unchecked')+
   ' · '+item.chain.length+' custody entries.';
  box.appendChild(text);
  if(item.status==='station-intake')for(const [kind,label] of [
   ['seal','Seal property · 5 min'],['inspect','Inspect identification · 5 min'],
   ['transfer','Transfer to property clerk · 5 min']
  ]){
   const button=document.createElement('button');button.type='button';
   button.textContent=label;button.dataset.propertyKind=kind;button.dataset.propertyId=item.id;
   const check=logic.preview(S,{kind,id:item.id,date,locationId:location.locationId,roomId:location.roomId});
   button.disabled=!check.ok;button.title=check.ok?'':check.reason;
   box.appendChild(button);
  }
  rows.appendChild(box);
 }
 if(!entries.length)rows.textContent='No item has yet been taken into police custody and filed at the station.';
}
root.FE_PATROL_PROPERTY_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
