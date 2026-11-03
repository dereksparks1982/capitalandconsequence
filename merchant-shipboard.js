/* Capital & Consequence: moving shipboard top-down play, one authoritative world clock.
 * Passenger-vessel save state and deterministic zero-stakes card table only.
 * Does not fabricate crew privileges, overseas routes, NPCs, money or ship speed.
 */
(function(root){
'use strict';
const MAPS=Object.freeze({
 steamer:[
  {id:'lower',name:'Cabins & Stores',rows:['############','#....#.....#','#.....H....#','#..B.......#','#..........#','#..B.......#','#........X.#','#..........#','############']},
  {id:'main',name:'Dining Saloon',rows:['############','#..........#','#.....H....#','#..........#','#..C....G..#','#..........#','#........W.#','#..........#','############']},
  {id:'upper',name:'Promenade Deck',rows:['############','#..........#','#.....H....#','#..........#','#..........#','#...O......#','#..........#','#........X.#','############']}
 ],
 schooner:[
  {id:'lower',name:'Passenger Berths & Mess',rows:['############','#..........#','#.....H....#','#..B.......#','#..C....G..#','#..........#','#........W.#','#..........#','############']},
  {id:'upper',name:'Weather Deck',rows:['############','#..........#','#.....H....#','#..........#','#..........#','#...O......#','#..........#','#..........#','############']}
 ]
});
const STATIONS=Object.freeze({rest:'B',meal:'G',water:'W',cards:'C',lookout:'O'});
const allowed=t=>typeof t==='string'&&/^[.BHCGWO]$/.test(t);
const no=reason=>({ok:false,reason}),yes=(reason,extra={})=>({ok:true,reason,...extra});
function decks(s){return MAPS[s?.passengerSea?.voyage?.type]||null}
function deck(s,id){return (decks(s)||[]).find(d=>d.id===id)||null}
function tile(s,id,x,y){return deck(s,id)?.rows?.[y]?.[x]??null}
function aboard(s){return s?.characterRoute==='industrialist'&&s.currentLocation?.locationId==='passengerVessel'&&!!s.passengerSea?.voyage&&!!decks(s)}
function ensure(s){
 if(!aboard(s))return null;
 const trip=s.passengerSea.voyage,init=trip.type==='schooner'?{deck:'lower',x:3,y:3}:{deck:'lower',x:3,y:5};
 let p=s.passengerSea.interior;
 if(!p||p.version!==1||p.voyageId!==trip.id){
  p={version:1,voyageId:trip.id,...init,game:{next:0,round:null,history:[]},observations:[]};
  s.passengerSea.interior=p;
 }
 if(!deck(s,p.deck)||!allowed(tile(s,p.deck,p.x,p.y)))Object.assign(p,init);
 if(!p.game||!Number.isSafeInteger(p.game.next))p.game={next:0,round:null,history:[]};
 if(!Array.isArray(p.game.history))p.game.history=[];
 if(!Array.isArray(p.observations))p.observations=[];
 return p;
}
function canAct(s,seconds=0){
 if(!aboard(s))return no('Charlie must be aboard an underway passenger vessel.');
 if(s.paused||s.phase==='report')return no('Shipboard activities are unavailable while paused or during reports.');
 if(s.worldCalendarStatus!=='ready'||!Number.isSafeInteger(s.worldCalendar?.worldMinute))return no('Saved world clock unavailable.');
 if(root.FE_MEDICAL_RECORDS?.pending?.(s))return no('Medical recovery must finish before another activity.');
 if(s.worldCalendar.worldMinute+Math.ceil(seconds/60)>=s.passengerSea.voyage.arrivalMinute)
  return no('The ship is approaching its berth. Finish docking before further shipboard activities.');
 return yes('Aboard, with game time available.',{seconds});
}
// A brief modeled squall closes exposed decks only after the real saved
// voyage has recorded rough seas. It never rerolls or changes the ship's ETA.
function roughWeather(s){
 const w=s?.passengerSea?.voyage?.weather,minute=s?.worldCalendar?.worldMinute;
 return !!w?.observed&&Number.isSafeInteger(w.triggerMinute)&&w.delayMinutes>0&&
  Number.isSafeInteger(minute)&&minute>=w.triggerMinute&&minute<w.triggerMinute+360;
}
function at(s,kind){const p=ensure(s);return !!p&&tile(s,p.deck,p.x,p.y)===STATIONS[kind]}
function stationOffer(s,kind,seconds=0){
 const a=canAct(s,seconds);if(!a.ok)return a;
 if(kind==='lookout'&&roughWeather(s))return no('The open-deck lookout is closed during rough seas.');
 if(!at(s,kind))return no('Walk to the '+({rest:'passenger berth',meal:'galley counter',water:'water stand',cards:'card table',lookout:'upper-deck lookout'}[kind]||'station')+' first.');
 return yes('At '+kind+'.',{seconds});
}
function moveOffer(s,x,y){
 const a=canAct(s,60);if(!a.ok)return a;
 const p=ensure(s);
 if(!Number.isInteger(x)||!Number.isInteger(y)||Math.abs(p.x-x)+Math.abs(p.y-y)!==1)return no('Walk one adjacent tile at a time.');
 return allowed(tile(s,p.deck,x,y))?yes('Walk one tile.',{seconds:60}):no('A wall or crew-only passage blocks the way.');
}
function move(s,x,y){
 const p=ensure(s);
 if(!p||Math.abs(p.x-x)+Math.abs(p.y-y)!==1||!allowed(tile(s,p.deck,x,y)))return no('Deck movement refused.');
 p.x=x;p.y=y;return yes('Walked on '+deck(s,p.deck).name+'.',{position:{deck:p.deck,x,y}});
}
function deckOffer(s,id){
 const a=canAct(s,60);if(!a.ok)return a;
 const p=ensure(s),list=decks(s),before=list.findIndex(v=>v.id===p.deck),after=list.findIndex(v=>v.id===id);
 if(after<0||Math.abs(before-after)!==1)return no('Only neighboring decks connect by this hatch.');
 if(id==='upper'&&roughWeather(s))return no('The captain closed the exposed upper deck until the squall passes.');
 return tile(s,p.deck,p.x,p.y)==='H'?yes('Stairs available.',{seconds:60}):no('Stand on the stair hatch first.');
}
function changeDeck(s,id){
 const p=ensure(s),list=decks(s);
 if(id==='upper'&&roughWeather(s))return no('The open deck is closed during rough weather.');
 if(!p||tile(s,p.deck,p.x,p.y)!=='H'||Math.abs(list.findIndex(v=>v.id===id)-list.findIndex(v=>v.id===p.deck))!==1)return no('Connected stairs required.');
 const d=deck(s,id),y=d.rows.findIndex(row=>row.includes('H'));
 p.deck=id;p.x=d.rows[y].indexOf('H');p.y=y;
 return yes('Climbed to '+d.name+'.',{position:{deck:p.deck,x:p.x,y:p.y}});
}
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h||1}
function shuffled(trip,id){
 const cards=Array.from({length:52},(_,i)=>i);
 let seed=hash([trip.id,trip.from,trip.to,trip.departMinute,id].join('|'));
 for(let i=51;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[cards[i],cards[j]]=[cards[j],cards[i]]}
 return cards;
}
function cardLabel(n){const rank=n%13+1,suit=['♠','♥','♦','♣'][Math.floor(n/13)];
 return (rank===1?'A':rank===11?'J':rank===12?'Q':rank===13?'K':String(rank))+suit;
}
function score(hand){let total=0,aces=0;for(const c of hand){const r=c%13+1;total+=r===1?11:Math.min(10,r);if(r===1)aces++}
 while(total>21&&aces-- >0)total-=10;return total}
function cardOffer(s,choice){
 const seconds={start:600,hit:300,stand:600}[choice];if(!seconds)return no('Unknown card action.');
 const a=stationOffer(s,'cards',seconds);if(!a.ok)return a;
 const r=ensure(s).game.round;
 if(choice==='start'&&ensure(s).dominoes?.hand?.status==='playing')return no('Finish your dominoes hand first.');
 if(choice==='start'&&root.FE_SHIP_CHECKERS?.ensure?.(s)?.active)return no('Finish your draughts game first.');
 if(choice==='start'&&r?.status==='playing')return no('Finish the current hand first.');
 if(choice!=='start'&&r?.status!=='playing')return no('Deal a hand first.');
 return yes('Card-table turn ready.',{seconds});
}
function settle(g,r){
 const p=score(r.player),h=score(r.house);
 r.status=p>21?'lost':h>21||p>h?'won':p===h?'draw':'lost';
 g.history.push({id:r.id,result:r.status,player:p,house:h});g.history=g.history.slice(-30);
}
function cardAct(s,choice){
 const p=ensure(s);if(!p||!at(s,'cards'))return no('Charles is no longer at the card table.');
 const g=p.game;
 if(choice==='start'){
  if(g.round?.status==='playing')return no('A hand is already in progress.');
  const id=++g.next,deck=shuffled(s.passengerSea.voyage,id);
  g.round={id,deck,cursor:4,player:[deck[0],deck[2]],house:[deck[1],deck[3]],status:'playing'};
  return yes('Dealt a casual game of twenty-one.',{round:g.round});
 }
 const r=g.round;if(r?.status!=='playing')return no('No unfinished hand.');
 if(choice==='hit'){
  r.player.push(r.deck[r.cursor++]);
  if(score(r.player)>21)settle(g,r);
  return yes(r.status==='playing'?'Drew '+cardLabel(r.player[r.player.length-1])+'.':'Bust: the other player wins.',{round:r});
 }
 if(choice==='stand'){
  while(score(r.house)<17&&r.cursor<52)r.house.push(r.deck[r.cursor++]);
  settle(g,r);return yes('Hand settled: '+r.status+'. No money wagered.',{round:r});
 }
 return no('Unknown card choice.');
}
function lookout(s){
 const p=ensure(s);if(!p||!at(s,'lookout'))return no('Reach the upper-deck lookout first.');
 if(roughWeather(s))return no('The lookout is shut during rough seas.');
 p.observations.push({minute:s.worldCalendar.worldMinute,voyageId:p.voyageId});
 p.observations=p.observations.slice(-20);
 return yes('Watched the sea for five minutes while the ship continued moving.');
}
const api=Object.freeze({MAPS,STATIONS,decks,deck,tile,allowed,ensure,canAct,roughWeather,at,stationOffer,moveOffer,move,deckOffer,changeDeck,cardOffer,cardAct,cardLabel,score,lookout});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHIPBOARD=api;
})(typeof window!=='undefined'?window:globalThis);
