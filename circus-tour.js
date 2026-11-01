/* Public traveling circus: date-scoped event, visible to ALL players when
 * actually in town. Dates/site are supplied by an in-world event, never
 * guessed or permanently painted on the approved printed map.
 */
(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg';
let icon=null;
const minute=save=>Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.circusTour||save.circusTour.version!==1)
  save.circusTour={version:1,engagement:null,attendance:[]};
 if(!Array.isArray(save.circusTour.attendance))save.circusTour.attendance=[];
 return save.circusTour;
}
function schedule(save,{id,startMinute,endMinute,locationId,name='The Traveling Circus'}={}){
 const list=root.FederalElectricCity?.listLocations?.()||[];
 if(typeof id!=='string'||!id||!Number.isSafeInteger(startMinute)||
  !Number.isSafeInteger(endMinute)||endMinute<=startMinute||
  typeof locationId!=='string'||!list.some(x=>x.id===locationId))
  return {ok:false,reason:'Circus needs a real dated engagement at a registered Washington location.'};
 const data=ensure(save);
 data.engagement={id:id.slice(0,100),startMinute,endMinute,locationId,name:String(name).slice(0,100)};
 return {ok:true,engagement:data.engagement};
}
function active(save){
 const now=minute(save),event=ensure(save)?.engagement;
 if(now===null||!event||now<event.startMinute||now>=event.endMinute)return null;
 return event;
}
function attended(save){
 const event=active(save);
 return !!event&&(ensure(save).attendance||[]).some(x=>x.id===event.id);
}
function attend(save,id){
 const event=active(save),now=minute(save);
 if(!event||id!==event.id)return {ok:false,reason:'There is no active circus performance to attend.'};
 if(save.currentLocation?.locationId!==event.locationId)return {ok:false,reason:'You must actually visit the circus.'};
 if(attended(save))return {ok:false,reason:'Already attended this engagement.'};
 ensure(save).attendance.push({id:event.id,minute:now,locationId:event.locationId});
 return {ok:true,event};
}
function clear(){if(icon){icon.remove();icon=null}}
function render(save,viewport,project,visible,onVisit){
 clear();
 const event=active(save);
 if(!visible||!event||!viewport||typeof project!=='function')return false;
 const pin=root.FE_NPC_MAP_PIN?.(event.locationId);
 if(!pin)return false; // No fabricated coordinates.
 let at;try{at=project(pin)}catch(e){return false}
 if(!at||!Number.isFinite(at.x)||!Number.isFinite(at.y))return false;
 const button=document.createElement('button');
 button.type='button';button.className='cc-circus-map-token';
 button.setAttribute('aria-label',event.name+' is in town. Open location card.');
 button.title=event.name+' · now performing in Washington';
 button.textContent='🎪';
 button.style.left=at.x+'px';button.style.top=at.y+'px';
 button.onclick=e=>{e.stopPropagation();if(typeof onVisit==='function')onVisit(event.locationId)};
 button.addEventListener('pointerdown',e=>e.stopPropagation());
 viewport.appendChild(button);icon=button;return true;
}
const api=Object.freeze({ensure,schedule,active,attended,attend,render,clear});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_CIRCUS_TOUR=api;
})(typeof window!=='undefined'?window:globalThis);
