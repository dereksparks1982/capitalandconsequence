/* The Big Top is an attended performance, not a synonym for buying
 * midway games. One ticket, one saved visit and one authoritative clock.
 * The listed acts are fictional 1878 Washington circus entertainment.
 */
(function(root){
'use strict';
const FEE_CENTS=20,DURATION_SECONDS=2700;
const TIMES=Object.freeze([12*60,15*60,19*60]);
const ACTS=Object.freeze([
 {name:'The High-Wire Sisters',description:'Two aerialists cross a swaying rope above the ring while the band falls silent.'},
 {name:'The Trick-Riding Horse',description:'A clever bay horse and its rider circle the sawdust ring with a practiced flourish.'},
 {name:'The Strongman',description:'A broad-shouldered strongman lifts an iron weight while the announcer challenges the crowd.'},
 {name:'The Clowns',description:'A pair of painted clowns tumble over a trunk, to the loud amusement of the cheap seats.'},
 {name:'The Ringmaster',description:'The ringmaster welcomes the crowd and promises wonders from every corner of the world.'}
]);
const number=v=>Number.isSafeInteger(v)?v:null;
function available(save){
 const circus=root.FE_CIRCUS_TOUR?.active?.(save);
 return circus&&save?.currentLocation?.locationId===circus.locationId?circus:null;
}
function minutesToday(t){return ((t%1440)+1440)%1440}
function slot(save){
 const event=available(save),time=number(save?.worldCalendar?.worldMinute);
 if(!event||time===null)return {ok:false,reason:'No circus show is here now.'};
 const today=minutesToday(time),next=TIMES.find(x=>today<=x);
 if(next===undefined)return {ok:false,reason:'The last performance is over. Return tomorrow.'};
 const start=time-today+next,finish=start+DURATION_SECONDS/60;
 if(start<event.startMinute||finish>event.endMinute)
  return {ok:false,reason:'There are no more performances before the circus departs.'};
 const key=event.id+'|'+start;
 if((save.circusPerformances||[]).some(x=>x.key===key&&x.completed))
  return {ok:false,reason:'You have already attended this performance.'};
 return {ok:true,event,start,finish,key,waitMinutes:start-time,feeCents:FEE_CENTS,
  durationSeconds:DURATION_SECONDS,description:'The Big Top · show at '+String(Math.floor(next/60)).padStart(2,'0')+':'+String(next%60).padStart(2,'0')};
}
function perform(save,entry){
 if(!entry?.ok)return {ok:false,reason:'No valid performance ticket.'};
 const event=available(save),time=number(save?.worldCalendar?.worldMinute);
 if(!event||event.id!==entry.event.id||time===null||time<entry.finish)
  return {ok:false,reason:'The show has not finished.'};
 if((save.circusPerformances||[]).some(x=>x.key===entry.key))
  return {ok:false,reason:'Performance already recorded.'};
 const first=ACTS[(entry.start%ACTS.length+ACTS.length)%ACTS.length];
 const second=ACTS[(ACTS.indexOf(first)+2)%ACTS.length];
 const report={key:entry.key,circusId:event.id,completed:true,minute:time,
  admissionCents:FEE_CENTS,acts:[first,second],description:first.description+' '+second.description};
 if(!Array.isArray(save.circusPerformances))save.circusPerformances=[];
 save.circusPerformances.push(report);save.circusPerformances=save.circusPerformances.slice(-60);
 root.FE_CIRCUS_TOUR?.attend?.(save,event.id);
 return {ok:true,report};
}
const api=Object.freeze({FEE_CENTS,DURATION_SECONDS,TIMES,ACTS,available,slot,perform});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_CIRCUS_BIG_TOP=api;
})(typeof window!=='undefined'?window:globalThis);
