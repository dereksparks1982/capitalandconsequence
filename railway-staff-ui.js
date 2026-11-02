/* Optional real rail workers, shown inside the existing company rail tools. */
(function(root){
'use strict';
const staff=root.FE_RAIL_STAFF;
if(!staff)throw Error('Railway employment engine must load before staff controls.');
const get=id=>document.getElementById(id),el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function mount(){
 const host=get('railCompanyPanel');if(!host||get('railCompanyStaffPanel'))return;
 const p=el('section');p.id='railCompanyStaffPanel';
 p.setAttribute('aria-label','Railway engineer, conductor and payroll');
 p.innerHTML='<h4>Railway Crew · Appointments & Wages</h4>'+
 '<p>Optional hired specialists reduce wear on real company trains. They require signing costs and Saturday wages; employment is not a free upgrade.</p>'+
 '<p id="railCompanyStaffStatus"></p><div id="railCompanyStaffButtons"></div>'+
 '<p id="railCompanyStaffNotice" role="status" aria-live="polite"></p>';
 host.appendChild(p);
 p.addEventListener('click',e=>{
  const btn=e.target.closest('[data-rail-hire]');
  if(!btn||btn.disabled||typeof S==='undefined')return;
  const role=btn.dataset.railHire,date=root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;
  const q=staff.preview(S,role,date);
  if(!q.ok){get('railCompanyStaffNotice').textContent=q.reason;return;}
  btn.disabled=true;const spent=root.advanceWorldTime(q.seconds,true);
  if(spent!==q.seconds){get('railCompanyStaffNotice').textContent='The appointment was interrupted; no hiring charge made.';render();return;}
  const seq=(S.railStaffHiringSequence||0)+1;
  const outcome=staff.hire(S,{role,date,spentSeconds:spent,token:'railstaff:'+seq});
  if(outcome.ok&&!outcome.repeated){S.railStaffHiringSequence=seq;save(true);}
  get('railCompanyStaffNotice').textContent=outcome.ok?outcome.message:outcome.reason;
  render();root.FE_RAIL_COMPANY_UI?.render?.();
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 mount();
 const parent=get('railCompanyStaffPanel');if(!parent)return;
 const info=staff.current(S),where=root.FE_WASHINGTON_TIME?.now?.(S);
 get('railCompanyStaffStatus').textContent='Company rail wages unpaid $'+(info.arrearsCents/100).toFixed(2)+
  ' · wages paid to date $'+(info.paidCents/100).toFixed(2)+
  ' · last Saturday payroll '+(info.lastPayrollDate||'not started')+'.';
 const slots=get('railCompanyStaffButtons');slots.replaceChildren();
 for(const [role,job] of Object.entries(staff.JOBS)){
  if(info[role]?.hired){
   slots.appendChild(el('p',job.title+' · hired '+info[role].since+
    ' · weekly wages $'+(job.wageCents/100).toFixed(2)+
    ' · '+(role==='engineer'?'reduces locomotive wear':'reduces track wear')+'.'));
   continue;
  }
  const button=el('button','Hire '+job.title+' · $'+(job.hireCents/100).toFixed(2)+
   ' · '+job.minutes+' min');
  button.type='button';button.dataset.railHire=role;
  const pre=staff.preview(S,role,where?.date||S.gameDate);
  button.disabled=!pre.ok;button.title=pre.reason||'';
  slots.appendChild(button);
 }
}
root.FE_RAIL_STAFF_UI=Object.freeze({mount,render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mount();render()},{once:true});
 else {mount();render();}
}
})(typeof window!=='undefined'?window:globalThis);
