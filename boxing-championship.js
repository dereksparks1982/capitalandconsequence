/* District boxing: Saturday elimination contests, one active tournament per sport.
 * Competition may cross calendar months; no independent timers or world clock changes. */
(function(root){'use strict';
function saturday(date){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;const d=new Date(date+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===date&&d.getUTCDay()===6}
function next(ledger,date,roster,engine){
 if(!saturday(date)||!Array.isArray(roster)||!engine)return null;
 engine.init(ledger);
 let tournament=Object.values(ledger.tournaments).find(t=>t.sport==='boxing'&&t.status!=='complete');
 if(!tournament){
  // Once the first championship concludes, new seasons open on a month's first Saturday.
  if(ledger.titleHistory.some(x=>x.sport==='boxing')&&Number(date.slice(8,10))>7)return null;
  if(ledger.tournaments[engine.key('boxing',date)])return null;
  const groups=new Map();
  for(const f of roster){
   if(f.injury||!Number.isSafeInteger(f.id)||typeof f.weightClass!=='string')continue;
   if(!groups.has(f.weightClass))groups.set(f.weightClass,[]);
   groups.get(f.weightClass).push(f);
  }
  const classes=[...groups].filter(([,list])=>list.length>=4).sort(([a],[b])=>a.localeCompare(b));
  if(!classes.length)return null;
  const index=ledger.titleHistory.filter(x=>x.sport==='boxing').length%classes.length;
  const selected=classes[index][1].slice().sort((a,b)=>
   (Number(b.condition||0)-Number(a.condition||0))||a.id-b.id).slice(0,4);
  tournament=engine.open(ledger,{sport:'boxing',date,entrants:selected.map(f=>String(f.id))});
 }
 const roundId=['heat-a','heat-b','final'].find(id=>!tournament.rounds[id]?.result);
 if(!roundId)return null;
 let ids=tournament.rounds[roundId].ids;
 if(roundId==='final'&&!ids.length){
  if(!tournament.rounds['heat-a'].result||!tournament.rounds['heat-b'].result)return null;
  ids=[tournament.rounds['heat-a'].result[0],tournament.rounds['heat-b'].result[0]];
 }
 if(ids.length!==2||ids.some(id=>!roster.some(f=>String(f.id)===id)))return null;
 return {tournamentId:tournament.id,roundId,fighters:ids.map(Number)};
}
const api=Object.freeze({version:1,saturday,next});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_BOXING_CHAMPIONSHIP=api;
})(typeof window!=='undefined'?window:globalThis);
