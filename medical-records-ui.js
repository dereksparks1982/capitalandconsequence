/* Lightweight nineteenth-century case notes. One shared saved medical registry.
 * Only the active character's record is displayed: NPC records remain private.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeSave=null,resume=null,bedtime=null,book=null,emergency=null,sleepAction=null;
function paper(){
 if(book?.isConnected)return book;
 book=document.createElement('section');book.id='ccMedicalBook';book.className='cc-medical-book';book.hidden=true;
 book.setAttribute('role','dialog');book.setAttribute('aria-modal','true');
 book.setAttribute('aria-label','Private medical file');
 book.innerHTML='<div class="cc-medical-paper"><button type="button" class="cc-medical-close" aria-label="Close medical file">×</button><small>WASHINGTON DISTRICT · MEDICAL REGISTRY</small><h2>Personal Medical File</h2><div class="cc-medical-pages"></div></div>';
 book.querySelector('.cc-medical-close').onclick=()=>{book.hidden=true};
 document.body.append(book);return book;
}
function incident(){
 if(emergency?.isConnected)return emergency;
 emergency=document.createElement('section');emergency.id='ccMedicalEmergency';
 emergency.className='cc-medical-emergency';emergency.hidden=true;
 emergency.setAttribute('role','alertdialog');emergency.setAttribute('aria-modal','true');
 emergency.setAttribute('aria-label','Exhaustion collapse');
 emergency.innerHTML='<div class="cc-medical-paper"><small>WASHINGTON DISTRICT · URGENT MEDICAL EVENT</small><h2>Collapsed from Exhaustion</h2><p class="cc-medical-collapse-copy"></p><p class="cc-medical-collapse-cost"></p><button type="button" class="cc-medical-wake">Regain Consciousness</button></div>';
 emergency.querySelector('.cc-medical-wake').onclick=()=>{if(typeof resume==='function')resume()};
 document.body.append(emergency);return emergency;
}
function renderFile(){
 if(!activeSave)return;
 const registry=root.FE_MEDICAL_RECORDS;
 if(!registry)return;
 const record=registry.viewOwn(activeSave),rows=record.history.slice(-35).reverse();
 const status=record.severity==='normal'?'No diagnosed accumulated exhaustion':record.severity==='chronic'?'Recurring exhaustion': 'Severe accumulated exhaustion';
 const html='<p><b>Patient:</b> '+esc(record.name)+'</p>'+
  '<p><b>Condition:</b> '+esc(status)+' · <b>Collapse episodes:</b> '+record.collapses+
  ' · <b>Recent (7 days):</b> '+record.recentSevenDays+
  ' · <b>Energy limit:</b> '+record.energyCap+'/100</p>'+
  '<p><b>Unpaid medical charges:</b> $'+(record.unpaidCents/100).toFixed(2)+'</p>'+
  '<h3>Physician & Patient Notes</h3>'+
  (rows.length?rows.map(r=>'<article><b>'+esc(r.date||'Undated')+' · '+esc(r.kind.replace(/-/g,' '))+
   '</b><p>'+esc(r.locationId||'Unknown place')+(r.setting?' · '+esc(r.setting):'')+
   (r.description?' · '+esc(r.description):'')+'</p>'+
   (r.doctorFeeCents||r.hospitalFeeCents?'<p>Medical charge: $'+((r.doctorFeeCents||r.hospitalFeeCents)/100).toFixed(2)+'</p>':'')+
   '</article>').join(''):'<p>No incidents have been recorded.</p>');
 paper().querySelector('.cc-medical-pages').innerHTML=html;
}
function open(){
 if(!activeSave)return false;
 renderFile();paper().hidden=false;paper().querySelector('.cc-medical-close').focus();
 return true;
}
function render(save,onWake,onSleep){
 activeSave=save;resume=onWake;bedtime=onSleep;
 const overlay=document.getElementById('cityRoomOverlay');
 const home=save?.currentLocation?.locationId==='home'&&
  save?.currentLocation?.roomId==='bedroom'&&save.phase==='night'&&
  !root.FE_MEDICAL_RECORDS?.pending?.(save);
 if(overlay){
  const holder=overlay.querySelector('.city-room-placeholder');
  if(holder&&!sleepAction){
   sleepAction=document.createElement('section');sleepAction.className='cc-home-sleep';sleepAction.hidden=true;
   sleepAction.innerHTML='<b>BEDROOM · NIGHT REST</b><p>Proper sleep restores Energy. Skipping the night elsewhere does not.</p><button type="button">Sleep Until 8 AM</button><p class="cc-sleep-status" role="status"></p>';
   holder.prepend(sleepAction);
   sleepAction.querySelector('button').addEventListener('click',()=>{
    const result=typeof bedtime==='function'?bedtime():{ok:false,reason:'Bedtime unavailable.'};
    sleepAction.querySelector('.cc-sleep-status').textContent=result?.reason||'';
   });
  }
  if(sleepAction)sleepAction.hidden=!home||overlay.hidden;
 }
 const event=root.FE_MEDICAL_RECORDS?.pending?.(save),popup=incident();
 if(!event){popup.hidden=true;return}
 const where={
  home:'You collapsed at home. When you regain consciousness, you will be on the floor, still exhausted. A proper bed is essential.',
  work:'Workers stopped what they were doing to attend to you. A physician was summoned and production was suspended.',
  street:'A passerby found you and summoned medical help. You were taken to the hospital.',
  danger:'You collapsed in a dangerous neighborhood. You were taken for treatment, but your possessions may not be intact.'
 }[event.setting]||'You collapsed from exhaustion.';
 popup.querySelector('.cc-medical-collapse-copy').textContent=where+
  ' Approximately '+event.minutesLost+' minutes will pass before you regain consciousness.';
 popup.querySelector('.cc-medical-collapse-cost').textContent=
  (event.feeCents?'Medical charge: $'+(event.feeCents/100).toFixed(2)+'. ':'')+
  (event.stolenCents?'Missing cash: $'+(event.stolenCents/100).toFixed(2)+'. ':'')+
  (event.owedCents?'Outstanding bill: $'+(event.owedCents/100).toFixed(2)+'. ':'')+
  'You cannot continue working until the episode is resolved.';
 popup.hidden=false;
 if(book)book.hidden=true;
}
root.FE_MEDICAL_UI=Object.freeze({render,open,renderFile});
})(typeof window!=='undefined'?window:globalThis);
