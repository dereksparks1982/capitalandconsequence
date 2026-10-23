/* Federal Electric stockbroker: saved relationship and physical trading access. */
(function(root){
 'use strict';
 function ensure(save){
  if(!save||typeof save!=='object')throw new Error('Brokerage requires a saved profile');
  const b=save.brokerage;
  if(!b||b.version!==1||!Number.isSafeInteger(b.visits)||b.visits<0||
     (b.lastVisitDate!==null&&typeof b.lastVisitDate!=='string'))
   save.brokerage={version:1,visits:0,lastVisitDate:null};
  return save.brokerage;
 }
 function visit(save,date){
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error('Invalid game date');
  const b=ensure(save);
  if(b.lastVisitDate!==date){b.lastVisitDate=date;b.visits++}
  return progress(save);
 }
 function channel(save,locationId){
  const b=ensure(save);
  if(locationId==='brokerOffice')return 'office';
  if(locationId==='factory'&&b.visits>=3)return 'telegram';
  return null;
 }
 function progress(save){
  const b=ensure(save);
  return {visits:b.visits,wireAllowed:b.visits>=3,remaining:Math.max(0,3-b.visits)};
 }
 const api=Object.freeze({ensure,visit,channel,progress});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_BROKER=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
