/* v0.6.16: physical asset record for horses and carriages.
   No free starter horse, no unpriced purchases and no automatic teleport.
   Acquisition/purchase flow is planned, not offered in ordinary play. */
(function(){
'use strict';
const STATUSES=Object.freeze(['tethered','stabled','traveling','missing','stolen','in-care']);
function ensure(){
 if(!S.transport||typeof S.transport!=='object')S.transport={version:1,assets:[],events:[]};
 if(!Array.isArray(S.transport.assets))S.transport.assets=[];
 if(!Array.isArray(S.transport.events))S.transport.events=[];
 return S.transport;
}
function list(){return ensure().assets.map(v=>({...v}))}
function at(locationId){return list().filter(v=>v.locationId===locationId&&v.status!=='missing'&&v.status!=='stolen')}
function get(id){return list().find(v=>v.id===id)||null}
function canMove(id,from){
 const v=get(id);return !!(v&&v.locationId===from&&['tethered','stabled','in-care'].includes(v.status));
}
// Called only by the future validated journey resolver. Cannot create assets.
function arrive(id,from,to,recordId){
 const world=ensure();
 if(typeof recordId!=='string'||!recordId||world.events.some(e=>e.id===recordId))return false;
 const v=world.assets.find(v=>v.id===id);
 if(!v||!canMove(id,from)||typeof to!=='string'||!to||to===from)return false;
 v.locationId=to;v.status='tethered';
 world.events.push({id:recordId,assetId:id,type:'relocation',from,to,turn:S.turnSerial});
 save(true);return true;
}
function setStatus(id,status,recordId){
 const world=ensure();
 if(!STATUSES.includes(status)||typeof recordId!=='string'||!recordId||world.events.some(v=>v.id===recordId))return false;
 const v=world.assets.find(v=>v.id===id);if(!v)return false;
 if(v.status===status)return false;
 const from=v.status;v.status=status;
 world.events.push({id:recordId,assetId:id,type:'status',from,to:status,turn:S.turnSerial});
 save(true);return true;
}
// Location changes caused by an incident must be deliberately resolved and saved;
// no random reappearance at an office, home, or other location.
function incident(id,kind,recordId,targetLocationId){
 const world=ensure();
 if(!['stolen','missing','returned'].includes(kind)||typeof recordId!=='string'||!recordId||world.events.some(v=>v.id===recordId))return false;
 const v=world.assets.find(v=>v.id===id);if(!v)return false;
 if(kind==='returned'){
  if(!['missing','stolen'].includes(v.status)||!targetLocationId)return false;
  v.locationId=targetLocationId;v.status='stabled';
 }else{
  if(['missing','stolen'].includes(v.status))return false;
  v.status=kind;
 }
 world.events.push({id:recordId,assetId:id,type:kind,to:v.locationId,turn:S.turnSerial});
 save(true);return true;
}
function renderRegister(){
 const dest=document.getElementById('personalTransportStatus');if(!dest)return;
 const goods=list();if(!goods.length){dest.textContent='No personally owned horses or carriages recorded.';return}
 dest.replaceChildren();
 const lines=document.createElement('ul');
 for(const v of goods){const li=document.createElement('li');li.textContent=v.name+' · '+v.kind+' · '+v.status+' · last known: '+v.locationId;lines.appendChild(li)}
 dest.appendChild(lines);
}
window.FE_TRANSPORT=Object.freeze({get,list,at,canMove,arrive,setStatus,incident,renderRegister});
// Intentionally no create/give-asset action: ownership requires a future transaction.
})();
