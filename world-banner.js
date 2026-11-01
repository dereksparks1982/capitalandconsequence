/* Capital & Consequence: one world clock, visible on every map and location.
 * A scene displays the live executive-desk state, never another independent
 * clock or autonomous world simulation. Animated travel has a temporary
 * read-only clock projection; the authoritative journey is charged ONCE
 * by FE_TRAVEL after the route finishes.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);
const fields=[
 ['phaseName','Phase'],['businessDate','Washington date'],
 ['dayClock','Local time'],['washingtonSky','Weather'],
 ['marketStatus','Exchange status'],
 ['headerCompanyCash','Company cash'],['headerPersonalCash','Personal cash']
];
const activeBars=[],mounts=[];
let travel=null;
function create(place){
 const bar=document.createElement('div');
 bar.className='cc-world-banner';
 bar.setAttribute('role','group');
 bar.setAttribute('aria-label','Washington world status, persistent digital clock');
 const rows=document.createElement('div');rows.className='cc-world-banner-rows';
 const topRow=document.createElement('div');topRow.className='cc-world-banner-items cc-world-banner-row cc-world-banner-row--primary';
 const bottomRow=document.createElement('div');bottomRow.className='cc-world-banner-items cc-world-banner-row cc-world-banner-row--secondary';
 const primaryFields=new Set(['phaseName','businessDate','dayClock','washingtonSky']);
 const refs={};
 for(const [id,label] of fields){
  const item=document.createElement('div');
  item.className='cc-world-banner-item cc-world-'+id;
  const name=document.createElement('b');name.textContent=label;
  const value=document.createElement('span');
  value.className='cc-world-banner-value';
  value.setAttribute('data-world-copy',id);
  item.append(name,value);(primaryFields.has(id)?topRow:bottomRow).appendChild(item);
  refs[id]=value;
 }
 const pause=document.createElement('button');
 pause.type='button';pause.textContent='PAUSE';pause.className='cc-world-pause';
 pause.title='Pause or resume the Washington world clock';
 pause.addEventListener('click',()=>{
  if(travel){return;}
  const original=$('pauseToggle');
  if(original&&!original.disabled)original.click();
  sync();
 });
 bottomRow.appendChild(pause);
 rows.append(topRow,bottomRow);bar.appendChild(rows);
 const condition=document.createElement('div');condition.className='cc-world-condition';
 const needs={};
 for(const [key,label] of [['health','Health'],['hunger','Hunger'],['thirst','Thirst'],['energy','Energy']]){
  const item=document.createElement('div');item.className='cc-world-condition-item';
  const heading=document.createElement('b');heading.textContent=label;
  const meter=document.createElement('progress');meter.max=100;meter.value=100;
  meter.setAttribute('aria-label',label);
  const output=document.createElement('span');output.textContent='100';
  item.append(heading,meter,output);condition.append(item);needs[key]={meter,output};
 }
 bar.append(condition);
 const notice=document.createElement('p');
 notice.className='cc-world-travel-notice';notice.hidden=true;
 notice.setAttribute('role','status');notice.setAttribute('aria-live','off');
 bar.appendChild(notice);
 return {bar,refs,pause,notice,place,needs};
}
function init(){
 const map=$('titleMapViewer')?.querySelector('.title-map-card');
 const room=$('cityRoomOverlay')?.querySelector('.city-room-shell');
 if(map&&!map.querySelector('.cc-world-banner')){
  const entry=create('map');map.classList.add('cc-world-banner-layout');map.prepend(entry.bar);
  activeBars.push(entry);mounts.push(map);
 }
 if(room&&!room.querySelector('.cc-world-banner')){
  const entry=create('room');room.prepend(entry.bar);
  activeBars.push(entry);mounts.push(room);
 }
 sync();
}
function copyWeather(target,source){
 target.replaceChildren();
 if(!source||source.hidden){target.textContent='';return;}
 // Share the status markup without reusing any original element IDs.
 for(const child of source.childNodes){
  const copy=child.cloneNode(true);
  if(copy.nodeType===1){
   copy.removeAttribute('id');
   copy.querySelectorAll?.('[id]').forEach(el=>el.removeAttribute('id'));
  }
  target.append(copy);
 }
 if(!target.textContent.trim()&&!target.children.length)target.textContent='Weather';
}
function projectClock(startIso,elapsedMinutes){
 const match=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(startIso||'');
 if(!match)return null;
 const ms=Date.UTC(+match[1],+match[2]-1,+match[3],+match[4],+match[5]);
 const date=new Date(ms+Math.max(0,Math.floor(elapsedMinutes))*60000);
 if(!Number.isFinite(+date))return null;
 const hh=date.getUTCHours(),mm=String(date.getUTCMinutes()).padStart(2,'0');
 const day=['SUN','MON','TUES','WED','THUR','FRI','SAT'][date.getUTCDay()];
 const month=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][date.getUTCMonth()];
 return {time:String(hh%12||12)+':'+mm+(hh>=12?' PM':' AM'),
  date:day+', '+month+' '+date.getUTCDate()+', '+date.getUTCFullYear()};
}
function sync(){
 if(!activeBars.length)return;
 for(const panel of activeBars){
  for(const [id] of fields){
   const source=$(id),target=panel.refs[id];
   if(id==='washingtonSky'){copyWeather(target,source);continue;}
   target.textContent=source?.textContent?.trim()||'—';
  }
  for(const key of ['health','hunger','thirst','energy']){
   const original=$('condition-'+key);
   const source=original?Number(original.value):100;
   const percent=Math.max(0,Math.min(100,Number.isFinite(source)?source:100));
   const copy=panel.needs[key];
   copy.meter.value=percent;copy.meter.classList.toggle('low',percent<=30);
   copy.output.textContent=Math.round(percent)+'/100';
  }
  panel.pause.textContent=$('pauseToggle')?.textContent?.trim()||'PAUSE';
  panel.pause.disabled=!!travel||!!$('pauseToggle')?.disabled;
  panel.pause.setAttribute('aria-pressed',$('pauseToggle')?.getAttribute('aria-pressed')||'false');
  panel.notice.hidden=!travel;
  if(travel){
   const projection=projectClock(travel.departedIso,travel.elapsed);
   if(projection){
    panel.refs.dayClock.textContent=projection.time;
    panel.refs.businessDate.textContent=projection.date;
   }
   panel.notice.textContent=travel.label+' · '+travel.percent+'% · '+
    travel.remaining+' game minutes remaining';
  }
 }
}
function beginTrip({departedIso,minutes,from,to,mode}={}){
 if(travel)return false;
 if(typeof departedIso!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(departedIso)||
  !Number.isSafeInteger(minutes)||minutes<1||minutes>1440)return false;
 travel={departedIso,minutes,elapsed:0,remaining:minutes,percent:0,
  label:'Traveling '+(mode||'on foot')+' · '+(from||'Origin')+' to '+(to||'Destination')};
 sync();return true;
}
function progress(fraction){
 if(!travel)return;
 const pct=Math.max(0,Math.min(1,Number(fraction)||0));
 travel.elapsed=Math.min(travel.minutes,Math.floor(travel.minutes*pct));
 travel.remaining=travel.minutes-travel.elapsed;
 travel.percent=Math.floor(pct*100);
 sync();
}
function finishTrip(){
 travel=null;sync();
}
const api=Object.freeze({init,sync,beginTrip,progress,finishTrip,projectClock,
 get traveling(){return !!travel;}});
root.FE_WORLD_BANNER=api;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(typeof window!=='undefined'?window:globalThis);
