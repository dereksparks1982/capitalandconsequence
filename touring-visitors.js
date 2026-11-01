/* Capital & Consequence: real street movement for two visiting circus
 * characters. Reuses actual street routes and the game's Washington clock.
 * A public circus is known to all, but its individual travelers are not.
 */
(function(root){
'use strict';
const PEOPLE=Object.freeze([
 Object.freeze({id:'visiting-fortune-teller',name:'The Traveling Fortune-Teller',
  occupation:'Traveling tarot reader',vehicle:'wagon',approach:'star',
  activity:'reading cards privately in her wagon'}),
 Object.freeze({id:'silasPike',name:'Silas Pike',occupation:'Traveling salesman',
  vehicle:'wagon',approach:'hillsdale',activity:'showing merchandise at his stall'})
]);
const byId=id=>PEOPLE.find(p=>p.id===id);
function currentMinute(save){return save?.worldCalendarStatus==='ready'&&
 Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(save.touringVisitors?.version!==1||!save.touringVisitors.agents)
  save.touringVisitors={version:1,agents:{}};
 return save.touringVisitors;
}
function upcoming(save){
 const model=root.FE_CIRCUS_TOUR;
 if(!model?.seasonal)return null;
 const data=model.seasonal(save);
 return data&&Number.isSafeInteger(data.startMinute)&&
  Number.isSafeInteger(data.endMinute)?data:null;
}
function road(save,from,to){
 const planned=root.FE_NPC_STREET_TRAVEL?.plan?.(from,to,save);
 return planned&&Array.isArray(planned.routePoints)&&planned.routePoints.length>=2?
  planned:null;
}
function state(save,person,event,minute){
 const from=person.approach,to=event.locationId;
 const arrival=event.startMinute,leave=event.endMinute;
 // First wagon appears on the road two hours before its public engagement.
 // It is present on the actual registered grounds for the show, then leaves.
 const inboundStart=arrival-120,outboundEnd=leave+120;
 const base={id:person.id,name:person.name,activity:null,locationId:null,roomId:null,
  status:'off-duty',vehicle:person.vehicle,relationships:{},memories:[],energy:70};
 if(minute<inboundStart||minute>=outboundEnd)return base;
 if(minute>=arrival&&minute<leave)return {...base,status:'present',locationId:to,
  roomId:root.FederalElectricCity?.getLocation?.(to)?.defaultRoom||'grounds',
  activity:person.activity};
 const inbound=minute<arrival;
 const planned=road(save,inbound?from:to,inbound?to:from);
 // No printable road route means NO fabricated moving person or diagonal.
 if(!planned)return base;
 const start=inbound?inboundStart:leave,end=inbound?arrival:outboundEnd;
 const journey={version:1,from:inbound?from:to,to:inbound?to:from,
  vehicle:person.vehicle,departedAt:start,arrivesAt:end,
  routeType:planned.routeType,routePoints:planned.routePoints};
 return {...base,status:'travelling',activity:'traveling by horse-drawn wagon',
  locationId:null,roomId:null,journey};
}
function sync(save){
 const minute=currentMinute(save),book=ensure(save);
 if(minute===null||!book)return {ok:false,changed:false,reason:'Washington clock is unavailable.'};
 const event=upcoming(save);
 let changed=false;
 for(const person of PEOPLE){
  const next=event?state(save,person,event,minute):
   {id:person.id,name:person.name,status:'off-duty',locationId:null,roomId:null,
    activity:null,vehicle:person.vehicle,relationships:{},memories:[]};
  const prev=book.agents[person.id];
  const fingerprint=a=>JSON.stringify([a?.status,a?.locationId,a?.roomId,a?.journey?.departedAt,
   a?.journey?.arrivesAt,a?.journey?.from,a?.journey?.to,a?.activity]);
  if(!prev||fingerprint(prev)!==fingerprint(next))changed=true;
  book.agents[person.id]={...prev,...next,relationships:prev?.relationships||{},
   memories:prev?.memories||[]};
  // The normal resident dialogue card can meet touring characters ONLY when
  // their own actual position says present; no second independent AI schedule.
  if(save.npcSimulation?.agents)
   save.npcSimulation.agents[person.id]=book.agents[person.id];
 }
 return {ok:true,changed,eventId:event?.id||null};
}
function agent(save,id){return sync(save).ok?save.touringVisitors.agents[id]||null:null}
function visibleAt(save,locationId){
 if(!locationId||!sync(save).ok)return [];
 return PEOPLE.map(p=>save.touringVisitors.agents[p.id]).filter(a=>
  a.status==='present'&&a.locationId===locationId).map(a=>({
   id:a.id,name:a.name,roomId:a.roomId,activity:a.activity
  }));
}
const api=Object.freeze({PEOPLE,ensure,sync,agent,visibleAt,currentMinute});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_TOURING_VISITORS=api;
})(typeof window!=='undefined'?window:globalThis);
