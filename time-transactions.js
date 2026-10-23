/* Federal Electric v0.6.50: single bridge for charged calendar durations.
 * Transitional: the legacy factory and market countdown remain separately authoritative.
 * No offline progression, real wall-time input or fabricated legacy timestamps.
 */
(function(root){
 'use strict';
 const bridge=typeof module==='object'&&module.exports?require('./calendar-bridge.js'):root.FE_CALENDAR_BRIDGE;
 if(!bridge)throw Error('Calendar bridge required');
 const KINDS=['tick','action','travel'];
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('Save object required');
  let l=save.worldTimeLedger;
  if(!l||l.version!==1||!Array.isArray(l.entries))
   save.worldTimeLedger=l={version:1,nextSequence:0,tickSeconds:0,entries:[]};
  if(!Number.isSafeInteger(l.nextSequence)||l.nextSequence<0)l.nextSequence=0;
  if(!Number.isSafeInteger(l.tickSeconds)||l.tickSeconds<0)l.tickSeconds=0;
  if(l.entries.length>128)l.entries.splice(0,l.entries.length-128);
  return l;
 }
 function advance(save,seconds,kind='action',token=null){
  if(!Number.isSafeInteger(seconds)||seconds<0)throw Error('Nonnegative integer seconds required');
  if(!KINDS.includes(kind))throw Error('Unknown world time charge');
  if(token!==null&&(typeof token!=='string'||!token||token.length>128))throw Error('Invalid time token');
  if(kind==='tick'&&token!==null)throw Error('Passive tick token forbidden');
  if(!save||typeof save!=='object')throw Error('Save object required');
  if(save.paused)return {status:'paused',applied:false,wholeMinutes:0};
  if(!seconds)return {status:'no-op',applied:false,wholeMinutes:0};
  const ledger=ensure(save);
  if(token&&ledger.entries.some(e=>e.token===token))
   return {status:'duplicate',applied:false,wholeMinutes:0};
  const before=bridge.moment(save)?.iso||null;
  const wholeMinutes=bridge.spend(save,seconds);
  const after=bridge.moment(save)?.iso||null;
  if(kind==='tick')ledger.tickSeconds=Math.min(Number.MAX_SAFE_INTEGER,ledger.tickSeconds+seconds);
  else{
   ledger.nextSequence++;
   ledger.entries.push({sequence:ledger.nextSequence,kind,token,seconds,before,after,mapped:before!==null});
   if(ledger.entries.length>128)ledger.entries.shift();
  }
  return {status:before!==null?'applied':'legacy-unmapped',applied:before!==null,wholeMinutes,before,after};
 }
 function entries(save){return ensure(save).entries.map(e=>({...e}));}
 const api=Object.freeze({advance,ensure,entries});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_TIME_TX=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
