/* Capital & Consequence: Metropolitan Police report desk.
 * Review requires elapsed SAVED game days and a real station visit.
 * A player's statement is evidence of what the player alleges, not proof.
 */
(function(root){
'use strict';
const DAY_MS=86400000;
function day(date){
 if(typeof date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))return null;
 const ms=Date.parse(date+'T00:00:00Z');
 return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===date?
  Math.floor(ms/DAY_MS):null;
}
function policeReports(save){
 return Array.isArray(save?.duelAftermath?.reports)?save.duelAftermath.reports:[];
}
function due(save,date){
 const today=day(date);
 if(today===null)return null;
 return policeReports(save).find(r=>
  r&&typeof r.id==='string'&&r.id.startsWith('police-intake:')&&
  r.source==='player-statement'&&r.status==='intake'&&
  Array.isArray(r.evidence)&&r.evidence.includes('player-statement')&&
  day(r.date)!==null&&today>day(r.date))||null;
}
function review(save,reportId,date,locationId){
 if(locationId!=='metropolitanPolice'||typeof reportId!=='string'||
  reportId.length>150)return null;
 const candidate=due(save,date);
 // Never review a report that was not genuinely submitted by THIS profile.
 if(!candidate||candidate.id!==reportId)return null;
 candidate.status='awaiting-corroboration';
 candidate.reviewedOn=date;
 candidate.review={source:'station-desk',summary:'Player statement received; no independent corroboration.',
  independentWitnesses:0,chargesFiled:false,arrestWarrant:false,
  caution:'An allegation is not a finding of guilt.'};
 return candidate;
}
function status(save,date){
 const reports=policeReports(save);
 const candidate=due(save,date);
 return {pendingIntakes:reports.filter(x=>x?.status==='intake').length,
  awaitingEvidence:reports.filter(x=>x?.status==='awaiting-corroboration').length,
  readyToReview:candidate?candidate.id:null,
  totalReports:reports.length};
}
const api=Object.freeze({due,review,status});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_POLICE_CASEWORK=api;
})(typeof window!=='undefined'?window:globalThis);
