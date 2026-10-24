/* Capital & Consequence: deterministic championship and betting ledger.
 * Explicit actions only. Never runs its own timer or changes the world clock.
 * All mutation is confined to the caller's per-profile autosave object.
 */
(function(root){'use strict';
const SPORTS=Object.freeze({
 horse:Object.freeze({label:'D.C. Horse Racing Champion',earliest:1878,field:12,advance:3}),
 boxing:Object.freeze({label:'D.C. Boxing Champion',earliest:1878,field:4,advance:1}),
 poker:Object.freeze({label:'D.C. Poker Champion',earliest:1878,field:8,advance:2}),
 dog:Object.freeze({label:'D.C. Kennel Champion',earliest:1919,field:12,advance:3}),
 car:Object.freeze({label:'D.C. Motor Racing Champion',earliest:1933,field:12,advance:3}),
 underground:Object.freeze({label:'Underground Fighting Champion',earliest:1878,field:4,advance:1})
});
const clone=x=>JSON.parse(JSON.stringify(x));
function checkDate(date){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Valid in-game ISO date required');
 const d=new Date(date+'T00:00:00Z');
 if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==date)throw Error('Invalid calendar day');
 return date.slice(0,7);
}
function validSport(s,date){
 const sport=SPORTS[s];if(!sport)throw Error('Unknown championship sport');
 if(Number(date.slice(0,4))<sport.earliest)throw Error('Sport is unavailable in this historical era');
 return sport;
}
function init(value){
 const s=value&&typeof value==='object'?value:{};
 if(!s.tournaments||typeof s.tournaments!=='object'||Array.isArray(s.tournaments))s.tournaments={};
 if(!s.champions||typeof s.champions!=='object'||Array.isArray(s.champions))s.champions={};
 if(!Array.isArray(s.titleHistory))s.titleHistory=[];
 if(!Array.isArray(s.wagers))s.wagers=[];
 s.version=1;return s;
}
function key(sport,date){return (sport==='poker'?'dc-poker-challenge':sport)+'-'+checkDate(date)}
function open(state,{sport,date,entrants}){
 init(state);const config=validSport(sport,date),id=key(sport,date);
 if(state.tournaments[id])return clone(state.tournaments[id]);
 if(!Array.isArray(entrants)||entrants.length!==config.field||new Set(entrants).size!==entrants.length||
 !entrants.every(x=>typeof x==='string'&&x.length>0&&x.length<=70))throw Error('Tournament requires distinct seeded entrants');
 const half=config.field/2,rounds={
  'heat-a':{ids:entrants.slice(0,half),result:null},
  'heat-b':{ids:entrants.slice(half),result:null},
  final:{ids:[],result:null}
 };
 state.tournaments[id]={id,sport,month:date.slice(0,7),entrants:entrants.slice(),rounds,status:'qualifying',champion:null};
 return clone(state.tournaments[id]);
}
function round(state,{tournamentId,roundId,order,date}){
 init(state);checkDate(date);
 const t=state.tournaments[tournamentId];if(!t)throw Error('Tournament not found');
 if(t.month!==date.slice(0,7))throw Error('Wrong tournament month');
 validSport(t.sport,date);
 if(!['heat-a','heat-b','final'].includes(roundId))throw Error('Unrecognized round');
 const r=t.rounds[roundId];if(r.result)throw Error('Results already finalized');
 if(roundId==='final'){
  if(!t.rounds['heat-a'].result||!t.rounds['heat-b'].result)throw Error('Qualifying rounds must finish first');
  if(!r.ids.length){
   const count=SPORTS[t.sport].advance;
   r.ids=[...t.rounds['heat-a'].result.slice(0,count),...t.rounds['heat-b'].result.slice(0,count)];
  }
 }
 if(!Array.isArray(order)||order.length!==r.ids.length||new Set(order).size!==order.length||order.some(x=>!r.ids.includes(x)))throw Error('Results must rank every actual round participant exactly once');
 r.result=order.slice();
 if(roundId==='final'){
  const winner=order[0];t.champion=winner;t.status='complete';
  state.champions[t.sport]={name:winner,month:t.month,tournamentId:t.id};
  state.titleHistory.push({sport:t.sport,name:winner,month:t.month,tournamentId:t.id});
 }else if(t.rounds['heat-a'].result&&t.rounds['heat-b'].result)t.status='final-ready';
 return {tournament:clone(t),payout:settleRound(state,tournamentId,roundId)};
}
function placeBet(state,{betId,tournamentId,roundId,market,selection,stake,decimalOdds,personalCash,date,law,venueId,game,explicitIllicit}){
 init(state);checkDate(date);
 const t=state.tournaments[tournamentId];if(!t)throw Error('Tournament not found');
 if(t.month!==date.slice(0,7))throw Error('Tournament month mismatch');
 const stage=market==='champion'?'final':roundId;
 if(market!=='round-winner'&&market!=='champion')throw Error('Unsupported wager market');
 if(!['heat-a','heat-b','final'].includes(stage))throw Error('Unsupported betting stage');
 if(t.status==='complete'||t.rounds[stage].result)throw Error('Outcome is already known');
 const eligible=market==='champion'?t.entrants:t.rounds[stage].ids;
 if(market==='round-winner'&&stage==='final'&&!eligible.length)throw Error('Finalists not determined');
 if(!eligible.includes(selection))throw Error('Selection is not eligible for this bet');
 if(typeof betId!=='string'||!betId||betId.length>100||state.wagers.some(x=>x.id===betId))throw Error('Duplicate or missing wager ID');
 if(!Number.isSafeInteger(stake)||stake<=0||!Number.isSafeInteger(personalCash)||stake>personalCash)throw Error('Insufficient personal cash');
 if(!Number.isFinite(decimalOdds)||decimalOdds<=1||decimalOdds>100)throw Error('Invalid fixed odds');
 if(!law||typeof law.classify!=='function')throw Error('Government gambling registry required');
 const classification=law.classify({venueId,game,eventKind:'tournament',tournamentId:t.id,eventId:stage,date});
 if(!classification.allowed||(!classification.legal&&!explicitIllicit))throw Error('Wager is not government-sanctioned; explicit illicit action required');
 state.wagers.push({id:betId,tournamentId,stage,market,selection,stake,decimalOdds,placedDate:date,
  legal:classification.legal,permitId:classification.permitId,venueId,settled:false,payout:0});
 return {debit:stake,personalCashAfter:personalCash-stake,legal:classification.legal};
}
function settleRound(state,tournamentId,roundId){
 let credit=0,settled=0;
 const t=state.tournaments[tournamentId],r=t.rounds[roundId];if(!r.result)return {credit:0,settled:0};
 for(const bet of state.wagers){
  if(bet.settled||bet.tournamentId!==tournamentId||bet.stage!==roundId)continue;
  if(bet.market==='champion'&&roundId!=='final')continue;
  bet.settled=true;bet.won=bet.selection===r.result[0];
  bet.payout=bet.won?Math.round(bet.stake*bet.decimalOdds):0;
  credit+=bet.payout;settled++;
 }
 return {credit,settled};
}
function view(state,sport,date){
 init(state);checkDate(date);const t=state.tournaments[key(sport,date)];
 return {tournament:t?clone(t):null,champion:state.champions[sport]?clone(state.champions[sport]):null};
}
const api=Object.freeze({version:1,sports:SPORTS,init,key,open,round,placeBet,view});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CHAMPIONSHIPS=api;
})(typeof window!=='undefined'?window:globalThis);
