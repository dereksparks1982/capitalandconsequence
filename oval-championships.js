/* Last-Sunday D.C. kennel and motor-racing championship calendar.
 * The original regular two-heats-and-final race engine remains in control.
 * No clock manipulation and no underground events.
 */
(function(root){'use strict';
const START=Object.freeze({dog:'1919-01-01',car:'1933-01-01'});
function day(date){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
 const d=new Date(date+'T00:00:00Z');
 return Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==date?null:d;
}
function isChampionship(kind,date){
 const d=day(date);if(!d||!START[kind]||date<START[kind]||d.getUTCDay()!==0)return false;
 return new Date(d.getTime()+7*86400000).getUTCMonth()!==d.getUTCMonth();
}
function open(ledger,kind,date,entrants,engine){
 if(!isChampionship(kind,date))return null;
 if(!engine||!Array.isArray(entrants)||entrants.length!==12)throw Error('Twelve real qualifiers and a championship engine are required');
 const id=engine.key(kind,date);
 const tournament=engine.open(engine.init(ledger),{sport:kind,date,entrants:entrants.map(String)});
 if(tournament.id!==id)throw Error('Unexpected championship identity');
 return id;
}
function result(ledger,kind,date,tournamentId,eventId,placing,engine){
 if(!engine||!isChampionship(kind,date))throw Error('This is not an authorized D.C. championship date');
 const roundId={dog:{D1:'heat-a',D2:'heat-b',DF:'final'},car:{C1:'heat-a',C2:'heat-b',CF:'final'}}[kind]?.[eventId];
 if(!roundId)throw Error('Event is not a scheduled title qualifier or final');
 if(!Array.isArray(placing)||!placing.length)throw Error('Actual finish order required');
 return engine.round(engine.init(ledger),{tournamentId,roundId,order:placing.map(String),date});
}
const api=Object.freeze({version:1,isChampionship,open,result});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_OVAL_CHAMPIONSHIPS=api;
})(typeof window!=='undefined'?window:globalThis);
