/* Federal Electric stockbroker: saved relationship and physical trading access. */
(function(root){
 'use strict';
 function ensure(save){
  if(!save||typeof save!=='object')throw new Error('Brokerage requires a saved profile');
  const b=save.brokerage;
  if(!b||b.version!==1||!Number.isSafeInteger(b.visits)||b.visits<0||
     (b.lastVisitDate!==null&&typeof b.lastVisitDate!=='string'))
   save.brokerage={version:1,visits:0,lastVisitDate:null};
  if(!Array.isArray(save.brokerage.notices))save.brokerage.notices=[];
  return save.brokerage;
 }
 function visit(save,date){
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error('Invalid game date');
  const b=ensure(save);
  if(b.lastVisitDate!==date){b.lastVisitDate=date;b.visits++}
  return progress(save);
 }
 function channel(save,locationId,careerId='industrialist'){
  const b=ensure(save);
  if(locationId==='brokerOffice')return 'office';
  if(locationId==='factory'&&careerId==='industrialist'&&b.visits>=3)return 'telegram';
  return null;
 }
 // Publicly posted price histories only: never read hiddenPrice or future events.
 function observation(stocks,portfolio){
  if(!stocks||!portfolio)return null;
  const held=Object.entries(portfolio).filter(([k,p])=>p&&p.shares>0&&stocks[k]);
  if(!held.length)return null;
  const ranked=held.map(([ticker,p])=>{
   const x=stocks[ticker],history=Array.isArray(x.history)?x.history.filter(h=>h&&Number.isFinite(+h.close)&&+h.close>0):[];
   const anchor=history.length>=5?+history[history.length-5].close:(+x.prevClose||+x.open||+x.price);
   const published=+x.price;
   return {ticker,change:anchor>0&&published>0?(published/anchor-1)*100:0};
  }).sort((a,b)=>a.change-b.change||a.ticker.localeCompare(b.ticker));
  const worst=ranked[0],change=Math.round(worst.change*10)/10;
  if(change<=-1.5)return {kind:'caution',ticker:worst.ticker,change,
   text:'Published quotations for '+worst.ticker+' have weakened by '+Math.abs(change).toFixed(1)+'%. Consider whether to reduce your holding. I cannot know what the exchange will do tomorrow.'};
  return {kind:'routine',ticker:worst.ticker,change,
   text:'Your holdings show no pronounced weakness in the published quotations. No investment is without risk.'};
 }
 function recordObservation(save,date,stocks,portfolio){
  const b=ensure(save);
  if(b.lastVisitDate!==date||b.notices.some(n=>n.date===date))return null;
  const assessment=observation(stocks,portfolio);if(!assessment)return null;
  const entry={date,ticker:assessment.ticker,kind:assessment.kind,text:assessment.text};
  b.notices.push(entry);
  if(b.notices.length>30)b.notices.splice(0,b.notices.length-30);
  return entry;
 }
 function progress(save){
  const b=ensure(save);
  return {visits:b.visits,wireAllowed:b.visits>=3,remaining:Math.max(0,3-b.visits)};
 }
 const api=Object.freeze({ensure,visit,channel,progress,observation,recordObservation});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_BROKER=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
