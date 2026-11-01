/* In-world District General medical reception: no travel shortcuts or remote healing. */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let host=null;
function render(save,handlers){
 const overlay=document.getElementById('cityRoomOverlay');
 const p=root.FE_CITY?.currentLocation?.();
 if(!overlay||!p)return;
 if(!host){
  host=document.createElement('section');host.id='districtMedicalReception';
  host.className='sheet medical-reception';host.hidden=true;
  host.innerHTML='<h4>District General · Medical Reception</h4>'+
   '<p>A physician may examine and treat injuries. Care takes time and is paid from personal money. Serious conditions may require further recovery.</p>'+
   '<p id="medicalCondition"></p><p id="medicalFunds"></p>'+
   '<button type="button" data-medical-service="exam">Physician Examination · 15 min · $2.00</button> '+
   '<button type="button" data-medical-service="treat">Medical Treatment · 45 min · $8.00</button>'+
   '<p id="medicalStatus" role="status" aria-live="polite"></p>';
  const placeholder=overlay.querySelector('.city-room-placeholder');
  if(placeholder)placeholder.prepend(host);
  host.addEventListener('click',event=>{
   const btn=event.target.closest('button[data-medical-service]');
   if(!btn||btn.disabled||!host._handlers)return;
   const action=btn.dataset.medicalService;
   const result=host._handlers(action);
   host.querySelector('#medicalStatus').textContent=result?.message||'Medical service unavailable.';
   if(result?.ok)render(save,handlers);
  });
 }
 const eligible=p.locationId==='governmentHospital'&&p.roomId==='reception'&&!root.FE_CITY?.isDevRoom?.()&&!!handlers;
 host.hidden=!eligible||overlay.hidden;
 if(!eligible)return;
 host._handlers=handlers;
 const needs=root.FE_CHARACTER_NEEDS?.ensure?.(save);
 const health=needs?.meters.health??100;
 host.querySelector('#medicalCondition').textContent='Health: '+Math.round(health)+'/100. '+(health<50?'Treatment is advisable.':'Condition stable.');
 host.querySelector('#medicalFunds').textContent='Personal cash: $'+Number(save.personalCash||0).toFixed(2);
 const busy=save.paused||save.phase==='report';
 host.querySelector('[data-medical-service="exam"]').disabled=busy||save.personalCash<2;
 host.querySelector('[data-medical-service="treat"]').disabled=busy||save.personalCash<8||health>=100;
}
root.FE_MEDICAL=Object.freeze({render});
})(typeof window!=='undefined'?window:globalThis);
