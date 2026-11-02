/* Original offline Washington midway games, informed by public web game
 * patterns. No third-party game code or assets copied. Each round uses paid
 * in-world time, three deliberate player inputs and saved one-time prizes.
 */
(function(root){
'use strict';
const GAMES=Object.freeze({
 rings:{name:'Ring Toss',feeCents:5,seconds:180,attempts:3,action:'Toss a ring at peg',theme:'Wooden pegs and iron rings'},
 balloons:{name:'Balloon Darts',feeCents:6,seconds:180,attempts:3,action:'Throw a dart at balloon',theme:'Rows of colored balloons'},
 gallery:{name:'Tin Duck Shooting Gallery',feeCents:8,seconds:240,attempts:4,action:'Fire at a moving tin duck',theme:'Clockwork ducks, spring-loaded toy rifle'},
 cans:{name:'Knock Down the Cans',feeCents:4,seconds:180,attempts:3,action:'Throw a ball at stacked tins',theme:'Three pyramids of painted tins'},
 bell:{name:'High Striker Bell',feeCents:5,seconds:120,attempts:3,action:'Swing the mallet',theme:'A hammer, a tall post and a brass bell'},
 pennies:{name:'Penny Peg Drop',feeCents:3,seconds:120,attempts:3,action:'Drop a penny through pegs',theme:'Wooden pegs and numbered pockets'},
 clockwork:{name:'Clockwork Duck Challenge',feeCents:9,seconds:240,attempts:4,action:'Time your shot at a winding mechanical duck',theme:'Five moving target lanes and a hand-cranked mechanism'}
});
const PRIZES=Object.freeze({
 consolation:Object.freeze([{code:'paper-crown',name:'Painted Paper Crown',kind:'souvenir',description:'A cheap paper carnival crown.'},
  {code:'ticket-stub',name:'Circus Ticket Stub',kind:'collectible',description:'A faded admission ticket with its serial ink rubbed thin.'}]),
 small:Object.freeze([{code:'tin-whistle',name:'Tin Whistle',kind:'souvenir',description:'A shrill little whistle sold by the midway.'},
  {code:'wooden-horse',name:'Painted Wooden Horse',kind:'collectible',description:'A small wooden horse painted with careless brush strokes.'},
  {code:'rosette',name:'Scarlet Show Rosette',kind:'collectible',description:'A frayed red-and-gold prize ribbon.'}]),
 big:Object.freeze([{code:'brass-badge',name:'Circus Brass Badge',kind:'collectible',description:'A stamped brass badge issued by the traveling show.'},
  {code:'clockwork-duck',name:'Clockwork Tin Duck',kind:'special',description:'A functioning mechanical toy duck with a winding key.'}]),
 rare:Object.freeze([{code:'silver-compass',name:'Engraved Pocket Compass',kind:'rare',description:'An unusually fine little pocket compass, marked with the circus insignia.'},
  {code:'ringmaster-token',name:'Ringmaster’s Brass Medallion',kind:'rare',description:'An uncommon stamped medallion bearing the troupe master’s crest.'}])
});
function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.carnivalGames||save.carnivalGames.version!==1||!Array.isArray(save.carnivalGames.history))
  save.carnivalGames={version:1,serial:0,active:null,history:[]};
 return save.carnivalGames;
}
function available(save){
 const engagement=root.FE_CIRCUS_TOUR?.active?.(save);
 return engagement&&save?.currentLocation?.locationId===engagement.locationId?engagement:null;
}
function start(save,key){
 const conf=GAMES[key],engagement=available(save),state=ensure(save);
 if(!conf||!state)return {ok:false,reason:'Unknown carnival booth.'};
 if(!engagement)return {ok:false,reason:'You must be at the active traveling circus.'};
 if(state.active)return {ok:false,reason:'Finish your current carnival game first.'};
 const balance=Math.round((Number(save.personalCash)||0)*100);
 if(balance<conf.feeCents)return {ok:false,reason:'You cannot afford the booth fee.'};
 if(state.serial>200000)return {ok:false,reason:'The carnival ledger is full.'};
 const round={id:'midway-'+engagement.id.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,36)+'-'+key+'-'+(state.serial+1),
  engagementId:engagement.id,key,plays:[],score:0,attempts:conf.attempts,
  paidCents:conf.feeCents,startedMinute:save.worldCalendar?.worldMinute??null,
  ...(key==='clockwork'?{movesInTurn:0,totalMechanismMoves:0,moves:[]}: {})};
 save.personalCash=(balance-conf.feeCents)/100;
 state.serial++;state.active=round;
 return {ok:true,round:{...round}};
}
function target(round,index){
 if(round.key==='clockwork')return (hash(round.id+'|clockwork-peg')%5+index*2+(round.movesInTurn||0))%5;
 return hash(round.id+'|target|'+index)%5;
}
function advanceTarget(save,spentSeconds){
 const round=save?.carnivalGames?.active;
 if(!round||round.key!=='clockwork')return {ok:false,reason:'No paid clockwork duck round is underway.'};
 if(!available(save)||save.paused||save.phase==='report')
  return {ok:false,reason:'The mechanical target only moves at an active Washington circus booth.'};
 if(spentSeconds!==30)return {ok:false,reason:'Wait a complete thirty charged game seconds to turn the mechanism.'};
 if(round.movesInTurn>=2)return {ok:false,reason:'The operator allows only two target changes per shot.'};
 const before=target(round,round.plays.length);
 round.movesInTurn++;round.totalMechanismMoves++;
 round.moves.push({step:round.plays.length+1,minute:save.worldCalendar?.worldMinute||null,
  previousLane:before,lane:target(round,round.plays.length)});
 return {ok:true,moved:true,lane:target(round,round.plays.length),roundId:round.id};
}
function preview(round){
 if(!round||!GAMES[round.key])return null;
 const attempt=round.plays.length;
 const mark=target(round,attempt),zone=mark<=1?'left side':mark===2?'middle':'right side';
 return {game:GAMES[round.key],step:attempt+1,total:GAMES[round.key].attempts,
  score:round.score,lanes:5,zone,done:attempt>=GAMES[round.key].attempts,
  ...(round.key==='clockwork'?{movingLane:mark+1,movesRemaining:Math.max(0,2-(round.movesInTurn||0)),
    shotSeconds:30}: {})};
}
function throwAt(save,choice,award){
 const state=ensure(save),round=state?.active;
 if(!round||!GAMES[round.key])return {ok:false,reason:'No paid round is active.'};
 if(!Number.isInteger(choice)||choice<0||choice>4)return {ok:false,reason:'Choose one of the five targets.'};
 const n=round.plays.length,conf=GAMES[round.key];
 if(n>=conf.attempts)return {ok:false,reason:'This round has finished.'};
 const mark=target(round,n),gap=Math.abs(choice-mark);
 // A game-specific scoring pattern. Booths are deliberately not all the
 // same random result under a different title.
 const points=round.key==='bell'?(gap===0?5:gap===1?3:gap===2?1:0):
  round.key==='pennies'?(gap===0?4:gap===1?2:0):
  round.key==='cans'?(gap===0?4:gap===1?2:1):
  round.key==='gallery'?(gap===0?4:gap===1?1:0):
  (gap===0?4:gap===1?2:0);
 const hit=points>=2;
 round.plays.push({choice,mark,points});round.score+=points;
 if(round.key==='clockwork')round.movesInTurn=0;
 if(round.plays.length<conf.attempts)return {ok:true,finished:false,hit,points,round:{...round}};
 const max=conf.attempts*(round.key==='bell'?5:4);
 const fraction=round.score/max;
 let tier=fraction>=.8?'big':fraction>=.5?'small':fraction>=.25?'consolation':'none';
 // A great performance only very occasionally earns a genuinely rare object.
 if(tier==='big'&&hash(round.id+'|rare')%18===0)tier='rare';
 const pool=PRIZES[tier]||[],pick=pool.length?pool[hash(round.id+'|prize')%pool.length]:null;
 const record={...round,tier,finishedMinute:save.worldCalendar?.worldMinute??null,prize:null};
 state.history.push(record);state.history=state.history.slice(-120);
 state.active=null;
 if(pick){
  const prize={id:round.id+'-'+pick.code,name:pick.name,kind:pick.kind,
   description:pick.description+' Won at '+conf.name+'.'};
  const result=typeof award==='function'?award(prize):{ok:false,reason:'No physical-item inventory available.'};
  if(result?.ok)record.prize=prize;
  else record.unclaimed=prize; // never silently erase a won prize
 }
 return {ok:true,finished:true,hit,points,score:round.score,max,tier,record};
}
function claim(save,award){
 const state=ensure(save),result=[];
 for(const entry of state.history){
  if(!entry.unclaimed)continue;
  const x=typeof award==='function'?award(entry.unclaimed):null;
  if(x?.ok){entry.prize=entry.unclaimed;delete entry.unclaimed;result.push(entry.prize)}
 }
 return result;
}
const api=Object.freeze({GAMES,PRIZES,ensure,available,start,preview,throwAt,advanceTarget,claim});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_CARNIVAL_GAMES=api;
})(typeof window!=='undefined'?window:globalThis);
