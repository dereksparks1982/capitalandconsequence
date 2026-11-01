/* Non-modal, text-only alerts. Needs never reveal fast-travel options or
 * replace the existing Washington map, room menu, or time banner. */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let toast=null,timer=null;
function element(){
 if(toast)return toast;
 toast=document.createElement('aside');toast.id='characterNeedsNotice';
 toast.className='character-needs-notice';toast.hidden=true;
 toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
 toast.setAttribute('aria-label','Character condition notice');
 document.body.appendChild(toast);return toast;
}
function notify(events){
 if(!Array.isArray(events)||!events.length||document.hidden)return;
 const lines=events.filter(e=>typeof e?.text==='string').map(e=>e.text);
 if(!lines.length)return;
 const el=element();
 el.replaceChildren();
 const header=document.createElement('strong');header.textContent='PERSONAL CONDITION';
 el.append(header);
 for(const line of lines){
  const p=document.createElement('p');p.textContent=line;el.append(p);
 }
 el.hidden=false;clearTimeout(timer);
 timer=setTimeout(()=>{el.hidden=true;},13000);
}
function render(save){
 const service=root.FE_CHARACTER_NEEDS,state=save?.characterNeeds;
 if(!service||!state)return;
 const meters=state.meters||{};
 const text='Hunger: '+Math.round(meters.hunger??0)+'/100 · Thirst: '+
  Math.round(meters.thirst??0)+'/100 · Energy: '+Math.round(meters.energy??0)+'/100';
 const desk=document.getElementById('careerDeskNeeds');
 if(desk)desk.textContent=text;
 const factory=document.getElementById('cityRoomBreakNeeds');
 if(factory)factory.textContent=text;
}
function close(){if(toast)toast.hidden=true;clearTimeout(timer);}
root.FE_CHARACTER_NEEDS_UI=Object.freeze({notify,render,close});
})(typeof window!=='undefined'?window:globalThis);
