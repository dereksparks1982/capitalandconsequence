/* District Asylum incident: campaign truth fixed before evidence.
 * No player-controlled character is assigned secret guilt. Investigation and
 * witness information must be earned through separate verified interactions.
 */
(function(root){'use strict';
const ROLES=Object.freeze(['attendant','patient','director','outside-visitor']);
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function start(world,{id,at,victimId}={}){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id))throw Error('Shared world record required');
 if(typeof id!=='string'||!/^asylum-[a-zA-Z0-9_-]{3,60}$/.test(id)||
    typeof at!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(at)||
    typeof victimId!=='string'||!victimId)throw Error('A dated asylum incident and identifiable victim are required');
 if(world.incidents[id])return {status:'existing',incident:{...world.incidents[id]}};
 // Resolve the truth ONCE per campaign. No clues or testimony exist yet.
 const culpritRole=ROLES[hash(world.id+'|'+id+'|truth')%ROLES.length];
 const truth={incidentId:id,culpritRole,victimId,at,locationId:'blackwoodAsylum',
  // Do not manufacture evidence from this role. A full timeline must be
  // established by the independent NPC movement and physical-state services.
  evidenceReady:false,verifiedTimeline:null};
 const visible={id,at,victimId,locationId:'blackwoodAsylum',kind:'unexplained-death',
  status:'reported',evidenceIds:[]};
 world.worldTruth[id]=truth;world.incidents[id]=visible;
 root.FE_SHARED_WORLD.recordEvent(world,{id:'incident:'+id,type:'asylum-death',
  at,summary:'An unexplained death was reported at District Asylum.',
  locationId:'blackwoodAsylum'});
 return {status:'created',incident:{...visible}};
}
function publicFile(world,id){
 const v=world?.incidents?.[id];if(!v)return null;
 return {id:v.id,at:v.at,victimId:v.victimId,locationId:v.locationId,
  status:v.status,evidenceIds:[...(v.evidenceIds||[])]};
}
function observe(save,{incidentId,eventId,source,description,at}={}){
 if(!save?.sharedWorldId||typeof eventId!=='string'||!eventId||
  typeof source!=='string'||!source||typeof description!=='string'||!description)
  return {ok:false,reason:'A sourced, witnessed observation is required'};
 if(!save.incidentObservations||save.incidentObservations.version!==1)
  save.incidentObservations={version:1,records:[]};
 const records=save.incidentObservations.records;
 if(records.some(x=>x.eventId===eventId))return {ok:true,status:'duplicate'};
 const row={incidentId,eventId,source:source.slice(0,120),description:description.slice(0,600),
  at:String(at||save.gameDate)};
 records.push(row);return {ok:true,status:'recorded',observation:{...row}};
}
const api=Object.freeze({start,publicFile,observe});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ASYLUM_INCIDENT=api;
})(typeof window!=='undefined'?window:globalThis);
