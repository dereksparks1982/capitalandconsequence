/* District General Hospital morgue registry.
 * No body exists until a verified incident has been created in shared Washington.
 * Examinations are clinical observations, not suspect identification.
 */
(function(root){'use strict';
const copy=v=>JSON.parse(JSON.stringify(v));
function ensure(world){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id))throw Error('Shared world required');
 if(!world.morgue||world.morgue.version!==1)
  world.morgue={version:1,bodies:{},reports:{},
   coroner:{id:'districtCoroner',title:'District hospital coroner',
    dutyHours:{start:9*60,end:17*60},named:false}};
 return world.morgue;
}
function admit(world,{bodyId,incidentId,arrivedAt}={}){
 const m=ensure(world),incident=world.incidents?.[incidentId];
 if(!incident||incident.locationId!=='blackwoodAsylum')return {ok:false,reason:'No verified asylum death has been reported'};
 if(typeof bodyId!=='string'||!bodyId||bodyId.length>100||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(arrivedAt||''))
  return {ok:false,reason:'A stable body ID and intake time are required'};
 if(m.bodies[bodyId])return {ok:true,status:'existing',body:copy(m.bodies[bodyId])};
 const body={id:bodyId,incidentId,victimId:incident.victimId,arrivedAt,
  facility:'governmentHospital',room:'morgue',status:'awaiting-examination'};
 m.bodies[bodyId]=body;
 root.FE_SHARED_WORLD.recordEvent(world,{id:'morgue-intake:'+bodyId,type:'hospital-intake',at:arrivedAt,
  summary:'The hospital received a body related to a reported death.',locationId:'governmentHospital'});
 return {ok:true,status:'admitted',body:copy(body)};
}
function examine(world,{bodyId,examinerId,examinedAt,findings}={}){
 const m=ensure(world),body=m.bodies[bodyId],truth=world.worldTruth?.[body?.incidentId];
 if(!body)return {ok:false,reason:'No registered body'};
 if(m.reports[bodyId])return {ok:true,status:'existing',report:copy(m.reports[bodyId])};
 if(examinerId!==m.coroner.id)return {ok:false,reason:'Authorized coroner required'};
 if(typeof examinedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(examinedAt))
  return {ok:false,reason:'Examination date and hour required'};
 const minutes=Number(examinedAt.slice(11,13))*60+Number(examinedAt.slice(14,16));
 if(minutes<m.coroner.dutyHours.start||minutes>=m.coroner.dutyHours.end||
   examinedAt<body.arrivedAt)return {ok:false,reason:'Coroner not available or body not yet admitted'};
 // Only findings actually supported by the incident's independently
 // confirmed physical timeline may enter the record. No synthetic report.
 if(!truth?.evidenceReady||!Array.isArray(truth.verifiedTimeline?.medicalFindings)||
    !Array.isArray(findings)||findings.some(f=>!truth.verifiedTimeline.medicalFindings.includes(f)))
  return {ok:false,reason:'Verified medical findings unavailable'};
 const report={bodyId,incidentId:body.incidentId,examinerId,examinedAt,
  findings:[...new Set(findings)],provenance:'District General Hospital · examined body'};
 m.reports[bodyId]=report;body.status='examined';
 return {ok:true,status:'recorded',report:copy(report)};
}
function requestReport(world,bodyId,{route,permission}={}){
 const m=ensure(world),report=m.reports[bodyId];
 if(!report)return {ok:false,reason:'No examination report filed'};
 if(route!=='investigator'||permission?.incidentId!==report.incidentId||
    permission?.access!=='coroner-report')return {ok:false,reason:'Authorization required'};
 return {ok:true,report:copy(report)};
}
const api=Object.freeze({ensure,admit,examine,requestReport});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MORGUE_REGISTRY=api;
})(typeof window!=='undefined'?window:globalThis);
